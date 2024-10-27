/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/login',
        destination: '/_authentication/login',
      },
      {
        source: '/signup',
        destination: '/_authentication/signup',
      },
    ];
  },
};

export default nextConfig;