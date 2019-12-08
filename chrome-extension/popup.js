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
  const momentDuration = window.moment.duration(+secs, 'seconds')
  const hours = momentDuration.hours()
  const minutes = momentDuration.minutes()
  const seconds = momentDuration.seconds()
  const hoursString = hours ? `${hours}:` : ''
  const minutesString = `${hours ? padNumber(minutes) : minutes}:`
  const secondsString = padNumber(seconds)

  return `${hoursString}${minutesString}${secondsString}`
}
const HOURS = 'h:mm:ss'
const MINUTES = 'm:ss'
const SECONDS = 's'
const getTimeFormat = duration => {
  const momentDuration = window.moment.duration(duration, 'seconds')
  const hours = momentDuration.hours()
  const minutes = momentDuration.minutes()
  if (hours) return HOURS
  else if (minutes) return MINUTES
  else return SECONDS
}
const formatForMoment = (value, format) => {
  if (format === SECONDS) return `0:00:${value}`
  else if (format === MINUTES) {
    if (value.includes(':')) return `0:${value}`
    else return `0:${formatSeconds(value)}`
  } else return value
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

  const startInput = document.getElementById('start')
  const endInput = document.getElementById('end')
  const slugInput = document.getElementById('slug')
  const successLink = document.getElementById('success-link')

  const successMessage = document.getElementById('success')
  const failureMessage = document.getElementById('failure')

  const videoId = await getYoutubeId()
  const videoDuration = await getVideoDuration(videoId)

  if (typeof videoDuration === 'number') {
    let startTime = 0
    let endTime = videoDuration

    const timeFormat = getTimeFormat(videoDuration)

    const clearErrors = () => {
      startInput.classList.remove('error')
      endInput.classList.remove('error')
      slugInput.classList.remove('error')
    }

    startInput.onchange = clearErrors
    endInput.onchange = clearErrors
    slugInput.onchange = clearErrors

    startInput.onblur = () => {
      const duration = window.moment.duration(formatForMoment(startInput.value, timeFormat)).asSeconds()
      startInput.value = formatSeconds(duration)
      startTime = duration
    }
    endInput.onblur = () => {
      const duration = window.moment.duration(formatForMoment(endInput.value, timeFormat)).asSeconds()
      endInput.value = formatSeconds(duration)
      endTime = duration
    }

    startInput.value = formatSeconds(startTime)
    endInput.value = formatSeconds(videoDuration)
    startInput.placeholder = timeFormat

    const showStartError = () => {
      startInput.classList.add('error')
    }
    const showEndError = () => {
      endInput.classList.add('error')
    }
    const showSlugError = () => {
      slugInput.classList.add('error')
    }

    form.onsubmit = async function(event) {
      event.preventDefault()
      const slug = slugInput.value
      successMessage.style.display = 'none'

      if (endTime <= startTime) return showEndError('The end time must be bigger than the start time.')
      if (startTime > videoDuration) return showStartError("Start time can't be bigger than video duration")
      if (endTime > videoDuration) return showEndError("End time can't be bigger than video duration")
      if (!slug) return showSlugError('Please provide a slug.')

      try {
        await window.axios.post('https://clipp.li/api/clip', {
          slug,
          start: startTime,
          end: endTime,
          videoId,
        })
        successMessage.style.display = 'block'
        successLink.href = `https://clipp.li/${slug}`
        successLink.innerText = `https://clipp.li/${slug}`
      } catch (err) {
        failureMessage.style.display = 'block'
        failureMessage.innerText = err.response.data || 'Something went wrong.'
        setTimeout(() => (failureMessage.style.display = 'none'), 1500)
      }
    }
  } else {
    form.style.display = 'none'
    document.getElementById('invalid-link-errorr').style.display = 'block'
  }
})()
