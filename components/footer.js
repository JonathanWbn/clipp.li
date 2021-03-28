import React from 'react'

export default function Footer() {
  return (
    <>
      <footer>
        <a href="https://jonathanwieben.com/" target="_blank" rel="noopener noreferrer">
          Author
        </a>
        <a
          href="https://www.notion.so/jwieben/Impressum-7be1b0e1a1384c1cb9362bd1aef963d1"
          target="_blank"
          rel="noopener noreferrer"
        >
          Impressum
        </a>
        <a href="https://github.com/JonathanWbn/clipp.li" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
          GitHub
        </a>
      </footer>
      <style jsx>{`
        footer {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 60px;
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

          footer a {
            font-size: 12px;
          }
        }
      `}</style>
    </>
  )
}
