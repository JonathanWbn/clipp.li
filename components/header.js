export default function Footer() {
  return (
    <>
      <header>
        <h1>clippli</h1>
      </header>
      <style jsx>{`
        header {
          display: flex;
          align-items: center;
          width: 100%;
          height: 80px;
          padding: 10px 20px;
        }

        h1 {
          color: #333;
          text-decoration: none;
          transition: all 0.2s ease 0s;
          font-weight: 800;
          border-bottom: solid 2px transparent;
        }

        @media (max-width: 700px) {
          header {
            height: 60px;
          }
        }
      `}</style>
    </>
  )
}
