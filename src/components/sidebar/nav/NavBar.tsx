'use client'
import { Card } from '@/components/ui/card'
import { UserButton } from '@clerk/nextjs'
import React from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useNavigation } from '@/hooks/useNavigation'
import { ModeToggle } from '@/components/ui/theme/theme-toggle'

const NavBar = () => {
  const paths = useNavigation()

  return (
    <Card className='hidden lg:flex lg:flex-col lg:justify-between lg:items-center lg:h-full lg:w-16 lg:px-2 lg:py-4'>
      <nav>
        <ul className='flex flex-col items-center gap-4'>
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
        </ul>
      </nav>

      <div className='flex flex-col items-center gap-4'>
        <ModeToggle/>
        <UserButton />
      </div>
    </Card>
  )
}

export default NavBar
