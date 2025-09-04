'use client'
import { useConversation } from '@/hooks/useConversation'
import { useQuery } from 'convex/react'
import React, { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
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
    limit: 50,
  })

  // Optimistic messages shown immediately before server ack
  const [optimistic, setOptimistic] = useState<Array<{
    _id: string;
    content: string[];
    _creationTime: number;
    isCurrentUser: boolean;
    senderId: string;
    senderImage: string;
    senderName: string;
    type: string;
  }>>([])

  const lastMarkedRef = useRef<string | null>(null)

  useEffect(()=>{
    if (!messages || messages.length === 0) return;
    // Only when tab is visible
    if (typeof document !== 'undefined' && document.visibilityState !== 'visible') return;
    const newest = messages[0];
    const newestId = newest._id as string;
    // Do not mark if it's my own message
    if (newest.isCurrentUser) return;
    // Skip if already marked by members prop
    const alreadySeen = Array.isArray(props.members) && props.members.some((m: Member)=> m?.lastSeenMessageId === newestId);
    if (alreadySeen) return;
    if (lastMarkedRef.current === newestId) return;
    lastMarkedRef.current = newestId;
    const t = setTimeout(() => {
      markRead({
        conversationId,
        messageId: newest._id,
      })
    }, 500);
    return () => clearTimeout(t);
  },[messages,props.members,conversationId,markRead])

  // Listen for optimistic message events dispatched by the input
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as { content: string }
      if (!detail?.content) return
      const now = Date.now()
      const temp = {
        _id: `temp-${now}`,
        senderId: 'me',
        content: [detail.content],
        _creationTime: now,
        type: 'text',
        senderImage: '',
        senderName: 'You',
        isCurrentUser: true,
      }
      setOptimistic((prev) => [temp, ...prev])
    }
    document.addEventListener('optimistic-message', handler as EventListener)
    return () => document.removeEventListener('optimistic-message', handler as EventListener)
  }, [])

  // Reconcile: drop optimistic items once matching server messages arrive
  useEffect(() => {
    if (!messages || optimistic.length === 0) return
    setOptimistic((prev) =>
      prev.filter((opt) => {
        const match = messages.find(
          (m) => m.isCurrentUser && Array.isArray(m.content) && m.content.join('') === opt.content.join('') && m._creationTime >= opt._creationTime
        )
        return !match
      })
    )
  }, [messages, optimistic.length])


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


  // Combine optimistic + server messages (both newest-first)
  const combined = [...optimistic, ...(messages ?? [])]

  return (
    <div className="flex-1 w-full flex overflow-y-scroll flex-col-reverse gap-2 p-3 no-scrollbar">
      <AnimatePresence initial={false}>
      {combined?.map((msg, index) => {
        const lastMessageByUser =
          index > 0 && combined[index - 1].senderId === msg.senderId

          const seenMessage =
            msg.isCurrentUser && typeof msg._id !== 'string'
              ? getseenMessage(msg._id as Id<'messages'>)
              : undefined

        return (
          <motion.div
            key={msg._id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            <Message
              fromCurrentUser={msg.isCurrentUser}
              senderImage={msg.senderImage}
              senderName={msg.senderName}
              lastMessageByUser={lastMessageByUser}
              content={msg.content}
              createdAt={msg._creationTime}
              type={msg.type}
              seen={seenMessage}
            />
          </motion.div>
        )
      })}
      </AnimatePresence>
    </div>
  )
}

export default Body
