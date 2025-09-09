// src/app/(payload)/layout.tsx
import type { Metadata } from 'next'
import React from 'react'
import { RootLayout, handleServerFunctions } from '@payloadcms/next/layouts'
import type { ServerFunctionClient } from 'payload'
import config from '@payload-config'
import { importMap } from './admin/importMap.js'
import '@payloadcms/next/css'

import './custom.scss'

type Args = {
  children: React.ReactNode
}

const serverFunction: ServerFunctionClient = async function (args) {
  'use server'
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  })
}

const Layout = ({ children }: Args) => {
  return (
    <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
      {children}
    </RootLayout>
  )
}

export default Layout

export const metadata: Metadata = {
  title: 'Vintage Art Admin',
  description: 'Admin panel for Vintage Art and Decor',
}
