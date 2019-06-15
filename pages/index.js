import Footer from '../components/Footer'

export default () => {
  const [youtubeLink, setYoutubeLink] = React.useState('')
  const [start, setStart] = React.useState(0)
  const [end, setEnd] = React.useState(120)

  const youtubeIdRE = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/
  const youtubeId = youtubeLink.match(youtubeIdRE)
    ? youtubeLink.match(youtubeIdRE)[1]
    : ''

  return (
    <>
      <main>
        <h1>clip.yt</h1>
        <h4>Clip parts of youtube videos.</h4>
        <div>
          <div>
            <input
              value={youtubeLink}
              onChange={e => setYoutubeLink(e.target.value)}
            />
            <div>
              <input value={start} onChange={e => setStart(e.target.value)} />
              <input value={end} onChange={e => setEnd(e.target.value)} />
            </div>
          </div>
        </div>
        <a href={`/clip?yt=${youtubeId}&start=${start}&end=${end}`}>
          Crop it up.
        </a>
      </main>
      <Footer />
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
