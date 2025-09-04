'use client'
import { useConversation } from '@/hooks/useConversation'
import { useQuery } from 'convex/react'
import React, { useEffect } from 'react'
import { api } from '../../../../../../convex/_generated/api'
import { Id } from '../../../../../../convex/_generated/dataModel'
import Message from './Message'
import { useMutationState } from '@/hooks/useMutationState'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

type Props = {
  members: Member[]
}

type Member = {
  lastSeenMessageId?: Id<'messages'>
  username?: string
}

const Body = (props: Props) => {
  const { conversationId } = useConversation()

  const {mutate:markRead}=useMutationState(api.conversations.MarkRead)

  const messages = useQuery(api.messages.get, {
    id: conversationId as Id<'conversations'>,
  })

  useEffect(()=>{
    if(messages && messages.length>0){
      markRead({
        conversationId,
        messageId:messages[0]._id,
      })
    }
  },[messages,conversationId,markRead])


  const formatSeenBy=(name:string[])=>{
    switch(name.length){
      case 1:
        return <p className='text-muted-foreground text-sm text-right'>{`Seen by ${name[0]}`}</p>
      case 2:
        return <p className='text-muted-foreground text-sm text-right'>{`Seen by ${name[0]} and ${name[1]}`}</p>
      default:
        return <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <p className='text-muted-foreground text-sm text-right'>{`Seen by ${name[0]},${name[1]} and ${name.length-2}`}</p>
              <TooltipContent>
                <ul>
                  {name.map((names,index)=>{
                    return <li key={index}>{names}</li>
                  })}
                </ul>
              </TooltipContent>
            </TooltipTrigger>
          </Tooltip>

        </TooltipProvider>
    }
  }

  const getseenMessage=(messageId:Id<'messages'>)=>{
    if(!props.members || props.members.length === 0) return undefined;
    
    const seenUsers = props.members
      .filter((member: Member) => member.lastSeenMessageId === messageId)
      .map((user: Member) => (user.username ?? '').split('')[0])

      if(seenUsers.length===0)return undefined;

      return formatSeenBy(seenUsers)

  }


  return (
    <div className="flex-1 w-full flex overflow-y-scroll flex-col-reverse gap-2 p-3 no-scrollbar">
      {messages?.map((msg, index) => {
        const lastMessageByUser =
          index > 0 && messages[index - 1].senderId === msg.senderId

          const seenMessage=msg.isCurrentUser ? getseenMessage(msg._id) : undefined
          
          // Debug log
          if(msg.isCurrentUser) {
            console.log('Message from current user:', msg._id, 'Seen message:', seenMessage, 'Members:', props.members)
          }

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
            seen={seenMessage}
          />
        )
      })}
    </div>
  )
}

export default Body
