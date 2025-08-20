import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { getUserByClerkId } from "./utils";
import { currentUser } from "@clerk/nextjs/server";

export const create=mutation({
    args:{
        email:v.string()
    },
    handler:async(ctx,args)=>{
        const identity=await ctx.auth.getUserIdentity()

        if(!identity){
            throw new Error("Unauthorized")
        }
        if (args.email==identity.email){
            throw new Error("You can't send a request to yourself")
        }

        const currentUser=await 
        getUserByClerkId({
            ctx,clerkId:identity.subject
        })

        if(!currentUser){
            throw new Error("User not found")
        }

        const receiver =await ctx.db.query
        ("users").withIndex("by_email",q=>q.
        eq("email",args.email)).unique() 

        if(!receiver){
            throw new Error("Usernot found")
        }

        const requestAlreadySent= await ctx.db.query
        ("requests").withIndex("by_receiver_sender",q=>q.eq
            ("receiver",receiver._id).
            eq("sender",currentUser._id)).
            unique()

        if(requestAlreadySent){
            throw new Error("Request already sent")
        }

        const requestAlreadyReceived= await ctx.db.query
        ("requests").withIndex("by_receiver_sender",(q) =>
            q.eq("receiver",currentUser._id).eq
            ("sender",receiver._id)).
            unique()

        if(requestAlreadyReceived){
            throw new Error("Request already received")
        }

        const request=await ctx.db.insert("requests",{
            sender:currentUser._id,
            receiver:receiver._id
        });

        return request
    }
})