import List from "@/components/items/List";
import React from "react";

type Props = React.PropsWithChildren<{}>;

const ConversationLayout = ({ children }: Props) => {
  return (
    <>
    <List title="Conversations">ConversationsPage</List>
      {children}
    </>
  );
};

export default ConversationLayout;
