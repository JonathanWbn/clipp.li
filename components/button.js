import classnames from 'classnames'
import { oneOf } from 'prop-types'

export default function Button({ status, design, size, ...props }) {
  return (
    <>
      <button disabled={Boolean(status)} className={classnames(design, status, size)} {...props} />
      <style jsx>{`
        button {
          border: none;
          border-radius: 10px;
          font-weight: 700;
          cursor: pointer;
        }

        button.medium {
          padding: 10px 17px;
          font-size: 17px;
        }

        button.small {
          padding: 8px 15px;
          font-size: 15px;
        }

        button:disabled {
          cursor: default;
          pointer-events: none;
        }

        button.primary {
          background-color: #09f;
          color: white;
        }

        button.secondary {
          background-color: #a4a4a4;
          color: white;
        }

        button.primary.loading {
          background-color: #a6dbff;
        }

        button.primary.success {
          background-color: #00c969;
        }

        button.primary.failure {
          background-color: red;
        }

        @media (max-width: 700px) {
          button.medium {
            padding: 8px 14px;
            font-size: 14px;
          }
        }
      `}</style>
    </>
  )
}

Button.propTypes = {
  design: oneOf(['primary', 'secondary']),
  status: oneOf(['loading', 'success', 'failure']),
  size: oneOf(['small', 'medium']),
}

Button.defaultProps = {
  size: 'medium',
}
