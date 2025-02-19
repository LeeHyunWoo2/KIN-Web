import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogTrigger
} from "@/components/ui/dialog";
import {Image as ImageIcon} from 'lucide-react';
import {cn} from "@/lib/utils"
import {useEffect, useState} from "react";
import { Skeleton } from "@/components/ui/skeleton";

const DocsImage = ({style, src, alt, border = true}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // 실제 이미지 주소 추출
    const imageUrl = src?.default?.src;

    if (!imageUrl) {
      return;
    }

    const img = document.createElement('img');
    img.src = imageUrl;

    // 이미지 로드 완료 또는 캐싱 여부 확인
    if (img.complete) {
      setIsLoaded(true); // 캐싱된 이미지는 즉시 로드된 상태로 설정
    }

    img.onload = () => {
      setIsLoaded(true);
    };
  }, [src]);

  const handleOpenNewTab = (e) => {
    e.preventDefault();
    window.open(src.default.src, '_blank');
  };

  return (
      <div
          style={{
            position: 'relative',
            display: 'inline-block',
            ...(style || {}),
          }}
      >
        {!isLoaded && (
            <Skeleton
                className="absolute inset-0 z-10 transition-all"
                style={{
                  width: style?.width || '100%',
                  height: style?.height || 'auto',
                  ...(border ? {
                    border: '2px solid grey',
                    borderRadius: '8px'
                  } : {}),
                }}
            />
        )}
        <Image
            src={src}
            alt={alt || "image"}
            style={{
              ...(border ? {
                border: '2px solid grey',
                borderRadius: '8px'
              } : {}),
              cursor: 'pointer',
              ...(isLoaded ? {} : {visibility: 'hidden'}),
              ...(style || {}),
              opacity: isLoaded ? 1 : 0,
              transition: 'opacity 0.5s ease',
            }}
            priority
            onLoad={() => setIsLoaded(true)}
            onClick={handleOpenNewTab}
            target="_blank"
            rel="noopenner noreferrer"
        />
      </div>
  )
};

/*
const DocsImage = ({style, src, alt, border = true}) => {
  return (
      <Dialog>
        <DialogContent
            className="m-0 p-0  bg-transparent shadow-none outline-none flex justify-center items-center"
        >
          <Image
              src={src}
              alt={alt || "image"}
              className="w-auto h-auto max-w-[90vw] max-h-[85vh] object-contain relative"
          />
        </DialogContent>
        <DialogTrigger asChild>
      <Image
          src={src}
          alt={alt || "image"}
          style={{
            ...(border ? {
              border: '2px solid grey',
              borderRadius: '8px'
            } : {}),
            cursor: 'pointer',
            ...(style || {}),
          }}
      />
      </DialogTrigger>
</Dialog>
  )
};
*/

const ToggleDocsImage = ({src, alt, label = '이미지 보기', className}) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
      <>
        <Dialog isOpen={isVisible} onClose={() => setIsVisible(false)}>
          <DialogContent className="p-5 m-0 border-none bg-transparent shadow-none outline-none">
            <Image src={src} alt={alt || "image"}/>
          </DialogContent>
          <DialogTrigger asChild>
            <div className={cn(
                "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors bg-indigo-400 text-background shadow-sm hover:bg-indigo-500 h-9 px-4 py-2 cursor-pointer select-none",
                className)}>
              <ImageIcon size={20}/>{label}
            </div>
          </DialogTrigger>
        </Dialog>
      </>
  );
};

export {DocsImage, ToggleDocsImage};
