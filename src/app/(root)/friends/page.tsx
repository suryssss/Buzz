'use client'
import ConversationFallback from '@/components/items/conversation/ConversationFallback'
import List from '@/components/items/List'
import React from 'react'
import AddFriends from './components/AddFriends'
import { useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { Loader2 } from 'lucide-react'
import Request from './components/Request'

// No props for this page

const FriendsPage = () => {
  const requests=useQuery(api.requests.get)
  return (
    <>
    <List title="Friends" action={<AddFriends/>}>
  {requests === undefined ? (
    <div className="w-full h-full flex items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin" />
    </div>
  ) : requests.length === 0 ? (
    <p className="w-full h-full flex items-center justify-center text-muted-foreground">
      No requests
    </p>
  ) : (
    requests.map((request) => (
      <Request
        key={request.request._id}
        id={request.request._id}
        imageUrl={request.sender.imageUrl}
        username={request.sender?.username || "Unknown"}
        email={request.sender?.email || "No email"}
      />
    ))
  )}
</List>

    <ConversationFallback/>
    </>
  )
}

export default FriendsPage