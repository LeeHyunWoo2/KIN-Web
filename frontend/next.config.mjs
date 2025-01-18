/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  async rewrites() {
    return [
/*      {
        "source": "/api/proxy/:path*",
        "destination": process.env.API_BACKEND_URL + "/:path*"
      },*/
      {
        source: '/login',
        destination: '/_authentication/login',
      },
      {
        source: '/signup',
        destination: '/_authentication/signup',
      },
      {
        source: '/loginSuccess',
        destination: '/_authentication/loginSuccess',
      },
      {
        source: '/verify-email',
        destination: '/_authentication/verify-email',
      },
      {
        source: '/privacy-policy',
        destination: '/_authentication/privacy-policy',
      },
    ];
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // 클라이언트 사이드에서 'fs' 모듈을 빈 모듈로 대체
      config.resolve.fallback = {
        fs: false,
      };
    }
    return config;
  },
};

export default nextConfig;