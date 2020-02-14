import {NowRequest, NowResponse} from '@now/node';

const got = require('got');
const FormData = require('form-data');

export default (req: NowRequest, res: NowResponse) => {
    const {code} = req.query;

  if (code) {
    const form = new FormData();
    form.append('code', code);
    form.append('grant_type', 'authorization_code');
    form.append('client_id', process.env.CLIENT_ID);
    form.append('client_secret', process.env.CLIENT_SECRET);
    form.append('redirect_uri', process.env.REDIRECT_URI);

    got('https://api.dropboxapi.com/oauth2/token', {method: 'post', body: form})
      .then(response => {
        res.writeHead(302, {'Location': `kap://plugins/kap-dropbox/${JSON.parse(response.body).access_token}`})
        res.end();
      }).catch(error => {
        res.send(error.response.body);
      });
  } else {
    res.json({error: 'No code provided'});
  }
}