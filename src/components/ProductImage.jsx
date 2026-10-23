import { useState } from "react";
import PlaceholderArt from "./PlaceholderArt.jsx";

// Shows the product photo from public/products/ and falls back to the placeholder
// when the path is empty or the file cannot be loaded.
// Paths such as "/products/0001.jpg" are resolved relative to the site's base so they also work
// when the site is uploaded to a sub-folder; full URLs and data: URLs are used as they are.
function resolveSrc(image) {
  if (/^(https?:)?\/\//.test(image) || image.startsWith("data:")) return image;
  return `${import.meta.env.BASE_URL}${image.replace(/^\/+/, "")}`;
}

export default function ProductImage({ image, name }) {
  const [failedSrc, setFailedSrc] = useState("");
  const src = image ? resolveSrc(image) : "";
  if (!src || failedSrc === src) return <PlaceholderArt />;
  return <img src={src} alt={name} loading="lazy" onError={() => setFailedSrc(src)} />;
}
