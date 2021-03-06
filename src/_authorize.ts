import Twitter, { AccessTokenResponse, TokenResponse } from 'twitter-lite'
import chalk from 'chalk'
import Terminal from './lib/util/Terminal'

const TWITTER_CONSUMER_KEY = process.env.TWITTER_CONSUMER_KEY
const TWITTER_CONSUMER_SECRET = process.env.TWITTER_CONSUMER_SECRET
const TWITTER_CALLBACK_URL = process.env.TWITTER_CALLBACK_URL

// https://www.npmjs.com/package/twitter-lite
const client = new Twitter({
  consumer_key: TWITTER_CONSUMER_KEY,
  consumer_secret: TWITTER_CONSUMER_SECRET
})

const getRequestToken = async function (callback_url: string): Promise<TokenResponse> {
  return new Promise(function (resolve, reject) {
    client
    .getRequestToken(TWITTER_CALLBACK_URL)
    .then((res: TokenResponse) => {
      resolve(res)
    })
    .catch(err => reject(err))
  })
}

const getAccessToken = async function (oauth_token: string, oauth_verifier: string): Promise<AccessTokenResponse> {
  // return: { oauth_token, oauth_token_secret, user_id, screen_name }
  return new Promise(function (resolve, reject) {
    client
    .getAccessToken({
      oauth_verifier: oauth_verifier,
      oauth_token: oauth_token
    })
    .then(res => resolve(res))
    .catch(res => reject(res));
  })
}

///

const authorize = async function () {
  if (!TWITTER_CONSUMER_KEY || !TWITTER_CONSUMER_SECRET || !TWITTER_CALLBACK_URL) {
    throw new Error('Write parameter in .env');
  }

  // get request token
  const request = await getRequestToken(TWITTER_CALLBACK_URL)
  if (request.oauth_callback_confirmed === 'false') {
    throw new Error('OAuth failure')
  }

  const oauthUrl = 'https://api.twitter.com/oauth/authenticate?oauth_token=' + request.oauth_token
  console.log(oauthUrl)

  while (true) {
    const mes = chalk.green('上記のurlで認証した後、遷移先のurlを貼り付けてください。(stop: ctrl + c)')
    const callbackUrl = await Terminal.prompt(mes)

    try {
      // parse
      const url = new URL(callbackUrl)
      const params = url.searchParams
      const oauth_token = params.get('oauth_token')
      const oauth_verifier = params.get('oauth_verifier')
      if (!oauth_token || !oauth_verifier) {
        throw new Error('Invalid URL: ' + callbackUrl)
      }

      // get access token
      const access = await getAccessToken(oauth_token, oauth_verifier)

      console.log('screen_name:', access.screen_name)
      console.log('access_token:', access.oauth_token)
      console.log('access_token_secret:', access.oauth_token_secret)

      return
    } catch (err) {
      const json = JSON.stringify(err)
      console.error(chalk.red(json))
    }
  }
}

authorize()
  .catch(err => {
    const json = JSON.stringify(err)
    console.error(chalk.red(json))
  })
  .finally(() => {
    process.exit(0)
  })
