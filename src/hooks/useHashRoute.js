import { useEffect, useState } from "react";

// Tiny hash router ("#/products"). Hash routes work on any static host without server setup.
const read = () => {
  const path = window.location.hash.replace(/^#/, "").split("?")[0] || "/";
  return path.startsWith("/") ? path : `/${path}`;
};

export function useHashRoute() {
  const [route, setRoute] = useState(read);
  useEffect(() => {
    const onChange = () => setRoute(read());
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return route;
}

export function navigate(path) {
  window.location.hash = path;
}
