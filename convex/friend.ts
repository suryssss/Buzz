import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { getUserByClerkId } from "./utils";

export const remove = mutation({
  args: {
    conversationId: v.id("conversations"),
    type: v.optional(v.string()),
    content: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const currentUser = await getUserByClerkId({
      ctx,
      clerkId: identity.subject,
    });
    if (!currentUser) throw new Error("User not found");

   const conversation=await ctx.db.get(args.conversationId)
   if(!conversation) throw new Error("Conversation not found")


    const members=await ctx.db.query("conversationMembers")
    .withIndex("by_conversationId",(q)=>q.eq("conversationId",args.conversationId))
    .collect()

    if(!members||members.length!==2){
        throw new Error("Conversation do not have any members")
    }

    const friendships=await ctx.db.query("friends")
    .withIndex("by_conversationId",(q)=>q.eq("conversationId",args.conversationId))
    .unique()

    if(!friendships){
        throw new Error("Friend could not found")
    }

    const message=await ctx.db.query("messages")
    .withIndex("by_conversationId",(q)=>q.eq("conversationId",args.conversationId))
    .collect()

    await ctx.db.delete(args.conversationId)

    await ctx.db.delete(friendships._id)

    await Promise.all(members.map(async member=>{
        await ctx.db.delete(member._id)
    }))

    await Promise.all(message.map(async message=>{
        await ctx.db.delete(message._id)
    }))



  },
});
