import { getUserByClerkId } from "./utils";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";


export const get = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const currentUser = await getUserByClerkId({
      ctx,
      clerkId: identity.subject,
    });
    if (!currentUser) throw new Error("User not found");


    const friendships1=await ctx.db.query("friends").withIndex("by_user1",(q)=>q.eq("user1",currentUser._id)).collect()
    const friendships2=await ctx.db.query("friends").withIndex("by_user2",(q)=>q.eq("user2",currentUser._id)).collect()

    const friendships=[...friendships1,...friendships2]

    const friends=await Promise.all(friendships.map(async friendship=>{
      const friend=await ctx.db.get(friendship.user1===currentUser._id?friendship.user2:friendship.user1)
      if(!friend) throw new Error("Friend not found")

        return friend
    }))

    return friends
  },
});


export const createGroup=mutation({
    args:{
        members:v.array(v.id("users")),
        name:v.string()
    },
    handler:async (ctx,args)=>{
        const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const currentUser = await getUserByClerkId({
      ctx,
      clerkId: identity.subject,
    });
    if (!currentUser) throw new Error("User not found");

    const conversationId=await ctx.db.insert("conversations",{
        isGroup:true,
        name:args.name
    })

    await Promise.all([...args.members,currentUser._id].map(async memberId=>{
        await ctx.db.insert("conversationMembers",{
            memberId,
            conversationId
        })
    }))
    }
    
})