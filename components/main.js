import axios from 'axios'
import { Box, Grommet, RangeSelector, Stack, Text, grommet } from 'grommet'

import Button from './button'
import CopyButton from './copy-button'
import Input from './input'

const youtubeIdRE = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#&?]*).*/
const initialFormValues = { youtubeLink: '', start: 0, end: 9, slug: '' }
const isNumber = val => !Number.isNaN(parseInt(val))
const getYoutubeId = link => (link.match(youtubeIdRE) ? link.match(youtubeIdRE)[1] : null)
const validate = values => ({
  youtubeLink: (!values.youtubeLink && 'Required') || (!getYoutubeId(values.youtubeLink) && 'Invalid URL'),
  start: !isNumber(values.start) && 'Required',
  end: !isNumber(values.end) && 'Required',
  slug: !values.slug && 'Required',
})
const hasErrors = errors => Object.values(errors).some(Boolean)

function useYoutubeVideoDuration(youtubeId) {
  const [duration, setDuration] = React.useState(null)

  React.useEffect(async () => {
    if (youtubeId) {
      const { data } = await axios.get(
        `https://www.googleapis.com/youtube/v3/videos?id=${youtubeId}&part=contentDetails&key={YOUR_API_KEY}`
      )
      console.log('data', data)
      const duration = 0
      setDuration(duration)
    } else {
      setDuration(null)
    }
  }, [youtubeId])

  return duration
}

export default function Main() {
  const [formValues, setFormValues] = React.useState(initialFormValues)
  const [errors, setErrors] = React.useState({})
  const [status, setStatus] = React.useState(null)
  const [mostRecentSucess, setMostRecentSuccess] = React.useState(null)
  // const videoDuration = useYoutubeVideoDuration(getYoutubeId(formValues.youtubeLink))
  // console.log('videoDuration', videoDuration)

  React.useEffect(() => {
    // update errors if they already exist
    if (hasErrors(errors)) setErrors(validate(formValues))
  }, [formValues])
  React.useEffect(() => {
    const timeoutId = ['success', 'failure'].includes(status) && setTimeout(() => setStatus(null), 1000)
    return () => clearTimeout(timeoutId)
  }, [status])

  const handleSubmit = event => {
    const { youtubeLink, start, end, slug } = formValues
    event.preventDefault()

    const newErrors = validate(formValues)
    setErrors(newErrors)

    if (hasErrors(newErrors)) {
      const [firstInput] = Object.entries(newErrors).map(
        ([key, value]) => value && document.querySelector(`input[name="${key}"]`)
      )
      if (firstInput) firstInput.focus()
    } else {
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
            <Input
              value={formValues.youtubeLink}
              name="youtubeLink"
              onChange={e => setFormValues({ ...formValues, youtubeLink: e.target.value })}
              placeholder="YouTube URL"
              error={errors.youtubeLink}
            />
          </div>
          <div className="row">
            <Grommet theme={grommet}>
              <Stack>
                <Box direction="row" justify="between">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(value => (
                    <Box key={value} pad="small" border={false}>
                      <Text style={{ fontFamily: 'monospace' }}>{value}</Text>
                    </Box>
                  ))}
                </Box>
                <RangeSelector
                  min={0}
                  max={9}
                  size="full"
                  round="small"
                  values={[formValues.start, formValues.end]}
                  onChange={([start, end]) => setFormValues({ ...formValues, start, end })}
                />
              </Stack>
            </Grommet>
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
              error={errors.slug}
            />
          </div>
          <div className="row">
            <Button type="button" onClick={reset} design="secondary">
              Reset
            </Button>
            <Button onClick={handleSubmit} status={status} design="primary">
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
          margin-bottom: 40px;
          width: 100%;
          max-width: 480px;
        }

        .row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .row > :global(*) {
          width: calc(50% - 5px);
        }

        .row:first-child > :global(*) {
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
          bottom: -90px;
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

        @media (max-width: 700px) {
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
        }
      `}</style>
    </>
  )
}
