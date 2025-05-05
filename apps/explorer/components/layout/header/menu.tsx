'use client'

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@l1network/ui/components/navigation-menu'
import { cn } from '@l1network/ui/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavOption {
  text: string
  href?: string
  icon?: null
  options?: Array<{
    title: string
    href: string
    description: string
  }>
}

export function Menu() {
  const pathname = usePathname()

  return (
    <NavigationMenu>
      <NavigationMenuList>
        {navOptions.map((option) => (
          <NavigationMenuItem key={option.text}>
            {option.options && option.options.length > 0 ? (
              <>
                <NavigationMenuTrigger className="text-md font-normal data-[state=open]:rounded-full hover:rounded-full text-neutral-dark hover:text-foreground px-2 py-1 h-auto">
                  {option.text}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {option.options.map((item) => (
                      <ListItem
                        key={item.title}
                        title={item.title}
                        href={item.href}
                      >
                        {item.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </>
            ) : option.href ? (
              <Link href={option.href} legacyBehavior passHref>
                <NavigationMenuLink
                  className={cn(
                    'flex items-center gap-2 px-2 py-1 rounded-full hover:bg-secondary text-neutral-dark hover:text-foreground',
                    isActive(option.href, pathname) &&
                      'bg-secondary text-foreground',
                  )}
                >
                  {/* {option.icon && (
                      <option.icon isActive={isActive(option.href, pathname)} />
                    )} */}
                  {option.text}
                </NavigationMenuLink>
              </Link>
            ) : null}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  )
}

function ListItem({
  title,
  href,
  children,
}: { title: string; href: string; children: React.ReactNode }) {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          href={href}
          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
}

function isActive(href: string, pathname: string) {
  return pathname.startsWith(href)
}

const navOptions: NavOption[] = [
  { text: 'Home', href: '/', icon: null },
  { text: 'Roadmap', href: '/roadmap', icon: null },
  {
    text: 'More',
    options: [],
  },
]
