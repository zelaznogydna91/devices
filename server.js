const express = require('express')
const axios = require('axios')
const path = require('path')
require('dotenv').config()

const FETCH_AMOUNT = 5
const RESULT_TYPE = 'popular'
const LANGUAGE = 'en'

const PORT = process.env.SERVER_PORT || 3001

const AUTH_TOKEN = process.env.TWITTER_AUTH_TOKEN || 'NO TOKEN WAS PROVIDED CHECK .env config'
const SEARCH_TWEETS_API_URL = process.env.TWITTER_SEARCH_ENDPOINT || 'https://api.twitter.com/1.1/search/tweets.json'

const regex = /https:[\w/.]+$/
const getLastUrl = (text) => (text.match(regex) || [false])[0]

const app = express()

app.use(express.static(path.join(__dirname, 'build'), {
  etag:   true,
  maxAge: '1m',
}))

app.get('/api/fetchTweets', (req, res) => {
  const { searchString, lastTweetId } = req.query

  axios.get(SEARCH_TWEETS_API_URL, {
    params: {
      q:           searchString,
      since_id:    lastTweetId,
      count:       FETCH_AMOUNT,
      result_type: RESULT_TYPE,
      lang:        LANGUAGE,
    },
    headers: {
      Authorization: `Bearer ${AUTH_TOKEN}`,
    },
  })
    .then((response) => {
      const { data } = response
      const tweets = data.statuses.map((rawTweet) => {
        const lastUrl = getLastUrl(rawTweet.text)
        const text = rawTweet.text.replace(lastUrl, '')
        return {
          id:           rawTweet.id,
          avatarUrl:    rawTweet.user.profile_image_url_https,
          username:     rawTweet.user.screen_name,
          hashtags:     rawTweet.entities.hashtags.map((hash) => hash.text),
          tweetContent: text,
          trailUrl:     lastUrl,
        }
      })
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ ok: true, tweets }))
    })
    .catch((e) => {
      console.log('\nServer Error in /api/fetchTweets', e)
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({
        ok:    false,
        error: { message: e.message, stack: e.stack, axiosCfg: e.config },
      }))
    })
})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`)
})
