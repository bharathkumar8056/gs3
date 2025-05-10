/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // No need to transpile three
  serverExternalPackages: ['three'],
  // Remove unrecognized options
}

module.exports = nextConfig

