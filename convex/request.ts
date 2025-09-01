import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { getUserByClerkId } from "./utils";

export const create = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    if (args.email === identity.email) {
      throw new Error("You can't send a request to yourself");
    }

    const senderUser = await getUserByClerkId({
      ctx,
      clerkId: identity.subject,
    });

    if (!senderUser) {
      throw new Error("User not found");
    }

    const receiver = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    if (!receiver) {
      throw new Error("User not found");
    }

    // Check if request already sent
    const requestAlreadySent = await ctx.db
      .query("requests")
      .withIndex("by_receiver_sender", (q) =>
        q.eq("receiver", receiver._id).eq("sender", senderUser._id)
      )
      .unique();

    if (requestAlreadySent) {
      throw new Error("Request already sent");
    }

    // Check if request already received (receiver already invited sender)
    const requestAlreadyReceived = await ctx.db
      .query("requests")
      .withIndex("by_receiver_sender", (q) =>
        q.eq("receiver", senderUser._id).eq("sender", receiver._id)
      )
      .unique();

    if (requestAlreadyReceived) {
      throw new Error("Request already received");
    }


    const friends1=await ctx.db.query
    ("friends").withIndex("by_user1",(q)=>q.eq
    ("user1",senderUser._id))
    .collect()

    const friends2=await ctx.db.query
    ("friends").withIndex("by_user2",(q)=>q.eq
    ("user2",senderUser._id))
    .collect()

    if(friends1.some(friend=>friend.user2===receiver._id)||friends2.some(friend=>friend.user1===receiver._id)){
      throw new Error("You are already friends")
    }


    // Insert new request
    const request = await ctx.db.insert("requests", {
      sender: senderUser._id,
      receiver: receiver._id,
    });

    return request;
  },
});

export const deny = mutation({
  args: {
    id: v.id("requests"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }


    
    const senderUser = await getUserByClerkId({
      ctx,
      clerkId: identity.subject,
    });

    if (!senderUser) {
      throw new Error("User not found");
    }
    const request =await ctx.db.get(args.id)

    if (!request|| request.receiver!==senderUser._id){
      throw new Error("Error Denying Request");
    }

    await ctx.db.delete(request._id)
    
  },
});


export const accept=mutation({
  args:{
    id:v.id("requests")
  },handler:async(ctx,args)=>{
     const identity=await ctx.auth.getUserIdentity()

     if(!identity){
      throw new Error("Unauthorized")
     }

     const senderUser=await getUserByClerkId({
      ctx,
      clerkId:identity.subject
     })

     if(!senderUser){
      throw new Error("User not found")
     }

     const request=await ctx.db.get(args.id)

     if(!request||request.receiver!==senderUser._id){
      throw new Error("Error Accepting Request")
     }
     const conversationId=await ctx.db.insert("conversations",{
      isGroup:false,
     })

     await ctx.db.insert("friends",{
      user1:senderUser._id,
      user2:request.sender,
      conversationId,
     })

     await ctx.db.insert("conversationMembers",{
      memberId:senderUser._id,
      conversationId,
     })

     await ctx.db.insert("conversationMembers",{
      memberId:request.sender,
      conversationId,
     })

     await ctx.db.delete(request._id)
     
  }
})
