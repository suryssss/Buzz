
import ConversationFallback from '@/components/items/conversation/ConversationFallback'
import List from '@/components/items/List'
import React from 'react'

type Props = {}

const FriendsPage = (props: Props) => {
  return (
    <>
    <List title="Friends">FriendsPage</List>
    <ConversationFallback/>
    </>
  )
}

export default FriendsPage