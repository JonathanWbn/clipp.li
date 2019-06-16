const { connectToDatabase } = require('./db')
const url = require('url')

module.exports = async (req, res) => {
  const { pathname } = url.parse(req.url)
  const slug = pathname.substr(1)

  const db = await connectToDatabase(process.env.MONGODB_URI)

  const clipsCollection = await db.collection('clips')

  const clip = await clipsCollection.findOne({ slug })

  if (clip) {
    const redirectUrl = `https://www.youtube.com/embed/${clip.videoId}?start=${clip.start}&end=${clip.end}`

    res.writeHead(302, { Location: redirectUrl })
    res.end()
  } else {
    res.send(`There is no clip for ${slug}`)
  }
}
