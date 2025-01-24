/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
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