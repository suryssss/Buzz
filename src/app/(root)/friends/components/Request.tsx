import React from 'react'
import { Id } from "../../../../../convex/_generated/dataModel"
import { Card } from "../../../../components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Check, User, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useMutation } from 'convex/react'
import { useMutationState } from '@/hooks/useMutationState'
import { api } from '../../../../../convex/_generated/api'
import { toast } from 'sonner'

type Props = {
    id: Id<"requests">
    imageUrl?: string;   // make optional, in case no image is provided
    username: string;
    email: string;
}

const Request = ({ id, imageUrl, username, email }: Props) => {

    const {mutate:denyRequest,pending:denyPending}=useMutationState(api.request.deny)

    const {mutate:acceptRequest,pending:acceptRequestPending}=useMutationState(api.request.accept)

  return (
    <Card className="w-full p-2 flex flex-row items-center justify-between gap-2">
      <div className="flex items-center gap-4 truncate">
        <Avatar>
          <AvatarImage 
            src={imageUrl || undefined}   // Clerk will provide imageUrl
            alt={username} 
          />
          <AvatarFallback>
            <User />
          </AvatarFallback>
        </Avatar>
      </div>
      <div className='flex flex-col truncate'>
           <h4 className='truncate'>{username}</h4>
        </div>
        <div className='flex items-center gap-2'>
          <Button size='icon'disabled={denyPending || acceptRequestPending} onClick={()=>{acceptRequest({id})
            .then(()=>{
              toast.success("Friend request accepted")
            }).catch((error)=>{
              toast.error(error instanceof Error ? error.message : "Something went wrong")
            })
          }}>
            <Check/>
          </Button>
          <Button size='icon' variant="destructive" disabled={denyPending || acceptRequestPending} onClick={()=>{denyRequest({id})
            .then(()=>{
              toast.success("Friend request denied")
            }).catch((error)=>{
              toast.error(error instanceof Error ? error.message : "Something went wrong")
            })
            }}>
            <X className='h-4 w-4'/>
          </Button>
        </div>
    </Card>
  )
}

export default Request
