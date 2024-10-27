import fs from 'fs';
import path from 'path';

// Task 데이터를 읽어오는 API 핸들러
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const filePath = path.join(process.cwd(), 'src', 'pages', 'list', 'data', 'tasks.json'); // Next.js 프로젝트 루트에서 데이터 파일 경로 지정
    const data = await fs.promises.readFile(filePath, 'utf-8'); // 파일 읽기
    const tasks = JSON.parse(data); // JSON으로 파싱

    // tasks 데이터가 올바른 형태인지 검증하는 간단한 스키마 체크 (Zod 같은 도구 사용 가능)
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error reading tasks.json: ', error);
    res.status(500).json({ message: 'Failed to load tasks' });
  }
}