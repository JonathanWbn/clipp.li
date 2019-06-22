const { connectToDatabase } = require('./db')
const url = require('url')

module.exports = async (req, res) => {
  const { pathname } = url.parse(req.url)
  const slug = pathname.substr(1).toLowerCase()

  console.log('mongourl', process.env.MONGO_URL)
  const db = await connectToDatabase(process.env.MONGO_URL)
  const clipsCollection = await db.collection('clips')
  const clip = await clipsCollection.findOne({ slug })

  if (clip) {
    await saveRedirect()

    const redirectUrl = `https://www.youtube.com/embed/${clip.videoId}?start=${clip.start}&end=${clip.end}`

    res.writeHead(302, { Location: redirectUrl })
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
