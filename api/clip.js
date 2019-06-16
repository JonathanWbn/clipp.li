const { connectToDatabase } = require('./db')

module.exports = async (req, res) => {
  const db = await connectToDatabase(process.env.MONGODB_URI)

  const clipsCollection = await db.collection('clips')

  const existingClip = await clipsCollection.findOne({ slug: req.body.slug })
  if (existingClip) res.status(400).send('Slug already exists')
  else {
    await clipsCollection.insertOne({
      slug: req.body.slug,
      start: req.body.start,
      end: req.body.end,
      videoId: req.body.videoId,
    })
    res.json({ success: true })
  }
}
