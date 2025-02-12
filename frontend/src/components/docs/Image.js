import Image from 'next/image';

const DocsImage = ({style, src, alt, border=true}) => {

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
export default DocsImage;