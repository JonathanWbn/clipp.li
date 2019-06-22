import classnames from 'classnames'
import { string } from 'prop-types'

export default function Input({ error, ...props }) {
  return (
    <>
      <div className="input-wrapper youtube-url">
        <input {...props} className={classnames(error && 'error')} />
        {error && <div className="validation-error">{error}</div>}
      </div>
      <style jsx>{`
        input {
          border-radius: 10px;
          border: none;
          padding: 8px 17px;
          font-size: 22px;
          font-weight: 700;
          color: #333;
          border: 3px solid white;
          width: 100%;
        }

        input.error {
          border: 3px solid red;
        }

        .input-wrapper {
          position: relative;
        }

        .input-wrapper > .validation-error {
          color: red;
          position: absolute;
          bottom: 3px;
          right: 6px;
          font-size: 13px;
        }
      `}</style>
    </>
  )
}

Input.propTypes = {
  error: string,
}
