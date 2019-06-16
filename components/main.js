import axios from 'axios'

export default function Main() {
  const [youtubeLink, setYoutubeLink] = React.useState('')
  const [start, setStart] = React.useState(0)
  const [end, setEnd] = React.useState(120)
  const [slug, setSlug] = React.useState('')

  const youtubeIdRE = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/
  const youtubeId = youtubeLink.match(youtubeIdRE) ? youtubeLink.match(youtubeIdRE)[1] : ''
  const handleSubmit = () => {
    if (youtubeId && slug && start && end) axios.post('/clip', { videoId: youtubeId, start, end, slug })
  }

  return (
    <>
      <main>
        <h1>clipp.li</h1>
        <h4>Clip parts of youtube videos.</h4>
        <div>
          <div>
            <input value={youtubeLink} onChange={e => setYoutubeLink(e.target.value)} />
            <div>
              <input value={start} onChange={e => setStart(e.target.value)} />
              <input value={end} onChange={e => setEnd(e.target.value)} />
            </div>
            <input value={slug} onChange={e => setSlug(e.target.value)} />
          </div>
        </div>
        <button onClick={handleSubmit}>Crop it up.</button>
      </main>
      <style jsx>{`
        main {
          height: calc(100vh - 120px);
          padding-top: 120px;
          width: 100vw;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        h1 {
          color: #ab352f;
        }
      `}</style>
    </>
  )
}
