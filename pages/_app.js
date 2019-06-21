import App, { Container } from 'next/app'
import Head from 'next/head'
import React from 'react'

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return { pageProps }
  }

  render() {
    const { Component, pageProps } = this.props

    return (
      <Container>
        <Head>
          <link rel="shortcut icon" type="image/png" href="/static/favicon.png" />
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
          <meta name="description" content="Turn YouTube clips into short and beautiful URL's" />
          <meta name="keywords" content="clippli youtube clip crop bitly" />
          <meta name="author" content="Jonathan Wieben" />
          <title>clippli | More than just a clip.</title>
        </Head>
        <Component {...pageProps} />
        <style global jsx>{`
          html {
            font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue',
              Arial, sans-serif;
            font-size: 16px;
            word-spacing: 1px;
            -ms-text-size-adjust: 100%;
            -webkit-text-size-adjust: 100%;
            -moz-osx-font-smoothing: grayscale;
            -webkit-font-smoothing: antialiased;
            box-sizing: border-box;
          }

          *,
          *:before,
          *:after {
            box-sizing: border-box;
            margin: 0;
            outline: none;
          }

          body {
            background: white;
          }
        `}</style>
      </Container>
    )
  }
}

export default MyApp
