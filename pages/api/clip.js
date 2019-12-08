import { connectToDatabase } from '../../db'

export default async (req, res) => {
  if (req.method === 'POST') {
    const { body } = req

    const slug = body.slug.replace(/ /g, '').toLowerCase()

    const db = await connectToDatabase()
    const clipsCollection = await db.collection('clips')

    const existingClip = await clipsCollection.findOne({ slug })

    if (existingClip) res.status(400).send('Slug already exists')
    else {
      await clipsCollection.insertOne({
        slug,
        start: body.start,
        end: body.end,
        videoId: body.videoId,
      })
      res.json({ success: true })
    }
  }
}
