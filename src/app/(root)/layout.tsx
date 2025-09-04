"use client";
import React from 'react';
import SidebarAni from '@/components/sidebar/SideBarAni';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/nextjs';

type Props = React.PropsWithChildren<object>

const Layout = ({ children }: Props) => {
    return (
        <>
          <SignedIn>
            <SidebarAni>
              {children}
            </SidebarAni>
          </SignedIn>
          <SignedOut>
            <RedirectToSignIn />
          </SignedOut>
        </>
    )
}

export default Layout;
