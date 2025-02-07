"use client"

import zlib from 'zlib';

// mode 필드에 따라서 알맞은 압축, 해제 함수 호출, 별도의 모드가 추가로 생긴다면 switch로 변경하기
export const getCompressor = (mode) => {
  return mode === 'editor' ? compressEditorContent : compressTextContent;
}
export const getDecompressor = (mode) => {
  return mode === 'editor' ? decompressEditorContent : decompressTextContent;
}

const compressEditorContent = (content) => {
  try {
    return zlib.gzipSync(JSON.stringify(content)); // JSON 변환 후 압축
  } catch (error) {
    console.error('에디터 모드 압축 실패', error);
    return content;
  }
};

const decompressEditorContent = (compressedContent) => {
  try {
    return JSON.parse(
        zlib.gunzipSync(Buffer.from(compressedContent, 'base64')));
  } catch (error) {
    console.error('에디터 모드 복원 실패', error);
    return compressedContent;
  }
};

const compressTextContent = (content) => {
  try {
    return zlib.gzipSync(Buffer.from(String(content), 'utf-8'));
  } catch (error) {
    console.error('텍스트 모드 압축 실패', error);
    return Buffer.from(content, 'utf-8');
  }
};

const decompressTextContent = (compressedContent) => {
  try {
    const bufferData = Buffer.from(compressedContent.data);
    return zlib.gunzipSync(bufferData).toString('utf-8');
  } catch (error) {
    console.error('텍스트 모드 복원 실패', error);
    return compressedContent.toString('utf-8');
  }
};