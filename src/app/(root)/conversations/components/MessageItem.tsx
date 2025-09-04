import React from "react";
import { motion } from "framer-motion";
import { Id } from "../../../../../convex/_generated/dataModel";
import Link from "next/link";
import { User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Props = {
  id: Id<"conversations">;
  imageUrl: string;
  username: string;
  lastMessageSender?: string;
  lastMessageContent?: string;
};

const MessageItem = ({
  id,
  imageUrl,
  username,
  lastMessageSender,
  lastMessageContent,
}: Props) => {
  return (
    <Link href={`/conversations/${id}`} className="w-full">
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18, ease: 'easeOut' }}>
      <Card className="p-2 flex flex-row items-center gap-4 truncate">
        <div className="flex flex-row items-center gap-4 truncate">
          <Avatar>
            <AvatarImage src={imageUrl} />
            <AvatarFallback>
              <User className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col truncate">
          <h4 className="truncate">{username}</h4>
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
      </motion.div>
    </Link>
  );
};

export default MessageItem;
