import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import LightGallery from 'lightgallery/react'

import 'lightgallery/css/lightgallery.css'
import 'lightgallery/css/lg-thumbnail.css'
import 'lightgallery/css/lg-zoom.css'
import 'lightgallery/css/lg-fullscreen.css'
import 'lightgallery/css/lg-autoplay.css'
import lgThumbnail from 'lightgallery/plugins/thumbnail'
import lgZoom from 'lightgallery/plugins/zoom'
import lgFullscreen from 'lightgallery/plugins/fullscreen'
import './ImageSlider.css'

interface ImageSliderProps {
  imageList: string[]
  currentImage: string
  onClose: () => void
}

export default function ImageSlider({ imageList, currentImage, onClose }: ImageSliderProps) {
  const lightGalleryRef = useRef<any>(null)

  useEffect(() => {
    if (lightGalleryRef.current) {
      lightGalleryRef.current.instance.openGallery(imageList.indexOf(currentImage))
    }
  }, [imageList, currentImage])

  useEffect(() => {
    const closeButton = document.getElementById('lg-close-2')
    if (closeButton) {
      closeButton.addEventListener('click', onClose)
    }

    return () => {
      if (closeButton) {
        closeButton.removeEventListener('click', onClose)
      }
    }
  }, [onClose])

  useEffect(() => {
    document.body.classList.add('no-scroll')

    return () => {
      document.body.classList.remove('no-scroll')
    }
  }, [])

  return createPortal(
    <LightGallery
      onInit={(ref) => (lightGalleryRef.current = ref)}
      speed={500}
      plugins={[lgThumbnail, lgZoom, lgFullscreen]}
      download={false}
      index={imageList.indexOf(currentImage)}
      onAfterClose={() => {}}
    >
      {imageList.map((image, index) => (
        <a key={index} href={image}>
          <img src={image} alt={`Ảnh ${index + 1}`} />
        </a>
      ))}
    </LightGallery>,
    document.body
  )
}
