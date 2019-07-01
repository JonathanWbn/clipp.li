import moment from 'moment'

const youtubeIdRE = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#&?]*).*/

export const getYoutubeId = link => (link.match(youtubeIdRE) ? link.match(youtubeIdRE)[1] : null)

const padNumber = num => String(num).padStart(2, 0)

export const formatSeconds = secs => {
  const momentDuration = moment.duration(secs, 'seconds')
  const hours = momentDuration.hours()
  const minutes = momentDuration.minutes()
  const seconds = momentDuration.seconds()
  const hoursString = hours ? `${hours}:` : ''
  const minutesString = `${hours ? padNumber(minutes) : minutes}:`
  const secondsString = padNumber(seconds)

  return `${hoursString}${minutesString}${secondsString}`
}

export function copyToClipboard(text) {
  if (window.clipboardData && window.clipboardData.setData) {
    // IE specific code path to prevent textarea being shown while dialog is visible.
    return window.clipboardData.setData('Text', text)
  } else if (document.queryCommandSupported && document.queryCommandSupported('copy')) {
    var textarea = document.createElement('textarea')
    textarea.textContent = text
    textarea.style.position = 'fixed' // Prevent scrolling to bottom of page in MS Edge.
    document.body.appendChild(textarea)
    textarea.select()
    try {
      return document.execCommand('copy') // Security exception may be thrown by some browsers.
    } catch (ex) {
      return false
    } finally {
      document.body.removeChild(textarea)
    }
  }
}
