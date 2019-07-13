import { Box } from 'grommet'
import { number } from 'prop-types'

import { formatSeconds } from '../utils/helpers'

export default function Time({ seconds }) {
  return (
    <Box pad="small" alignSelf="center">
      <span style={{ fontFamily: 'monospace', fontSize: 14 }}>{formatSeconds(Math.round(seconds))}</span>
    </Box>
  )
}

Time.propTypes = {
  seconds: number.isRequired,
}
