import App, { Container } from 'next/app'
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
