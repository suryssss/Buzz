import { getUserByClerkId } from "./utils";
import { query } from "./_generated/server";
import { v } from "convex/values";



export const get = query({
  args: {
    id:v.id("conversations")
  },
  handler: async (ctx,args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const currentUser = await getUserByClerkId({
      ctx,
      clerkId: identity.subject,
    });
    if (!currentUser) throw new Error("User not found");

    const member = await ctx.db
    .query("conversationMembers")
    .withIndex("by_memberId_conversationId", (q) =>
      q
        .eq("memberId", currentUser._id)
        .eq("conversationId", args.id)
    )
    .unique();

  if (!member) throw new Error("You are not member of this conversation");

    const messages=await ctx.db.query("messages")
    .withIndex("by_conversationId",(q)=>q.eq("conversationId",args.id))
    .order("desc").collect()

    const messagesWithUser=Promise.all(
        messages.map(async messages =>{
            const messageSender=await ctx.db.get(messages.senderId)
            if(!messageSender) throw new Error("Message sender not found")

            return {
                ...messages,
                senderImage: messageSender.imageUrl,
                senderName:messageSender.username,
                isCurrentUser:messageSender._id===currentUser._id
            }
        })
    )

    return messagesWithUser
  },
});