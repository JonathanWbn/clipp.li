export default () => (
  <>
    <footer>
      <a
        href="https://github.com/JonathanWbn/"
        target="_blank"
        aria-label="GitHub"
      >
        <svg width="20px" height="20px" viewBox="0 0 14 14" aria-label="github">
          <path d="M7 .175c-3.872 0-7 3.128-7 7 0 3.084 2.013 5.71 4.79 6.65.35.066.482-.153.482-.328v-1.181c-1.947.415-2.363-.941-2.363-.941-.328-.81-.787-1.028-.787-1.028-.634-.438.044-.416.044-.416.7.044 1.071.722 1.071.722.635 1.072 1.641.766 2.035.59.066-.459.24-.765.437-.94-1.553-.175-3.193-.787-3.193-3.456 0-.766.262-1.378.721-1.881-.065-.175-.306-.897.066-1.86 0 0 .59-.197 1.925.722a6.754 6.754 0 0 1 1.75-.24c.59 0 1.203.087 1.75.24 1.335-.897 1.925-.722 1.925-.722.372.963.131 1.685.066 1.86.46.48.722 1.115.722 1.88 0 2.691-1.641 3.282-3.194 3.457.24.219.481.634.481 1.29v1.926c0 .197.131.415.481.328C11.988 12.884 14 10.259 14 7.175c0-3.872-3.128-7-7-7z" />
        </svg>
      </a>
      <a href="https://twitter.com/JoniWieben" target="_blank">
        <svg
          width="20px"
          height="20px"
          viewBox="0 0 18 15"
          aria-label="twitter"
        >
          <path d="M18 1.684l-1.687 1.684v.28c0 .307-.05.602-.123.886-.04 2.316-.777 5.387-3.816 7.81C6.404 17.115 0 12.907 0 12.907c5.063 0 5.063-1.684 5.063-1.684-1.126 0-3.376-2.243-3.376-2.243.563.56 1.689 0 1.689 0C.56 7.295.56 5.61.56 5.61c.563.561 1.689 0 1.689 0C-.563 3.368 1.124.561 1.124.561 1.687 3.368 9 4.49 9 4.49l.093-.046A6.637 6.637 0 0 1 9 3.368C9 1.353 10.636 0 12.656 0c1.112 0 2.094.506 2.765 1.286l.329-.163L17.437 0l-1.122 2.245L18 1.684z" />
        </svg>
      </a>
      <a href="mailto:joni.wieben@icloud.com">
        <span>joni.wieben@icloud.com</span>
      </a>
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
        color: #a6662e;
        text-decoration: none;
        transition: all 0.2s ease 0s;
      }

      footer a:not(:last-child) {
        padding-right: 20px;
        margin-right: 20px;
        border-right: 1px solid #d99152;
      }

      footer a:hover {
        color: #8c031c;
      }

      footer a svg {
        fill: currentColor;
      }
    `}</style>
  </>
)
