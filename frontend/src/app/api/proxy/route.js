import {  NextResponse } from "next/server";

/**
 *  API 프록시 핸들러
 *  프론트엔드 서버(Vercel)에서 모든 API 요청을 중계
 *  보안 정책상, 클라이언트가 직접 백엔드에 접근하지 못하도록 차단하고 프론트엔드 서버(Vercel)를 경유하도록 강제
 *  Cloudflare 방화벽을 통과하도록 x-api-key 헤더 자동 추가
 */
export async function GET(req) {
  return proxyRequest(req);
}

export async function POST(req) {
  return proxyRequest(req);
}

export async function PUT(req) {
  return proxyRequest(req);
}

export async function DELETE(req) {
  return proxyRequest(req);
}

/**
 *  프록시 함수
 *  클라이언트 → Vercel(프록시) → 백엔드 요청을 중계
 *  Cloudflare 보안 설정 적용 (x-api-key 추가)
 */
async function proxyRequest(req) {
  const backendUrl = process.env.API_BACKEND_URL; //  백엔드 API 기본 URL
  const url = new URL(req.url);
  const path = url.pathname.replace("/api/proxy/", ""); //  경로에서 "/api/proxy/" 를 제거하여 백엔드에 전달

  //  클라이언트 요청 헤더를 백엔드 요청에 반영
  const headers = new Headers(req.headers);
  headers.set("x-api-key", process.env.CLOUDFLARE_API_TOKEN || ""); //  Cloudflare 보안 토큰 자동 추가

  try {
    //  백엔드로 요청을 전달 (GET 요청일 경우 body 없음)
    const response = await fetch(`${backendUrl}/${path}`, {
      method: req.method,
      headers,
      body: req.method !== "GET" ? await req.text() : undefined, //  GET이 아닐 때만 body 포함
    });

    //  백엔드 응답을 프론트엔드로 전달
    return new NextResponse(await response.text(), {
      status: response.status,
      headers: response.headers, //  백엔드 응답 헤더를 유지
    });
  } catch (error) {
    console.error("Proxy 서버 에러:", error);
    return new NextResponse(JSON.stringify({ error: "Proxy 서버 에러" }), { status: 500 });
  }
}



/*
import axios from "axios";

export default async function handler(req, res) {
  const backendUrl = process.env.API_BACKEND_URL; // 백엔드 API URL
  const { path, ...query } = req.query; // 클라이언트로부터 전달된 경로
  const method = req.method; // 요청 방식

  // Vercel 로그로 확인할 콘솔, (Vercel 에서 표시되지 않는 것만 작성)
  console.log(
      `content-length : ${req.headers["content-length"]}\n
      cf-connecting-ip : ${req.headers["cf-connecting-ip"]}`);

  try {
    // 클라이언트로부터 받은 요청 헤더와 x-api-key를 병합
    const headers = {
      ...req.headers,
      "x-api-key": process.env.CLOUDFLARE_API_TOKEN, // api 보안용 커스텀 헤더
    };

    // host 등 불필요한 헤더 제거
    delete headers.host;

    // 쿼리 스트링을 URL에 추가
    const queryString = new URLSearchParams(query).toString();
    const url = `${backendUrl}/${path.join("/")}${queryString ? `?${queryString}` : ""}`;

    // axios 백엔드 요청
    const response = await axios({
      method,
      url,
      data: req.body,
      headers,
      host: undefined,
      withCredentials: true, // 쿠키 포함
    });

    Object.entries(response.headers).forEach(([key, value]) => {
      res.setHeader(key, value); // 백엔드로부터 받은 헤더를 클라이언트에 그대로 반영 (쿠키 등)
    })

    // 백엔드 응답을 클라이언트로 전달
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error(error.message);
    res
    .status(error.response?.status || 500)
    .json({ error: error.message || "Proxy 서버 에러" });
  }
}
*/
