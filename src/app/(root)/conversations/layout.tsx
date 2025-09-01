"use client"

import List from "@/components/items/List";
import { useQuery } from "convex/react";
import React from "react";
import { api } from "../../../../convex/_generated/api";
import { Loader2 } from "lucide-react";
import MessageItem from "./components/MessageItem";

type Props = React.PropsWithChildren<{}>;

const ConversationLayout = ({ children }: Props) => {

  const conversations=useQuery(api.conversation.get)

  return (
    <>
    <List title="Conversations">
      {
        conversations ? conversations.length===0 ? <p className="w-full h-full flex items-center justify-center">
            No Conversations Found</p>: conversations.map(conversations=>{
              return conversations.conversation.isGroup ? null : <MessageItem 
              key={conversations.conversation._id} 
              id={conversations.conversation._id}
              username={conversations.otherMember?.username || ""}
              imageUrl={conversations.otherMember?.imageUrl || ""}   />
            }) : <Loader2/>}
    </List>
      {children}
    </>
  );
};

export default ConversationLayout;
