import React from 'react';
import Image from 'next/image';
import {Dialog, DialogContent, DialogTrigger} from "@/components/ui/dialog";
import {Image as ImageIcon} from 'lucide-react';

const DocsImage = ({style, src, alt, border = true}) => {

  const handleOpenNewTab = (e) => {
    e.preventDefault();
    window.open(src.src, '_blank');
  };

  return (
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
          onClick={handleOpenNewTab} target="_blank" rel="noopenner noreferrer"
      />
  )
};

const ToggleDocsImage = ({style, src, alt, border = true}) => {
  const [isVisible, setIsVisible] = React.useState(false);

  return (
      <>
        <Dialog isOpen={isVisible} onClose={() => setIsVisible(false)}>
          <DialogContent>
            <DocsImage style={style} src={src} alt={alt} border={border}/>
          </DialogContent>
          <DialogTrigger>
            <div className="inline-flex items-center justify-center
             gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors
              focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring border border-input bg-background
                shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
              <ImageIcon size={20}/>이미지 보기
            </div>
          </DialogTrigger>
        </Dialog>
      </>
  );
};

export {DocsImage, ToggleDocsImage};