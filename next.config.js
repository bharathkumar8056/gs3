/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // No need to transpile three
  serverExternalPackages: ['three'],
  // Disable tracing to avoid permission issues
  tracing: {
    ignoreRootModule: true,
  },
  // Disable telemetry
  telemetry: {
    disabled: true,
  },
}

module.exports = nextConfig
