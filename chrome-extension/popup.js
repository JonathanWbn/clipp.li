'use strict'

const youtubeIdRE = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#&?]*).*/
const getYoutubeId = () =>
  new Promise(resolve => {
    window.chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      const youtubeId = tabs[0].url.match(youtubeIdRE) ? tabs[0].url.match(youtubeIdRE)[1] : null
      resolve(youtubeId)
    })
  })
const padNumber = num => String(num).padStart(2, 0)
const formatSeconds = secs => {
  const momentDuration = window.moment.duration(secs, 'seconds')
  const hours = momentDuration.hours()
  const minutes = momentDuration.minutes()
  const seconds = momentDuration.seconds()
  const hoursString = hours ? `${hours}:` : ''
  const minutesString = `${hours ? padNumber(minutes) : minutes}:`
  const secondsString = padNumber(seconds)

  return `${hoursString}${minutesString}${secondsString}`
}
const getVideoDuration = async youtubeId => {
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?id=${youtubeId}&part=contentDetails&key=AIzaSyAEJUDG4jawVOGAL6-im8wC2ThEWmBpskU`
  )
  try {
    const data = await res.json()
    const [youtubeVideo] = data.items
    const duration = window.moment.duration(youtubeVideo.contentDetails.duration).asSeconds()
    return duration
  } catch (e) {
    return null
  }
}
;(async () => {
  const form = document.querySelector('form')

  const start = document.getElementById('start')
  const end = document.getElementById('end')

  const startSubtract = document.getElementById('start-subtract')
  const startAdd = document.getElementById('start-add')
  const endSubtract = document.getElementById('end-subtract')
  const endAdd = document.getElementById('end-add')

  const successMessage = document.getElementById('success')
  const failureMessage = document.getElementById('failure')

  const videoId = await getYoutubeId()
  const videoDuration = await getVideoDuration(videoId)

  if (typeof videoDuration === 'number') {
    let startTime = 0
    let endTime = videoDuration

    const updateTimes = () => {
      start.innerHTML = formatSeconds(startTime)
      end.innerHTML = formatSeconds(endTime)
    }
    updateTimes()

    startSubtract.onclick = () => {
      if (startTime === 0) return
      startTime--
      updateTimes()
    }
    startAdd.onclick = () => {
      if (startTime === endTime - 1) return
      startTime++
      updateTimes()
    }
    endSubtract.onclick = () => {
      if (endTime === startTime + 1) return
      endTime--
      updateTimes()
    }
    endAdd.onclick = () => {
      if (endTime === videoDuration) return
      endTime++
      updateTimes()
    }

    form.onsubmit = function(event) {
      event.preventDefault()
      const slug = document.getElementById('slug').value
      window.chrome.tabs.query({ active: true, currentWindow: true }, function() {
        fetch('https://clipp.li/clip', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            slug,
            start: startTime,
            end: endTime,
            videoId,
          }),
        })
          .then(res => res.json())
          .then(() => {
            successMessage.style.display = 'block'
            setTimeout(() => (successMessage.style.display = 'none'), 1500)
          })
          .catch(() => {
            failureMessage.style.display = 'block'
            setTimeout(() => (failureMessage.style.display = 'none'), 1500)
          })
      })
    }
  } else {
    form.style.display = 'none'
    document.getElementById('invalid-link-errorr').style.display = 'block'
  }
})()
