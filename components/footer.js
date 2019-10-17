export default function Footer() {
  return (
    <>
      <footer>
        <a href="https://github.com/JonathanWbn/clipp.li" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
          GitHub
        </a>
        <a
          href="https://chrome.google.com/webstore/detail/clippli/bcnmhnmdkkonjeeaiobhkbmclbpdllmf"
          target="_blank"
          rel="noopener noreferrer"
        >
          Chrome Extension
        </a>
        <a href="/impressum">Impressum</a>
      </footer>
      <style jsx>{`
        footer {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 120px;
        }

        footer a {
          color: #333;
          text-decoration: none;
          transition: all 0.2s ease 0s;
          font-size: 16px;
          font-weight: 800;
          border-bottom: solid 2px transparent;
        }

        footer a:not(:last-child) {
          margin-right: 40px;
        }

        footer a:hover {
          border-bottom: solid 2px #333;
        }

        @media (max-width: 700px) {
          footer {
            height: 60px;
          }
        }
      `}</style>
    </>
  )
}
