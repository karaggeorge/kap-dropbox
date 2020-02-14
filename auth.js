const {shell} = require('electron');
const querystring = require('querystring');

const getAccessToken = context => {
  const params = {
    response_type: 'code',
    redirect_uri: 'https://kap-dropbox.now.sh/api/redirect',
    client_id: 'cwkfh4020sgka9s'
  };

  shell.openExternal(`https://www.dropbox.com/oauth2/authorize?${querystring.stringify(params)}`);

  return context.waitForDeepLink();
}

module.exports = getAccessToken;
