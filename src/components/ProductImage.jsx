
import { useState } from "react";
import PlaceholderArt from "./PlaceholderArt.jsx";

const IMAGEKIT_URL = "https://ik.imagekit.io/yl9wuvmjg";
const IMAGEKIT_FOLDER = "Qazi%20Medicine%20Company";

function resolveSrc(image) {
  if (!image) return "";

  if (/^(https?:)?\/\//.test(image) || image.startsWith("data:")) {
    return image;
  }

  const filename = image.replace(/^\/+/, "");

  // Existing paths are like /products/0723.jpg.
  // Keep only the filename because ImageKit files are in the named folder.
  const imageFilename = filename.split("/").pop();

  return `${IMAGEKIT_URL}/${IMAGEKIT_FOLDER}/${imageFilename}`;
}

export default function ProductImage({ image, name }) {
  const [failedSrc, setFailedSrc] = useState("");
  const src = image ? resolveSrc(image) : "";

  if (!src || failedSrc === src) {
    return <PlaceholderArt />;
  }

  return (
    <img
      src={src}
      alt={name}
      loading="lazy"
      onError={() => setFailedSrc(src)}
    />
  );
}
