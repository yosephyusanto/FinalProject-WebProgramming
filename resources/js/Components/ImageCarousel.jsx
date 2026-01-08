import React, { useState } from 'react'

const ImageCarousel = ({ images = [] }) => {
  const [curr, setCurr] = useState(0)
  const hasMultiple = images.length > 1

  const prev = () => {
    setCurr((c) => (c === 0 ? images.length - 1 : c - 1))
  }

  const next = () => {
    setCurr((c) => (c === images.length - 1 ? 0 : c + 1))
  }

  if (images.length === 0) {
    return (
      <img
        src="/images/no_image.jpg"
        className="object-cover w-full h-full"
        alt="No image"
      />
    )
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Slides */}
      <div
        className="flex h-full transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${curr * 100}%)` }}
      >
        {images.map((photo, index) => (
          <img
            key={index}
            src={photo.image_url}
            alt=""
            className="object-cover w-full h-full shrink-0"
          />
        ))}
      </div>

      {/* Arrows (only if >1 image) */}
      {hasMultiple && (
        <>
          <button
            onClick={prev}
            className="absolute -translate-y-1/2 left-3 top-1/2 btn btn-circle btn-sm bg-white/80"
          >
            ❮
          </button>
          <button
            onClick={next}
            className="absolute -translate-y-1/2 right-3 top-1/2 btn btn-circle btn-sm bg-white/80"
          >
            ❯
          </button>
        </>
      )}

      {/* Dots */}
      {hasMultiple && (
        <div className="absolute left-0 right-0 flex justify-center gap-2 bottom-3">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurr(i)}
              className={`w-2.5 h-2.5 rounded-full transition ${
                i === curr ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default ImageCarousel
