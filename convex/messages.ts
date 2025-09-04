import { getUserByClerkId } from "./utils";
import { query } from "./_generated/server";
import { v } from "convex/values";



export const get = query({
  args: {
    id: v.id("conversations"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
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

    const limit = Math.max(1, Math.min(args.limit ?? 50, 200));

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversationId", (q) => q.eq("conversationId", args.id))
      .order("desc")
      .take(limit);

    const uniqueSenderIds = Array.from(new Set(messages.map((m) => m.senderId)));
    const senders = await Promise.all(uniqueSenderIds.map((id) => ctx.db.get(id)));
    const senderById = new Map(
      senders
        .filter(Boolean)
        .map((s) => [s!._id, { imageUrl: s!.imageUrl, username: s!.username }])
    );

    const enriched = messages.map((m) => {
      const sender = senderById.get(m.senderId);
      return {
        ...m,
        senderImage: sender?.imageUrl ?? "",
        senderName: sender?.username ?? "Unknown",
        isCurrentUser: m.senderId === currentUser._id,
      };
    });

    return enriched;
  },
});