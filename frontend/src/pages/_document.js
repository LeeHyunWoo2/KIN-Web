import {Head, Html, Main, NextScript} from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="UTF-8" />

      {/* SEO 메타 태그 */}
      <meta name="description" content="A productivity app built with modern technologies like Next.js, React, and Node.js." />
      <meta name="keywords" content="Productivity, Note App, Next.js, Vercel, React, Node.js, MongoDB, TailwindCSS" />
      <meta name="author" content="LeeHyunWoo" />

      {/* 기술 스택 관련 메타 태그 */}
      <meta name="frontend-framework" content="Next.js, React" />
      <meta name="frontend-ui" content="Radix UI, Tailwind CSS" />
      <meta name="frontend-tools" content="Jotai, Slate.js, Axios, PouchDB, Uploadthing" />
      <meta name="frontend-deploy" content="Vercel" />
      <meta name="database" content="MongoDB Atlas, Redis" />
      <meta name="backend-framework" content="Express.js, Node.js" />
      <meta name="backend-tools" content="Mongoose, Passport.js, JWT, Axios, Bcrypt, Helmet, Cors, Nodemailer" />
      <meta name="backend-deploy" content="Oracle Cloud" />

      <link rel="preload" href="/fonts/PretendardVariable.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />

      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
