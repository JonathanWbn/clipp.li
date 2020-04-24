import { connectToDatabase } from '../../db'

export default async (req, res) => {
  const { slug } = req.query

  const db = await connectToDatabase()
  const clipsCollection = await db.collection('clips')
  const clip = await clipsCollection.findOne({ slug })

  if (clip) {
    await saveRedirect()

    const redirectUrl = `https://www.youtube.com/embed/${clip.videoId}?start=${clip.start}&end=${clip.end}&autoplay=1`

    res.writeHead(308, { Location: redirectUrl })
    res.end()
  } else {
    res.send(`There is no clip for ${slug}`)
  }

  async function saveRedirect() {
    try {
      const redirects = clip.redirects ? [...clip.redirects] : []
      redirects.push({
        date: Date.now(),
        userAgent: req.headers['user-agent'],
      })
      await clipsCollection.updateOne({ slug }, { $set: { redirects } })
    } catch (e) {
      // failing save
    }
  }
}
