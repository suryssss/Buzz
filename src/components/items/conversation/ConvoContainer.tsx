import { Card } from '@/components/ui/card'
import React from 'react'

type Props=React.PropsWithChildren<{}>

const ConvoContainer = ({children}: Props) => {
  return (
    <Card className='w-full h-[calc(100vh-32px)] lg:h-full p-2 flex flex-col'>
        {children}
    </Card>
  )
}

export default ConvoContainer