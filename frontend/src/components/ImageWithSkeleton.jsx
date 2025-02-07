"use client"

import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton"; // Shadcn Skeleton 컴포넌트 임포트

export function ImageWithSkeleton({
  src,
  alt,
  className = "",
  skeletonClassName = "h-64 w-full",
}) {
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 관리

  return (
      <div className="relative">
        {/* Skeleton 표시 */}
        {isLoading && <Skeleton className={`${skeletonClassName} rounded-lg`} />}

        {/* 이미지 */}
        <img
            src={src}
            alt={alt}
            className={`transition-opacity duration-500 ease-in-out ${
                isLoading ? "opacity-0" : "opacity-100"
            } ${className}`}
            onLoad={() => setIsLoading(false)} // 이미지 로드 완료 처리
        />
      </div>
  );
}

/*
#### 예제 1 - 기본 사용:
    ``` jsx
<ImageWithSkeleton
  src="/images/example.png"
  alt="Example Image"
  className="h-auto w-full rounded-lg"
/>
```
#### 예제 2 - Skeleton 스타일 커스텀:
    ``` jsx
<ImageWithSkeleton
  src="/images/example2.gif"
  alt="Example GIF"
  className="h-[300px] w-[300px] object-cover rounded-md"
  skeletonClassName="h-[300px] w-[300px]"
/>
```
#### 예제 3 - 튜토리얼 컴포넌트에 적용:
    기존 JSX에 있던 이미지를 아래와 같이 대체할 수 있습니다.
**Before**:
``` jsx
<img src="/images/categoryTutorial.PNG" alt="categoryTutorial" className="h-auto border rounded-xl" />
```
**After**:
``` jsx
<ImageWithSkeleton
  src="/images/categoryTutorial.PNG"
  alt="Category Tutorial"
  className="h-auto border rounded-xl"
/>
```
*/
