"use client";

import { UserButton, useUser } from "@clerk/nextjs";

export default function HomePage() {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) return <div>Loading...</div>;
  if (!isSignedIn) return <div>You are not signed in</div>;

  return(
    <UserButton/>
  )
}
