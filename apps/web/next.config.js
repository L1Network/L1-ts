/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@l1network/ui', '@l1network/api'],
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })
    return config
  },
}

export default nextConfig
