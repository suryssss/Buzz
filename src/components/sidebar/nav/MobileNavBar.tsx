'use client'
import { Card } from '@/components/ui/card'
import { UserButton } from '@clerk/nextjs'
import React from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useNavigation } from '@/hooks/useNavigation'

const MobileNavBar = () => {
  const paths = useNavigation()

  return (
    <Card className='fixed bottom-4 w-[calc(100vw-32px)] flex items-center h-16 p-2 lg:hidden'>
      <nav className='w-full'>
        <ul className='flex justify-evenly items-center gap-4'>
          {paths.map((path, id) => (
            <li key={id} className='relative'>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href={path.href}>
                    <Button
                      size="icon"
                      variant={path.active ? "default" : "outline"}
                    >
                      {path.icon}
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{path.name}</p>
                </TooltipContent>
              </Tooltip>
            </li>
          ))}
        <li>
        <UserButton />
      </li>
        </ul>
      </nav>
    </Card>
  )
}

export default MobileNavBar
