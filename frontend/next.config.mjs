/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  async rewrites() {
    return [
      {
        source: '/login',
        destination: '/auth/login',
      },
      {
        source: '/signup',
        destination: '/auth/signup',
      },
      {
        source: '/loginSuccess',
        destination: '/auth/loginSuccess',
      },
      {
        source: '/verify-email',
        destination: '/auth/verify-email',
      },
      {
        source: '/privacy-policy',
        destination: '/auth/privacy-policy',
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*", // 모든 경로 적용 (정적 파일 포함)
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "https://noteapp.org", // 브라우저 요청에 대해 자신의 도메인만 허용
          },
        ],
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