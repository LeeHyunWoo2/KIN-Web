import zlib from 'zlib';

export const compressContent = (content) => {
  try{
  return zlib.gzipSync(JSON.stringify(content)).toString('base64');
  } catch(error){
    console.error('압축 실패', error);
    return content;
  }
};

export const decompressContent = (compressedContent) => {
  try {
  return JSON.parse(zlib.gunzipSync(Buffer.from(compressedContent, 'base64')));
  } catch (error){
    console.error('복원 실패', error);
    return compressedContent;
  }
};