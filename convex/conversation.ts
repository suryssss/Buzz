import { query } from "./_generated/server";
import { getUserByClerkId } from "./utils";

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

    // Get all memberships for this user
    const conversationMembers = await ctx.db
      .query("conversationMembers")
      .withIndex("by_memberId", (q) => q.eq("memberId", currentUser._id))
      .collect();

    // Get conversations the user belongs to
    const conversations = await Promise.all(
      conversationMembers.map(async (membership) => {
        const conversation = await ctx.db.get(membership.conversationId);
        if (!conversation) throw new Error("Conversation cannot be found");
        return conversation;
      })
    );

    // Get details for each conversation
    const conversationsWithDetails = await Promise.all(
      conversations.map(async (conversation) => {
        const allConversationMembers = await ctx.db
          .query("conversationMembers")
          .withIndex("by_conversationId", (q) =>
            q.eq("conversationId", conversation?._id)
          )
          .collect();

          if (conversation.isGroup){
            return {conversation}
          }
          else{
            const otherMembers=allConversationMembers.filter(
                (member)=>member.memberId!==currentUser._id
            )
            const otherMember=await ctx.db.get(otherMembers[0].memberId)
            return {conversation,otherMember}
          }
      })
    );

    return conversationsWithDetails

  },
});
