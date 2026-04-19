import { useState } from 'react';



export default function Gallery({images}) {
  const [imgIndex, setImageIndex] = useState(0);

  const handleNavigateImages = (isNext) => {
    let nextImgInd = imgIndex + (isNext ? 1 : -1);
    if(nextImgInd < 0) {
      nextImgInd = 0;
    }
    else if(nextImgInd > images.length - 1)
    {
      nextImgInd = images.length - 1;
    }
    setImageIndex(nextImgInd);
  }
  
  return (
    <div style={{display: "flex", flexDirection: "column", gap: 4}}>
      <p>Current Index: {imgIndex}</p>
      <img src={images[imgIndex].url} height={240} />
      <div style={{ display: "flex", flexDirection: "row", gap: 4}}>
        <button onClick={() => handleNavigateImages(false)}>Previous</button>
        <button onClick={() => handleNavigateImages(true)}>Next</button>
      </div>
    </div>
  )

}