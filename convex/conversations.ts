import { mutation, query } from "./_generated/server";
import { getUserByClerkId } from "./utils";
import { v } from "convex/values";

export const get = query({
  args: {
    id: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const currentUser = await getUserByClerkId({
      ctx,
      clerkId: identity.subject,
    });
    if (!currentUser) throw new Error("User not found");

    const conversation = await ctx.db.get(args.id);
    if (!conversation) throw new Error("Conversation not found");

    // check membership
    const member = await ctx.db
      .query("conversationMembers")
      .withIndex("by_memberId_conversationId", (q) =>
        q.eq("memberId", currentUser._id).eq("conversationId", conversation._id)
      )
      .unique();

    if (!member) throw new Error("You're not a member of this conversation");

    // get all members of the conversation
    const allConversationMembers = await ctx.db
      .query("conversationMembers")
      .withIndex("by_conversationId", (q) => q.eq("conversationId", args.id))
      .collect();

    if (!conversation.isGroup) {
      const otherMembers = allConversationMembers.filter(
        (m) => m.memberId !== currentUser._id
      );

      if (otherMembers.length === 0) {
        throw new Error("No other members found in this conversation");
      }

      const otherMemberDetails = await ctx.db.get(otherMembers[0].memberId);

      return {
        conversation,
        otherMember: {
          ...otherMemberDetails,
          lastSeenMessageId: otherMembers[0].lastSeenMessage,
        },
        otherMembers: [],
        members: [],
      };
    }else{
      const otherMembers=(await Promise.all(allConversationMembers.filter(member=>member.memberId!==currentUser._id))).map(async membership=>{
        const member=await ctx.db.get(membership.memberId)
        if(!member) throw new Error("Member could not be found")
        return {
          username:member.username
        }
      })
    }
    // group conversation → return with members
    const otherMembers = await Promise.all(
      allConversationMembers
        .filter((m) => m.memberId !== currentUser._id)
        .map(async (membership) => {
          const member = await ctx.db.get(membership.memberId);
          if (!member) throw new Error("Member could not be found");
          return { username: member.username };
        })
    );

    return {
      conversation,
      otherMember: null,
      otherMembers,
      members: await Promise.all(
        allConversationMembers.map(async (m) => ({
          ...m,
          user: await ctx.db.get(m.memberId),
        }))
      ),
    };
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

    await Promise.all(
      [...args.members,currentUser._id].map(async (memberId)=>{
        await ctx.db.insert("conversationMembers",{
          memberId,
          conversationId
        })
      })
    )

  }
})
