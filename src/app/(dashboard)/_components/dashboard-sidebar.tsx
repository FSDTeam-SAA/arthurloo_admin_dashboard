'use client'

import {
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
  ClipboardList,
  Activity,
  MessageCircle,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import LogoutModal from '@/components/modals/logout-modal'
import { useState } from 'react'
import { toast } from 'sonner'

const items = [
  {
    title: 'Dashboard',
    url: '/',
    icon: LayoutDashboard,
  },
  {
    title: 'Users',
    url: '/manage-users',
    icon: Users,
  },
  {
    title: 'Requests',
    url: '/manage-plan',
    icon: ClipboardList,
  },
  {
    title: 'Reports',
    url: '/payment-and-transactions',
    icon: Activity,
  },
  {
    title: 'Chat Management',
    url: '/contact-management',
    icon: MessageCircle,
  },
]

export function DashboardSidebar() {
  const pathName = usePathname()
  const [logoutModalOpen, setLogoutModalOpen] = useState(false)

  const handLogout = async () => {
    try {
      toast.success('Logout successful!')
      await signOut({ callbackUrl: '/login' })
    } catch (error) {
      console.error('Logout failed:', error)
      toast.error('Logout failed. Please try again.')
    }
  }

  return (
    <div>
      <Sidebar className="w-[320px] border-none">
        <SidebarContent
          className="scrollbar-hide bg-[#6466E9]"
          style={{
            fontFamily: 'Manrope',
            fontWeight: 400,
            fontStyle: 'normal',
            fontSize: '16px',
            lineHeight: '120%',
            letterSpacing: '0%',
          }}
        >
          <SidebarGroup className="p-0">
            <div className="flex min-h-screen flex-col justify-between pb-5">
              <div>
                <SidebarGroupLabel className="mt-5 mb-5 flex h-[80px] justify-center items-center">
                  <Link href="/" className="flex items-center justify-center">
                    <span
                      style={{
                        fontFamily: "'Lily Script One', cursive",
                        fontWeight: 400,
                        fontStyle: 'normal',
                        fontSize: '64px',
                        lineHeight: '120%',
                        letterSpacing: '0%',
                        color: '#FFFFFF',
                      }}
                    >
                      LV
                    </span>
                  </Link>
                </SidebarGroupLabel>

                <SidebarGroupContent className="px-4 pt-3">
                  <SidebarMenu>
                    {items.map(item => {
                      const isActive =
                        item.url === '/'
                          ? pathName === '/'
                          : pathName === item.url ||
                            pathName.startsWith(`${item.url}/`)

                      return (
                        <SidebarMenuItem key={item.title} className="pb-2">
                          <SidebarMenuButton
                            asChild
                            className={`h-[48px] rounded-[8px] border border-white bg-transparent text-base font-medium leading-normal text-white transition-all duration-300 hover:text-white`}
                            style={
                              isActive
                                ? {
                                    backgroundColor: '#AC3AD4',
                                    borderRadius: '8px',
                                    border: '1px solid white',
                                    paddingTop: '12px',
                                    paddingRight: '16px',
                                    paddingBottom: '12px',
                                    paddingLeft: '16px',
                                    gap: '12px',
                                    height: '48px',
                                    width: '100%',
                                  }
                                : {}
                            }
                          >
                            <Link href={item.url}>
                              <item.icon className="h-4 w-4" />
                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      )
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </div>

              <SidebarFooter className="px-4">
                <Link
                  href="/settings"
                  className={`flex h-[48px] items-center gap-2 rounded-[8px] border border-white px-4 text-base font-medium leading-normal text-white transition-all duration-300 hover:text-white ${pathName === '/settings' ? 'bg-[#AC3AD4]' : 'bg-transparent'}`}
                >
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </Link>

                <button
                  onClick={() => setLogoutModalOpen(true)}
                  className="mt-2 flex h-[48px] w-full items-center gap-2 rounded-[8px] border border-white bg-[#FF0000] pl-4 text-base font-normal leading-normal text-white"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Log out</span>
                </button>
              </SidebarFooter>
            </div>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      {logoutModalOpen && (
        <LogoutModal
          isOpen={logoutModalOpen}
          onClose={() => setLogoutModalOpen(false)}
          onConfirm={handLogout}
        />
      )}
    </div>
  )
}
