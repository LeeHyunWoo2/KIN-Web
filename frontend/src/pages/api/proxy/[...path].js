import axios from "axios";

export default async function handler(req, res) {
  const backendUrl = process.env.API_BACKEND_URL; // 백엔드 API URL
  const { path } = req.query; // 클라이언트로부터 전달된 경로
  const method = req.method; // 요청 방식

  console.log('Request Method:', req.method); // 메서드 확인
  console.log('Request Path:', req.url);
  console.log('Request Body:', req.body);

  try {
    // 클라이언트로부터 받은 요청 헤더와 x-api-key를 병합
    const headers = {
      ...req.headers, // 기본적으로 클라이언트 헤더 전달
      "x-api-key": process.env.CLOUDFLARE_API_TOKEN, // api 보안용 커스텀 헤더
    };

/*    if (req.headers["x-skip-interceptor"]) {
      console.log("💡 x-skip-interceptor 전달 확인:", req.headers["x-skip-interceptor"]);
      headers["x-skip-interceptor"] = req.headers["x-skip-interceptor"];
    }*/

    // host 등 불필요한 헤더 제거
    delete headers.host;

    // axios 백엔드 요청
    const response = await axios({
      method,
      url: `${backendUrl}/${path.join("/")}`, // 백엔드로 전달할 URL 생성
      data: req.body || {}, // 요청 본문 전달
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