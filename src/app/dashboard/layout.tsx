import { AppSideBar } from '@/components/sidebar/AppsideBar';
import { SidebarProvider } from '@/components/ui/sidebar';
import Script from 'next/script';
import React from 'react';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSideBar />
      {children}
    </SidebarProvider>
  );
}
