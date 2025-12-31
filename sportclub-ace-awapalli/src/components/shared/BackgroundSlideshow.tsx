import React, { useEffect, useState } from 'react';

type Props = {
  images: string[];        // array of image URLs (public/ or absolute)
  duration?: number;       // ms per slide (default 5000)
  transitionMs?: number;   // fade duration ms (default 800)
};

const BackgroundSlideshow: React.FC<Props> = ({ images, duration = 5000, transitionMs = 800 }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % images.length), duration);
    return () => clearInterval(t);
  }, [images, duration]);

  if (!images || images.length === 0) return null;

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {images.map((src, i) => (
        <img
          key={i}
          src={src}
          alt={`background-${i}`}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            opacity: i === index ? 1 : 0,
            transition: `opacity ${transitionMs}ms ease-in-out`,
          }}
        />
      ))}
      {/* optional gradient overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40 pointer-events-none" />
    </div>
  );
};

export default BackgroundSlideshow;