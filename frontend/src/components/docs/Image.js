import Image from 'next/image';

const DocsImage = ({style, ...props}) => {
  return (
      <Image
          {...props}
          style={{
            border: '2px solid grey',
            borderRadius: '8px',
            ...(style || {}),
          }}
      />
  )
};
export default DocsImage;