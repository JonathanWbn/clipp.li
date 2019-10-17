# YouTube Video Cropper And URL Shortener In One

This is a website which allows one to select a specific time range of a YouTube video and make it accessible under a custom slug. It's like bit.ly, but for YouTube clips.
You can check it out here: [clipp.li](https://clipp.li)

I've also build a Chrome extension for it: [Chrome extension](https://chrome.google.com/webstore/detail/clippli/bcnmhnmdkkonjeeaiobhkbmclbpdllmf)

### Stack

The backend is a serverless Node API connected to a MongoDB database.

The frontend is a [React](https://reactjs.org/) app, which is server-side-rendered with [Next.js](https://nextjs.org/).

I'm using [Zeit's Now product](https://zeit.co/now) for serverless deployments.

### Future

You can track the currrent development and future plans of this project [at my public Trello board](https://trello.com/b/qxJ6iZLK/clippli).

### Contribute

In order to develop this app you're going to need the [Now CLI](https://github.com/zeit/now-cli).

Then, you can just run `now dev` and play around on `http://localhost:3000/`
