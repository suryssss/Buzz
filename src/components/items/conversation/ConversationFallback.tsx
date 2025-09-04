"use client"
import { Card } from '@/components/ui/card'
import React from 'react'
import { motion } from 'framer-motion'

const ConversationFallback = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }} className='hidden lg:flex h-full w-full'>
      <Card className='h-full w-full p-2 items-center justify-center bg-secondary text-secondary-foreground flex'>
        Select/Start a conversation to get started!!
      </Card>
    </motion.div>
  )
}

export default ConversationFallback