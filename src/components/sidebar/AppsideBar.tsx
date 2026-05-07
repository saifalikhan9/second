'use client';
import { cn } from '@/lib/utils';
import { LogoutButton } from '@/components/auth/LogoutButton';
import {
  IconBrain,
  IconBrandLinkedin,
  IconBrandX,
  IconBrandYoutube,
  IconMoon,
  IconSun,
} from '@tabler/icons-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import React from 'react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '../ui/sidebar';

export const AppSideBar = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const categories = [
    {
      name: 'Twitter',
      icon: IconBrandX,
      url: '/dashboard',
    },
    {
      name: 'LinkedIn',
      icon: IconBrandLinkedin,
      url: '/dashboard',
    },
    {
      name: 'YouTube',
      icon: IconBrandYoutube,
      url: '/dashboard',
    },
  ];
  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <div className="flex items-center justify-between">
                <Link className="inline-flex gap-2" href={'/'}>
                  <IconBrain className="" />
                  <span>Second Brain</span>
                </Link>
                <button
                  type="button"
                  onClick={() =>
                    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
                  }
                  className="relative z-1 size-6 transition-all duration-200"
                >
                  <IconMoon
                    className={cn(
                      `absolute inset-0 m-auto transition-all duration-300 ${
                        resolvedTheme === 'dark'
                          ? 'scale-0 rotate-90 opacity-0'
                          : 'scale-100 rotate-0 opacity-100'
                      }`,
                    )}
                  />
                  <IconSun
                    className={cn(
                      `absolute inset-0 m-auto transition-all 300${
                        resolvedTheme === 'dark'
                          ? 'scale-100 rotate-0 opacity-100'
                          : 'scale-0 -rotate-90 opacity-0'
                      }`,
                    )}
                  />
                </button>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Categories</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {categories.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-2">
          <LogoutButton className="w-full" />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
