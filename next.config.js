const withNextIntl = require('next-intl/plugin')();

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    output: 'standalone',
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'domain.com',
                port: '10000',
                pathname: '/**',
            },
        ],
    },
};

module.exports = withNextIntl(nextConfig); 