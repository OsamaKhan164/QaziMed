


import { useState } from "react";
import PlaceholderArt from "./PlaceholderArt.jsx";

const IMAGEKIT_URL = "https://ik.imagekit.io/yl9wuvmjg";
const IMAGEKIT_FOLDER = "Qazi%20Medicine%20Company";

const CLOUDINARY_URL =
  "https://res.cloudinary.com/tbiqhdou/image/upload";

function getImageSources(image) {
  if (!image) return [];

  // Agar image pehle se complete URL hai, use directly load karo.
  if (/^(https?:)?\/\//.test(image) || image.startsWith("data:")) {
    return [image];
  }

  const filename = image.replace(/^\/+/, "").split("/").pop();

  if (!filename) return [];

  // Pehle Cloudinary, phir ImageKit.
  return [
    `${CLOUDINARY_URL}/${filename}`,
    `${IMAGEKIT_URL}/${IMAGEKIT_FOLDER}/${filename}`,
  ];
}

export default function ProductImage({ image, name }) {
  const [attemptState, setAttemptState] = useState({
    image,
    index: 0,
  });

  const sources = getImageSources(image);

  // Product change hone par pehli image se dobara shuru karo.
  const attemptIndex =
    attemptState.image === image ? attemptState.index : 0;

  const src = sources[attemptIndex];

  if (!src) {
    return <PlaceholderArt />;
  }

  return (
    <img
      src={src}
      alt={name}
      loading="lazy"
      onError={() => {
        setAttemptState({
          image,
          index: attemptIndex + 1,
        });
      }}
    />
  );
}
