import { withPayload } from '@payloadcms/next/withPayload'
import redirects from './redirects.js'

const NEXT_PUBLIC_SERVER_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : process.env.__NEXT_PRIVATE_ORIGIN || 'http://localhost:3000'

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    // Disable image optimization for external URLs to avoid the 400 error
    unoptimized: false,
    remotePatterns: [
      // Your Vercel deployment domain
      {
        protocol: 'https',
        hostname: '**.vercel.app',
      },
      // S3 bucket patterns - be more specific
      {
        protocol: 'https',
        hostname: `${process.env.S3_BUCKET || 'vintageartecomm'}.s3.${process.env.S3_REGION || 'ap-south-1'}.amazonaws.com`,
      },
      {
        protocol: 'https', 
        hostname: `${process.env.S3_BUCKET || 'vintageartecomm'}.s3.amazonaws.com`,
      },
      // General S3 pattern
      {
        protocol: 'https',
        hostname: '*.s3.*.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 's3.*.amazonaws.com',
      },
      // Local development
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
      },
    ],
    // Add specific domains that should be optimized
    domains: [
      `${process.env.S3_BUCKET || 'vintageartecomm'}.s3.${process.env.S3_REGION || 'ap-south-1'}.amazonaws.com`,
    ],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }
    return webpackConfig
  },
  reactStrictMode: true,
  redirects,
  typescript: {
    ignoreBuildErrors: false,
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
