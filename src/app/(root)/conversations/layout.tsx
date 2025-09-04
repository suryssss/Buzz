"use client"

import List from "@/components/items/List";
import { useQuery } from "convex/react";
import React from "react";
import { api } from "../../../../convex/_generated/api";
import { Loader2 } from "lucide-react";
import MessageItem from "./components/MessageItem";
import CreateGroupDialog from "./components/CreateGroupDialog";
import GroupCoversationMessageItem from "./components/GroupConversationItem";

type Props = React.PropsWithChildren<{}>;

const ConversationLayout = ({ children }: Props) => {

  const conversations=useQuery(api.conversation.get)

  return (
    <>
    <List title="Conversations" action={<CreateGroupDialog/>}>
      {
        conversations ? conversations.length===0 ? <p className="w-full h-full flex items-center justify-center">
            No Conversations Found</p>: conversations.map(conversations=>{
              return conversations.conversation.isGroup ? <GroupCoversationMessageItem 
              key={conversations.conversation._id} 
              id={conversations.conversation._id}
              name={conversations.conversation.name || ""}
              lastMessageContent={conversations.lastMessage?.content}
              lastMessageSender={conversations.lastMessage?.sender} />  : <MessageItem 
              key={conversations.conversation._id} 
              id={conversations.conversation._id}
              username={conversations.otherMember?.username || ""}
              imageUrl={conversations.otherMember?.imageUrl || ""} 
              lastMessageContent={conversations.lastMessage?.content}
              lastMessageSender={conversations.lastMessage?.sender} />
            }) : <Loader2/>}
    </List>
      {children}
    </>
  );
};

export default ConversationLayout;
