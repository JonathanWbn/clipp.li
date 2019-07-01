import { string } from 'prop-types'

import { copyToClipboard } from '../utils/helpers'
import Button from './button'

export default function CopyButton({ value }) {
  const [status, setStatus] = React.useState(null)

  const handleClick = () => {
    const success = copyToClipboard(value)

    if (success) setStatus('success')
    else setStatus('failure')

    setTimeout(() => setStatus(null), 1000)
  }

  return (
    <Button type="button" onClick={handleClick} design="secondary" size="small">
      {status === 'success' && 'Copied.'}
      {status === 'failure' && 'Not able to copy.'}
      {status === null && 'Copy'}
    </Button>
  )
}
CopyButton.propTypes = {
  value: string,
}
