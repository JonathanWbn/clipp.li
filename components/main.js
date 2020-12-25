import axios from 'axios'
import classnames from 'classnames'
import { Box, Grommet, RangeSelector, Stack } from 'grommet'
import randomstring from 'randomstring'

import { formatSeconds, getYoutubeId } from '../utils/helpers'
import { useMobile, useWindowSize, useYoutubeVideoDuration } from '../utils/hooks'
import Button from './button'
import CopyButton from './copy-button'
import Input from './input'
import Time from './time'

const isValidSlug = slug => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)

const initialFormValues = { youtubeLink: '', start: 0, end: 0, slug: '' }
const validate = (values, hasValidUrl) => ({
  youtubeLink: (!values.youtubeLink && 'Required') || (!hasValidUrl && 'Invalid URL'),
  slug: (!values.slug && 'Required') || (!isValidSlug(values.slug) && 'Invalid slug'),
})
const hasErrors = errors => Object.values(errors).some(Boolean)
const focusOnFirstError = errors => {
  const [firstInput] = Object.entries(errors).map(
    ([key, value]) => value && document.querySelector(`input[name="${key}"]`)
  )
  if (firstInput) firstInput.focus()
}

export default function Main() {
  const [formValues, setFormValues] = React.useState(initialFormValues)
  const [errors, setErrors] = React.useState({})
  const [status, setStatus] = React.useState(null)
  const [mostRecentSucess, setMostRecentSuccess] = React.useState(null)

  const youtubeId = getYoutubeId(formValues.youtubeLink)
  const videoDuration = useYoutubeVideoDuration(youtubeId)
  const isMobile = useMobile()
  const { width: screenWidth } = useWindowSize()

  const hasValidUrl = typeof videoDuration === 'number'

  React.useEffect(() => {
    // update errors if they already exist
    if (hasErrors(errors)) setErrors(validate(formValues, hasValidUrl))
    if (formValues.start < 0) setFormValues({ ...formValues, start: 0 })
    if (formValues.end > videoDuration) setFormValues({ ...formValues, end: videoDuration })
  }, [formValues, videoDuration])

  React.useEffect(() => {
    const timeoutId = ['success', 'failure'].includes(status) && setTimeout(() => setStatus(null), 1000)
    return () => clearTimeout(timeoutId)
  }, [status])

  React.useEffect(() => {
    if (videoDuration) setFormValues({ ...formValues, start: 0, end: videoDuration })
  }, [videoDuration])

  const handleSubmit = () => {
    const { start, end, slug } = formValues

    const newErrors = validate(formValues, hasValidUrl)
    setErrors(newErrors)

    if (hasErrors(newErrors)) {
      focusOnFirstError(newErrors)
    } else {
      setStatus('loading')
      axios
        .post('/api/clip', { videoId: youtubeId, start: parseInt(start), end: parseInt(end), slug })
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
  }

  const reset = () => {
    setFormValues(initialFormValues)
    setErrors({})
  }

  const generateRandomSlug = () => {
    setFormValues({
      ...formValues,
      slug: randomstring.generate({
        length: 5,
        charset: 'alphabetic',
        capitalization: 'lowercase',
      }),
    })
  }

  return (
    <div className="wrapper">
      <main>
        <h1>More than just a clip.</h1>
        <p>Take clips from YouTube videos and turn them into short links.</p>
        <form>
          <div className="row full">
            <Input
              value={formValues.youtubeLink}
              name="youtubeLink"
              onChange={e => setFormValues({ ...formValues, youtubeLink: e.target.value })}
              placeholder="YouTube URL"
              error={errors.youtubeLink || ''}
            />
          </div>
          <div className="row full">
            <Grommet theme={{}}>
              {isMobile !== undefined && (
                <Stack>
                  <Box
                    direction="row"
                    justify="between"
                    round="10px"
                    background={hasValidUrl ? 'white' : 'rgba(183, 183, 183, 0.15)'}
                    height={isMobile ? '40px' : '48px'}
                  >
                    {hasValidUrl && (
                      <>
                        <Time seconds={0} />
                        {isMobile ? (
                          <Time seconds={videoDuration / 2} />
                        ) : (
                          <>
                            <Time seconds={videoDuration * 0.2} />
                            <Time seconds={videoDuration * 0.4} />
                            <Time seconds={videoDuration * 0.6} />
                            <Time seconds={videoDuration * 0.8} />
                          </>
                        )}
                        <Time seconds={videoDuration} />
                      </>
                    )}
                  </Box>
                  {hasValidUrl && (
                    <RangeSelector
                      color="rgba(0,153,255,1)"
                      min={0}
                      max={videoDuration}
                      round="10px"
                      size="full"
                      values={[formValues.start, formValues.end]}
                      onChange={([start, end]) => setFormValues({ ...formValues, start, end })}
                    />
                  )}
                </Stack>
              )}
            </Grommet>
          </div>
          <div className="row">
            <div className={classnames('time', !hasValidUrl && 'disabled')}>
              <div className="value">{hasValidUrl ? formatSeconds(formValues.start) : ''}</div>
              <button type="button" onClick={() => setFormValues({ ...formValues, start: formValues.start - 1 })}>
                -
              </button>
              <button type="button" onClick={() => setFormValues({ ...formValues, start: formValues.start + 1 })}>
                +
              </button>
            </div>
            <div className={classnames('time', !hasValidUrl && 'disabled')}>
              <div className="value">{hasValidUrl ? formatSeconds(formValues.end) : ''}</div>
              <button type="button" onClick={() => setFormValues({ ...formValues, end: formValues.end - 1 })}>
                -
              </button>
              <button type="button" onClick={() => setFormValues({ ...formValues, end: formValues.end + 1 })}>
                +
              </button>
            </div>
          </div>
          <div className="row">
            <div className="url-preview">
              <span>https://</span>clipp.li/
            </div>
            <Input
              value={formValues.slug}
              name="slug"
              onChange={e => setFormValues({ ...formValues, slug: e.target.value.replace(/ /g, '').toLowerCase() })}
              placeholder="URL ending"
              error={errors.slug || ''}
            />
            <svg
              className="random"
              onClick={generateRandomSlug}
              x="0px"
              y="0px"
              width="25"
              height="25"
              viewBox="0 0 32 32"
            >
              <title>Generate random slug</title>
              <g id="surface1">
                <path d="M 16 4 C 10.886719 4 6.617188 7.160156 4.875 11.625 L 6.71875 12.375 C 8.175781 8.640625 11.710938 6 16 6 C 19.242188 6 22.132813 7.589844 23.9375 10 L 20 10 L 20 12 L 27 12 L 27 5 L 25 5 L 25 8.09375 C 22.808594 5.582031 19.570313 4 16 4 Z M 25.28125 19.625 C 23.824219 23.359375 20.289063 26 16 26 C 12.722656 26 9.84375 24.386719 8.03125 22 L 12 22 L 12 20 L 5 20 L 5 27 L 7 27 L 7 23.90625 C 9.1875 26.386719 12.394531 28 16 28 C 21.113281 28 25.382813 24.839844 27.125 20.375 Z "></path>
              </g>
            </svg>
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
      {!(screenWidth < 1000) &&
        (hasValidUrl ? (
          <img className="thumbnail" src={`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`} />
        ) : (
          <div className="thumbnail-fallback" />
        ))}
      <style jsx>{`
        .wrapper {
          height: calc(100vh - 140px);
          width: 100vw;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
        }

        main {
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        form {
          padding: 13px;
          background-color: #f5f5f5;
          border-radius: 10px;
          width: 100%;
          max-width: 480px;
          position: relative;
        }

        h1 {
          font-size: 70px;
          line-height: 70px;
          margin-bottom: 20px;
          width: 100%;
          max-width: 480px;
        }

        p {
          font-size: 18px;
          margin-bottom: 25px;
          width: 100%;
          max-width: 480px;
        }

        .row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
        }

        .row > :global(*) {
          width: calc(50% - 5px);
        }

        .row.full > :global(*) {
          width: 100%;
        }

        .row:not(:first-child) {
          margin-top: 10px;
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
          position: absolute;
          left: 0;
          bottom: -80px;
          display: flex;
          justify-content: space-between;
          align-items: center;
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
          border-top: 2px solid transparent;
          font-weight: 700;
          font-size: 22px;
        }

        .success-message a:hover {
          border-bottom: solid 2px #333;
        }

        .time {
          background-color: white;
          border-radius: 10px;
          display: flex;
          height: 48px;
        }

        .time .value {
          flex-grow: 1;
          display: flex;
          align-items: center;
          padding: 8px 17px;
          color: #333;
          font-weight: bold;
          font-size: 22px;
        }

        .time.disabled {
          background-color: rgba(183, 183, 183, 0.15);
        }

        .time > button {
          background-color: unset;
          border: none;
          font-size: 20px;
          font-weight: bold;
          color: #333;
          cursor: pointer;
          width: 45px;
          border-left: 2px solid rgba(183, 183, 183, 0.15);
        }

        .time.disabled > button {
          cursor: not-allowed;
          color: #a4a4a4;
        }

        .thumbnail {
          object-fit: cover;
          height: 250px;
          width: 445px;
          margin-left: 50px;
          border-radius: 8px;
          box-shadow: 27.1px 62.5px 125px -25px rgba(50, 50, 93, 0.5), 16.2px 37.5px 75px -37.5px rgba(0, 0, 0, 0.6);
          transform: rotate3d(0.174, -0.985, 0, 15deg);
        }

        .thumbnail-fallback {
          margin-left: 50px;
          width: 445px;
        }

        .random {
          cursor: pointer;
          width: 40px;
          fill: #a4a4a4;
          transition: 0.2s all;
          position: absolute;
          right: 0px;
          top: 12px;
        }

        .random:hover {
          fill: #09f;
        }

        @media (max-width: 700px) {
          .wrapper {
            height: calc(100vh - 120px);
          }

          main {
            height: calc(100vh - 120px);
          }

          h1 {
            font-size: 30px;
            line-height: 40px;
            margin-bottom: 10px;
          }

          p {
            margin-bottom: 20px;
          }

          main {
            padding: 10px;
            padding-bottom: 30px;
          }

          .url-preview {
            font-size: 17px;
          }

          .success-message {
            padding: 6px;
            bottom: -60px;
            border: 2px solid #00c969;
          }

          .success-message a {
            font-size: 18px;
          }

          .time {
            height: 34px;
          }

          .time > button {
            width: 30px;
            font-size: 16px;
          }

          .time .value {
            font-size: 15px;
            padding: 3px 7px;
          }
        }
      `}</style>
    </div>
  )
}
