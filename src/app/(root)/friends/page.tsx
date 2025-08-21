
import ConversationFallback from '@/components/items/conversation/ConversationFallback'
import List from '@/components/items/List'
import React from 'react'
import AddFriends from './components/AddFriends'

type Props = {}

const FriendsPage = (props: Props) => {
  return (
    <>
    <List title="Friends" action={<AddFriends/>}>
    <div className="flex-1 flex items-center justify-center">
        FriendsPage
      </div></List>
    <ConversationFallback/>
    </>
  )
}

export default FriendsPage