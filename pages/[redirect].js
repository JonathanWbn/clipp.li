import { useRouter } from 'next/router'
import React from 'react'

export default () => {
  const router = useRouter()
  const { redirect } = router.query

  React.useEffect(() => {
    location.href = `/api/${redirect}`
  })

  return null
}
