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
          border-width: 3px;
          border-style: solid;
          border-color: white;
          width: 100%;
          -webkit-appearance: none;
        }

        input.error {
          border-color: red;
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

        @media (max-width: 700px) {
          input {
            padding: 5px 12px;
            font-size: 17px;
            border-width: 2px;
          }

          .input-wrapper > .validation-error {
            bottom: 2px;
            right: 6px;
            font-size: 9px;
          }
        }
      `}</style>
    </>
  )
}

Input.propTypes = {
  error: string,
}
