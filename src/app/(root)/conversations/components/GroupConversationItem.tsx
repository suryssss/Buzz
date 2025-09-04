import React from "react";
import { Id } from "../../../../../convex/_generated/dataModel";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback } from "@/components/ui/avatar";

type Props = {
  id: Id<"conversations">;
  name:string
  username?: string;
  lastMessageSender?: string;
  lastMessageContent?: string;
};

const GroupCoversationMessageItem = ({
  id,
  name,
  lastMessageSender,
  lastMessageContent,
}: Props) => {
  return (
    <Link href={`/conversations/${id}`} className="w-full">
      <Card className="p-2 flex flex-row items-center gap-4 truncate">
        <div className="flex flex-row items-center gap-4 truncate">
          <Avatar>
            <AvatarFallback>
                {name.charAt(0).toLocaleUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col truncate">
          <h4 className="truncate">{name}</h4>
          {lastMessageSender && lastMessageContent ? (
            <span className="text-sm text-muted-foreground truncate">
              <span className="font-semibold">{lastMessageSender}:</span>{" "}
              {lastMessageContent}
            </span>
          ) : (
            <p className="text-sm text-muted-foreground truncate">
              Start a conversation
            </p>
          )}
        </div>
      </Card>
    </Link>
  );
};

export default GroupCoversationMessageItem;
