/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // No need to transpile three
  serverExternalPackages: ['three'],
  // Ignore TypeScript errors during build
  typescript: {
    ignoreBuildErrors: true,
  },
  // Ignore ESLint errors during build
  eslint: {
    ignoreDuringBuilds: true,
  }
}

module.exports = nextConfig


