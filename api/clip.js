const { connectToDatabase } = require('./db')
const bodyParser = require('body-parser')
const express = require('express')
const cors = require('cors')

const app = express()

app
  .use(bodyParser.urlencoded({ extended: true }))
  .use(bodyParser.json())
  .use(cors())

app.all('*', async (req, res) => {
  const slug = req.body.slug.replace(/ /g, '').toLowerCase()

  const db = await connectToDatabase()
  const clipsCollection = await db.collection('clips')

  const existingClip = await clipsCollection.findOne({ slug })

  if (existingClip) res.status(400).send('Slug already exists')
  else {
    await clipsCollection.insertOne({
      slug,
      start: req.body.start,
      end: req.body.end,
      videoId: req.body.videoId,
    })
    res.json({ success: true })
  }
})

module.exports = app
