const electron = require('electron');
const querystring = require('querystring');
const url = require('url');

const BrowserWindow = electron.BrowserWindow || electron.remote.BrowserWindow;

const getAccessToken = context => {
  const params = {
    response_type: 'code',
    redirect_uri: 'http://localhost',
    client_id: '0jy7cyn2gmxckry'
  };

  return new Promise((resolve, reject) => {
    let gotCode = false;

    const authWindow = new BrowserWindow({
      'use-content-size': true,
      alwaysOnTop: true,
      autoHideMenuBar: true,
      webPreferences: {
        nodeIntegration: false
      }
    });

    authWindow.loadURL('https://www.dropbox.com/oauth2/authorize?' + querystring.stringify(params));

    authWindow.on('closed', () => {
      if (!gotCode) {
        reject(new Error('canceled'));
      }
    });

    const getCode = redirectUrl => {
      const {code, error} = url.parse(redirectUrl, true).query;

      if (error !== undefined) {
        reject(error);
        authWindow.destroy();
      } else if(code) {
        gotCode = true;
        context.request(`https://kap-dropbox.now.sh/token?code=${code}`)
          .then(response => resolve(JSON.parse(response.body).access_token))
          .catch(error => reject(JSON.parse(error.response.body)));

        authWindow.destroy();
      }
    }

    authWindow.webContents.on('did-get-redirect-request', (event, oldUrl, newUrl) => {
      getCode(newUrl);
    });
  });
}

module.exports = getAccessToken;
