'use client'
import { Card } from '@/components/ui/card'
import { UserButton } from '@clerk/nextjs'
import React from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useNavigation } from '@/hooks/useNavigation'
import { ModeToggle } from '@/components/ui/theme/theme-toggle'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'

const NavBar = () => {
  const paths = useNavigation()

  return (
    <Card className="hidden lg:flex lg:flex-col lg:justify-between lg:items-center lg:h-full lg:w-16 lg:px-2 lg:py-4">
      <nav>
        <ul className="flex flex-col items-center gap-4">
          {paths.map((path, id) => (
            <li key={id} className="relative">
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.96 }}>
                  <Button
                    asChild
                    size="icon"
                    variant={path.active ? 'default' : 'outline'}
                    className="relative"
                  >
                    <Link href={path.href}>
                      {path.icon}
                      {path.count ? (
                        <Badge className="absolute -right-2 -top-2 px-2 py-0 text-xs">
                          {path.count}
                        </Badge>
                      ) : null}
                    </Link>
                  </Button>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{path.name}</p>
                </TooltipContent>
              </Tooltip>
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex flex-col items-center gap-4">
        <ModeToggle />
        <UserButton />
      </div>
    </Card>
  )
}

export default NavBar
