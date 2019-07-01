import axios from 'axios'
import moment from 'moment'
import React from 'react'

function getSize() {
  if (typeof window === 'undefined') return {}
  return { height: window.innerHeight, width: window.innerWidth }
}

export function useWindowSize() {
  let [windowSize, setWindowSize] = React.useState(getSize())

  function handleResize() {
    setWindowSize(getSize())
  }

  React.useEffect(() => {
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return windowSize
}

export function useYoutubeVideoDuration(youtubeId) {
  const [duration, setDuration] = React.useState(null)

  React.useEffect(() => {
    if (youtubeId) {
      axios
        .get(
          `https://www.googleapis.com/youtube/v3/videos?id=${youtubeId}&part=contentDetails&key=AIzaSyAEJUDG4jawVOGAL6-im8wC2ThEWmBpskU`
        )
        .then(({ data }) => {
          const [youtubeVideo] = data.items
          if (youtubeVideo) {
            const duration = moment.duration(youtubeVideo.contentDetails.duration).asSeconds()
            setDuration(duration)
          } else {
            setDuration(null)
          }
        })
    } else {
      setDuration(null)
    }
  }, [youtubeId])

  return duration
}

export function useMobile() {
  const { width: screenWidth } = useWindowSize()

  return screenWidth === undefined ? undefined : screenWidth < 700
}
