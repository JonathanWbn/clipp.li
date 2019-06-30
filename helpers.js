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
