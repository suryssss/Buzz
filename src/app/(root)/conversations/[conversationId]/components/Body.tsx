'use client'
import { Card } from '@/components/ui/card'
import { useConversation } from '@/hooks/useConversation'
import { useQuery } from 'convex/react'
import React from 'react'
import { api } from '../../../../../../convex/_generated/api'
import { Id } from '../../../../../../convex/_generated/dataModel'
import Message from './Message'

type Props = {}

const Body = (props: Props) => {
  const { conversationId } = useConversation()

  const messages = useQuery(api.messages.get, {
    id: conversationId as Id<'conversations'>,
  })

  return (
    <div className="flex-1 w-full flex overflow-y-scroll flex-col-reverse gap-2 p-3 no-scrollbar">
      {messages?.map((msg, index) => {
        const lastMessageByUser =
          index > 0 && messages[index - 1].senderId === msg.senderId

        return (
          <Message
            key={msg._id}
            fromCurrentUser={msg.isCurrentUser}
            senderImage={msg.senderImage}
            senderName={msg.senderName}
            lastMessageByUser={lastMessageByUser}
            content={msg.content}
            createdAt={msg._creationTime}
            type={msg.type}
          />
        )
      })}
    </div>
  )
}

export default Body
