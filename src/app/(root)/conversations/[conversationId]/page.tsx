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
import { useState } from 'react'
import RemoveFriendDialog from './components/RemoveFriendDialog'
import DeleteGroupDialog from './components/DeleteGroupDialog'
import RemoveGroupDialog from './components/RemoveGroupDialog'

type Props = {
  params: Promise<{
    conversationId: Id<"conversations">
  }>
}

const Conversations = ({ params }: Props) => {
  const { conversationId } = use(params) // ✅ unwrap params with React.use()

  const data = useQuery(api.conversations.get, { id: conversationId })

  const [removeFriendDialogOpen,setRemoveFriendDialogOpen]=useState(false)
  const [deleteGroupDialogOpen,setDeleteGroupDialogOpen]=useState(false)
  const [leaveGroupDialogOpen,setLeaveGroupDialogOpen]=useState(false)
  // Removed unused callType state

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

  const options=conversation.isGroup ? [
    {label:"Leave Group",destructive:false,onClick:()=>setLeaveGroupDialogOpen(true)
    },
    {label:"Delete Group",destructive:true,onClick:()=>setDeleteGroupDialogOpen(true)
    },
  ] :[
    {
      label:"Remove Friend",destructive:true,onClick:()=>setRemoveFriendDialogOpen(true)
    }
  ]
   

  return (
    <ConvoContainer>
      <RemoveFriendDialog open={removeFriendDialogOpen} setOpen={setRemoveFriendDialogOpen} conversationId={conversationId}/>
      <DeleteGroupDialog open={deleteGroupDialogOpen} setOpen={setDeleteGroupDialogOpen} conversationId={conversationId}/>
      <RemoveGroupDialog open={leaveGroupDialogOpen} setOpen={setLeaveGroupDialogOpen} conversationId={conversationId}/>
      <Header name={name!} imageUrl={imageUrl} options={options}/>
      <Body members={conversation.isGroup ? data.otherMembers || [] : data.otherMember ? [data.otherMember] : []} />
      <ChatInput />
    </ConvoContainer>
  )
}

export default Conversations
