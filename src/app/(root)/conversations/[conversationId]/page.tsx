'use client'
import ConvoContainer from '@/components/items/conversation/ConvoContainer'
import { useQuery } from 'convex/react'
import React, { use } from 'react'
import { api } from '../../../../../convex/_generated/api'
import { Id } from '../../../../../convex/_generated/dataModel'
import { Loader2 } from 'lucide-react'
import Body from './components/Body'
import ChatInput from './components/input/ChatInput'
import Header from './components/Header'

type Props = {
  params: Promise<{
    conversationId: Id<"conversations">
  }>
}

const Conversations = ({ params }: Props) => {
  const { conversationId } = use(params) // ✅ unwrap params with React.use()

  const data = useQuery(api.conversations.get, { id: conversationId })

  if (data === undefined) {
    return (
      <div className='w-full h-full flex items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin'/>
      </div>
    )
  }

  if (data === null) {
    return (
      <p className='w-full h-full flex items-center justify-center'>
        Conversation not found
      </p>
    )
  }

  const { conversation } = data

  // determine header info
  const name = conversation.isGroup
    ? conversation.name
    : data.otherMember?.username || ''

  const imageUrl = conversation.isGroup
    ? undefined
    : data.otherMember?.imageUrl

  return (
    <ConvoContainer>
      <Header name={name!} imageUrl={imageUrl} />
      <Body />
      <ChatInput />
    </ConvoContainer>
  )
}

export default Conversations
