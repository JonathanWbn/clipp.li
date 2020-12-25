import App from 'next/app'
import Head from 'next/head'
import React from 'react'

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props

    return (
      <>
        <Head>
          <link rel="shortcut icon" type="image/png" href="/static/favicon.png" />
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
          <meta name="description" content="Turn YouTube clips into short and beautiful URL's." />
          <meta name="keywords" content="clippli youtube clip crop bitly short" />
          <meta name="author" content="Jonathan Wieben" />
          <meta name="google-site-verification" content="PPgl0veNAre2jyEOs5sbiMxJJjBr6Fq7n9FmLxPdGxE" />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;
                ga('create', 'UA-142572804-1', 'auto');
                ga('send', 'pageview');
              `,
            }}
          />
          <script async src="https://www.google-analytics.com/analytics.js" />
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
      </>
    )
  }
}

export default MyApp
