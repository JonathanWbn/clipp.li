import { useWindowSize } from '../utils/hooks'

function ExtensionInfo() {
  const { width: screenWidth } = useWindowSize()

  if (screenWidth < 1000) return null
  return (
    <>
      <div className="container">
        <h4>Try the new clippli Chrome extension!</h4>
        <img src="/static/chrome-extension.png" />
        <a href="TODO" target="_blank">
          Check it out here!
        </a>
      </div>
      <style jsx>{`
        .container {
          position: absolute;
          bottom: 100px;
          right: 50px;
          padding: 20px 15px;
          border: 2px solid #09f;
          border-radius: 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        img {
          margin: 20px 0;
          width: 300px;
          border: 1px solid lightgrey;
          border-radius: 3px;
        }
        a {
          color: #333;
          text-decoration: none;
          transition: all 0.2s ease 0s;
          font-size: 16px;
          font-weight: 800;
          border-bottom: solid 2px transparent;
        }
        a:hover {
          border-bottom: solid 2px #333;
        }
      `}</style>
    </>
  )
}

export default ExtensionInfo
