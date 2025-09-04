import React from 'react';
import SidebarAni from '@/components/sidebar/SideBarAni';

type Props = React.PropsWithChildren<object>

const Layout = ({ children }: Props) => {
    return (
        <SidebarAni>
            {children}
        </SidebarAni>
    )
}

export default Layout;
