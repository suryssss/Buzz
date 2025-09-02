import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { getUserByClerkId } from "./utils";

export const create =mutation({
    args:{
        conversationId:v.id("conversations"),
        type:v.string(),
        content:v.array(v.string()),
    },
    handler:async(ctx,args)=>{
        const identity = await ctx.auth.getUserIdentity();
            if (!identity) throw new Error("Unauthorized");
        
            const currentUser = await getUserByClerkId({
              ctx,
              clerkId: identity.subject,
            });
            if (!currentUser) throw new Error("User not found");

            const member=await ctx.db.query("conversationMembers")
            .withIndex("by_memberId_conversationId",(q)=>q
            .eq("memberId",currentUser._id)
            .eq("conversationId",args.conversationId)).unique();

            if(!member) throw new Error ("You are not member of this conversation")
        const message=await ctx.db.insert("messages",{
    senderId:currentUser._id,
    ...args
        })        

        await ctx.db.patch(args.conversationId,{lastMessageId:message})

        return message

    }
})