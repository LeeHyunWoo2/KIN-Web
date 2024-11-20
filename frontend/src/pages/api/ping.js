import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Render 서버로 핑 보내기
      const response = await axios.get(process.env.NEXT_PUBLIC_API_URL);
      console.log('핑', response.status);

      // 클라이언트에 성공 응답 반환
      res.status(200).json({ message: '핑 전송 성공' });
    } catch (error) {
      console.error('핑 전송 실패:', error.message);
      res.status(500).json();
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}