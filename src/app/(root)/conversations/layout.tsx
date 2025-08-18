import React from "react";

type Props = React.PropsWithChildren<{}>;

const ConversationLayout = ({ children }: Props) => {
  return (
    <>
      {children}
    </>
  );
};

export default ConversationLayout;
