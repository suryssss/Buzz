

import React from 'react'
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type Props = {
    fromCurrentUser:boolean;
    senderImage:string;
    senderName:string;
    lastMessageByUser:boolean;
    content:string[];
    createdAt:number;
    type:string;
}

const Message = ({
    fromCurrentUser,
    senderImage,
    senderName,
    lastMessageByUser,
    content,
    createdAt,
    type
}: Props) => {
    const formatTime=(timeStamp:number)=>{
        return format(timeStamp,"HH:mm")
    }
  return (
    <div className={cn("flex items-end",{"justify-end":fromCurrentUser})}>
        <div className={cn("flex flex-col w-full mx-2",{"order-1 items-end":fromCurrentUser,"order-2 items-start":!fromCurrentUser})}>
            <div className={cn("px-4 py-2 rounded-lg max-w-[70%]",{
                "bg-primary text-primary-foreground":fromCurrentUser,
                "bg-secondary text-secondary-foreground":!fromCurrentUser,
                "rounded-br-none":!lastMessageByUser && fromCurrentUser,
                "rounded-bl-none":!lastMessageByUser && !fromCurrentUser,
            })}>
                {type=="text" ?( <p className='text-wrap break-words whitespace-pre-wrap'>{content}</p>):null}
                <p className={cn("text-xs flex w-full my-1",{"text-primary-foreground justify-end":fromCurrentUser,
                    "text-secondary-foreground justify-start":!fromCurrentUser
                })}>{formatTime(createdAt)}</p>
            </div>
        </div>
        <Avatar className={cn("h-8 w-8",{"order-2 items-end":fromCurrentUser,"order-1 items-start":!fromCurrentUser,"invisible":lastMessageByUser})}>
                <AvatarImage src={senderImage}/>
                <AvatarFallback>{senderName.substring(0,1)}</AvatarFallback>
        </Avatar>
    </div>
  )
}

export default Message