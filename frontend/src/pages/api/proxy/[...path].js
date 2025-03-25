import axios from "axios";

export default async function handler(req, res) {
  const backendUrl = process.env.API_BACKEND_URL; // 백엔드 API URL
  const { path, ...query } = req.query; // 클라이언트로부터 전달된 경로
  const method = req.method; // 요청 방식

  // Vercel 로그로 확인할 콘솔, (Vercel 에서 표시되지 않는 것만 작성)
  console.log(
      `content-length : ${req.headers["content-length"]}\ncf-connecting-ip : ${req.headers["cf-connecting-ip"]}`);

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

    // KR만 방문자 명단에 저장 (코드는 혹시모르니 남겨둠)
    // if (path[0] === "visitor" && method !== "GET" && req.headers["cf-ipcountry"] !== "KR") return res.status(200).end();

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
