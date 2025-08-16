'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import Link from 'next/link'
import { SearchIcon } from 'lucide-react'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []

  return (
    <nav className="flex gap-3 items-center">
      {navItems.map(({ link }, i) => {
        return <CMSLink key={i} {...link} appearance="link" />
      })}

      {/* Search Icon */}
      <Link href="/search" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
        <span className="sr-only">Search</span>
        <SearchIcon className="w-5 h-5 text-primary" />
      </Link>
    </nav>
  )
}
