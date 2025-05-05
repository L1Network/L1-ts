'use client'

import { ThemeToggle } from '@/components/layout/header/theme-toggle'
import Link from 'next/link'
import { Menu } from './menu'

export function Header() {
  return (
    <header className="border-b">
      <div
        className={
          'sticky z-10 top-0 flex max-h-[64px] h-[64px] w-full items-center justify-between p-2 bg-background'
        }
      >
        <div className="flex items-center gap-3">
          <Link href="/">L1Network</Link>

          <div className="hidden md:flex md:gap-3 md:pl-4 lg:ml-[-1px] lg:gap-10">
            <Menu />
          </div>
        </div>

        <div className="flex justify-end lg:min-w-[300px] lg:gap-5">
          <div className="flex ">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}
