import axios from 'axios'
import classnames from 'classnames'

import Button from './button'
import CopyButton from './copy-button'

const isNumber = val => !Number.isNaN(parseInt(val))
const youtubeIdRE = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#&?]*).*/
const getYoutubeId = link => (link.match(youtubeIdRE) ? link.match(youtubeIdRE)[1] : null)
const initialFormValues = {
  youtubeLink: '',
  start: '',
  end: '',
  slug: '',
}
const validate = values => ({
  youtubeLink: !getYoutubeId(values.youtubeLink) && 'Provide a valid YouTube URL.',
  start: !isNumber(values.start) && 'Provide a start time.',
  end: !isNumber(values.end) && 'Provide an end time.',
  slug: !values.slug && 'Provide an URL ending.',
})
const isEmpty = obj => !Object.values(obj).some(Boolean)

export default function Main() {
  const [formValues, setFormValues] = React.useState(initialFormValues)
  const [errors, setErrors] = React.useState({})
  const [status, setStatus] = React.useState(null)
  const [mostRecentSucess, setMostRecentSuccess] = React.useState(null)

  React.useEffect(() => {
    if (!isEmpty(errors)) setErrors(validate(formValues))
  }, [formValues])
  React.useEffect(() => {
    const timeoutId = ['success', 'failure'].includes(status) && setTimeout(() => setStatus(null), 1000)
    return () => clearTimeout(timeoutId)
  }, [status])

  const handleSubmit = () => {
    const { youtubeLink, start, end, slug } = formValues

    const newErrors = validate(formValues)
    setErrors(newErrors)

    if (!isEmpty(newErrors)) {
      const [firstInput] = Object.entries(newErrors).map(
        ([key, value]) => value && document.querySelector(`input[name="${key}"]`)
      )
      if (firstInput) firstInput.focus()
      return
    }

    setStatus('loading')
    axios
      .post('/clip', { videoId: getYoutubeId(youtubeLink), start: parseInt(start), end: parseInt(end), slug })
      .then(() => {
        setStatus('success')
        setMostRecentSuccess(slug)
      })
      .catch(error => {
        setErrors({ slug: error.response.data || error.message })
        const slugInput = document.querySelector('input[name="slug"]')
        if (slugInput) slugInput.focus()
        setStatus('failure')
      })
  }

  const reset = () => {
    setFormValues(initialFormValues)
    setErrors({})
  }

  return (
    <>
      <main>
        <h1>More than just a clip.</h1>
        <p>Take clips from YouTube videos and turn them into short, beautiful links.</p>
        <form>
          <div className="row">
            <input
              value={formValues.youtubeLink}
              name="youtubeLink"
              onChange={e => setFormValues({ ...formValues, youtubeLink: e.target.value })}
              placeholder="YouTube URL"
              className={classnames('youtube-url', errors.youtubeLink && 'error')}
            />
          </div>
          <div className="row">
            <input
              value={formValues.start}
              name="start"
              onChange={e => setFormValues({ ...formValues, start: e.target.value })}
              className={classnames(errors.start && 'error')}
              placeholder="Start (sec)"
            />
            <input
              value={formValues.end}
              name="end"
              onChange={e => setFormValues({ ...formValues, end: e.target.value })}
              className={classnames(errors.end && 'error')}
              placeholder="End (sec)"
            />
          </div>
          <div className="row">
            <div className="url-preview">
              <span>https://</span>clipp.li/
            </div>
            <input
              value={formValues.slug}
              name="slug"
              onChange={e => setFormValues({ ...formValues, slug: e.target.value.replace(/ /g, '') })}
              placeholder="URL ending"
              className={classnames(errors.slug && 'error')}
            />
          </div>
          <div className="row validations">
            {Object.values(errors)
              .filter(Boolean)
              .map(str => (
                <>
                  {str}
                  <br />
                </>
              ))}
          </div>
          <div className="row">
            <Button type="button" onClick={reset} design="secondary">
              Reset
            </Button>
            <Button type="button" onClick={handleSubmit} status={status} design="primary">
              Generate link
            </Button>
          </div>
          {mostRecentSucess && (
            <div className="success-message">
              <a href={`https://clipp.li/${mostRecentSucess}`} target="_blank" rel="noopener noreferrer">
                https://clipp.li/{mostRecentSucess}
              </a>
              <CopyButton value={`https://clipp.li/${formValues.slug}`} />
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
          width: 480px;
          position: relative;
        }

        h1 {
          font-size: 70px;
          line-height: 70px;
          margin-bottom: 20px;
          width: 480px;
        }

        p {
          font-size: 18px;
          margin-bottom: 40px;
          width: 480px;
        }

        .row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .row > :global(*) {
          width: calc(50% - 5px);
        }

        .row:not(:first-child) {
          margin-top: 10px;
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
        }

        .url-preview {
          color: #333;
          font-weight: 700;
          font-size: 22px;
          text-align: end;
        }

        .url-preview span {
          color: lightgrey;
        }

        .success-message {
          padding: 13px;
          background-color: #f5f5f5;
          border-radius: 10px;
          width: 100%;
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

        .validations {
          color: red;
          justify-content: center;
          padding: 5px;
          text-align: center;
        }
      `}</style>
    </>
  )
}