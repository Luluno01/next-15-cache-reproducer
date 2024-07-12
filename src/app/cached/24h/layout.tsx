import { unstable_cache } from 'next/cache'
import { cache } from 'react'


const getUserCacheKey = 'cached.24h.getUser'

async function _getUser(user: string) {
  const revalidate = process.env.NODE_ENV === 'development'
    ? 60 // Revalidate the data at most every 1min
    : 24 * 3600 // Revalidate the data at most every 24h
  const ts = Date.now()
  console.log('Getting user', { revalidate, user, ts })
  return unstable_cache(
    async (user: string) => {
      const ts = Date.now()
      const res = { user, ts }
      console.log('Fetching user', res)
      return res
    },
    [ getUserCacheKey ],
    { revalidate, tags: [ `${getUserCacheKey}/${user}` ] }
  )(user)
}

const getUser = cache(_getUser)

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { ts } = await getUser('Foo')
  return <div>
    {ts}
    {children}
  </div>
}
