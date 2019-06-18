import axios from 'axios'
import classnames from 'classnames'

import { copyToClipboard } from '../utils'

const isNumber = val => !Number.isNaN(parseInt(val))

export default function Main() {
  const [youtubeLink, setYoutubeLink] = React.useState('')
  const [start, setStart] = React.useState('')
  const [end, setEnd] = React.useState('')
  const [slug, setSlug] = React.useState('')
  const [errors, setErrors] = React.useState({})
  const [status, setStatus] = React.useState(null)
  const [showSuccessMessage, setShowSuccessMessage] = React.useState('')
  const [copySuccess, setCopySuccess] = React.useState(false)

  React.useEffect(() => setErrors({}), [youtubeLink, start, end, slug])

  const youtubeIdRE = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#&?]*).*/
  const handleSubmit = () => {
    const youtubeId = youtubeLink.match(youtubeIdRE) ? youtubeLink.match(youtubeIdRE)[1] : ''
    const errors = {}
    if (!youtubeId) errors.youtubeId = true
    if (!isNumber(start)) errors.start = true
    if (!isNumber(end)) errors.end = true
    if (!slug) errors.slug = true
    if (Object.keys(errors).length > 0) setErrors(errors)
    else {
      setErrors({})
      setStatus('loading')
      axios
        .post('/clip', { videoId: youtubeId, start: parseInt(start), end: parseInt(end), slug })
        .then(() => {
          setStatus('success')
          setShowSuccessMessage(slug)
          setTimeout(() => setStatus(null), 1000)
        })
        .catch(() => {
          setErrors({ slug: true })
          setStatus(null)
        })
    }
  }

  const reset = () => {
    setYoutubeLink('')
    setStart('')
    setEnd('')
    setSlug('')
  }

  const copyLink = () => {
    if (copyToClipboard(`https://clipp.li/${slug}`)) {
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 1000)
    }
  }

  return (
    <>
      <main>
        <h1>More than just a clip.</h1>
        <p>Turn clips from YouTube videos and turn them into short, beautiful links.</p>
        <form>
          <div>
            <input
              value={youtubeLink}
              onChange={e => setYoutubeLink(e.target.value)}
              placeholder="YouTube URL"
              className={classnames('youtube-url', errors.youtubeId && 'error')}
            />
            <div className="time-wrapper">
              <input
                value={start}
                onChange={e => setStart(e.target.value)}
                className={classnames('time', errors.start && 'error')}
                placeholder="Start (sec)"
              />
              <input
                value={end}
                onChange={e => setEnd(e.target.value)}
                className={classnames('time', errors.end && 'error')}
                placeholder="End (sec)"
              />
            </div>
            <div className="slug-wrapper">
              <div className="url-preview">
                <span>https://</span>clipp.li/
              </div>
              <input
                value={slug}
                onChange={e => setSlug(e.target.value.replace(/ /g, ''))}
                placeholder="URL ending"
                className={classnames('slug', errors.slug && 'error')}
              />
            </div>
          </div>
          <div className="buttons">
            <button type="button" onClick={reset} className="reset-button">
              Reset
            </button>
            <button type="button" onClick={handleSubmit} className={classnames('generate-button', status)}>
              Generate link
            </button>
          </div>
          {showSuccessMessage && (
            <div className="success-message">
              <a href={`https://clipp.li/${showSuccessMessage}`} target="_blank" rel="noopener noreferrer">
                https://clipp.li/{showSuccessMessage}
              </a>
              <button type="button" onClick={copyLink} className="copy-button">
                {copySuccess ? 'Copied.' : 'Copy'}
              </button>
            </div>
          )}
        </form>
      </main>
      <style jsx>{`
        main {
          height: calc(100vh - 200px);
          width: 100vw;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 20px;
          padding-right: 25%;
        }

        form {
          padding: 13px;
          background-color: #f5f5f5;
          border-radius: 10px;
          width: 500px;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        h1 {
          font-size: 70px;
          margin-bottom: 15px;
          width: 500px;
        }

        p {
          font-size: 18px;
          margin-bottom: 40px;
          width: 500px;
        }

        input {
          border-radius: 10px;
          border: none;
          padding: 8px 17px;
          font-size: 22px;
          font-weight: 700;
          color: #333;
          border: 3px solid white;
        }

        input.error {
          border: 3px solid red;
        }

        input.youtube-url {
          width: 100%;
          margin-bottom: 10px;
        }

        input.time {
          width: calc(50% - 5px);
        }

        .time-wrapper {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
        }

        .url-preview {
          color: #333;
          font-weight: 700;
          font-size: 22px;
        }

        .url-preview span {
          color: lightgrey;
        }

        .slug {
          width: calc(50% - 5px);
          margin-left: 15px;
        }

        .slug-wrapper {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          margin-bottom: 10px;
        }

        .buttons {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
        }

        button {
          width: calc(50% - 5px);
          border: none;
          align-self: center;
          padding: 10px 17px;
          border-radius: 10px;
          font-size: 17px;
          font-weight: 700;
          cursor: pointer;
        }

        button.loading {
          cursor: default;
          pointer-events: none;
          background-color: #a6dbff;
        }

        button.success {
          background-color: #00c969;
        }

        .generate-button {
          background-color: #09f;
          color: white;
        }

        .reset-button {
          background-color: #a4a4a4;
          color: white;
        }

        .copy-button {
          background-color: #a4a4a4;
          color: white;
          margin-left: 10px;
          min-width: 120px;
          width: unset;
        }

        .success-message {
          padding: 13px;
          background-color: #f5f5f5;
          border-radius: 10px;
          width: 500px;
          margin-top: 30px;
          position: absolute;
          left: 0;
          bottom: -90px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-weight: 700;
          font-size: 22px;
          color: #333;
          border: 3px solid #00c969;
        }

        .success-message a {
          flex-shrink: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: #333;
          text-decoration: none;
          transition: all 0.2s ease 0s;
          border-bottom: solid 2px transparent;
        }

        .success-message a:hover {
          border-bottom: solid 2px #333;
        }
      `}</style>
    </>
  )
}
