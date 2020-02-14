'use strict';
const fs = require('fs');
const getAccessToken = require('./auth');

const action = async context => {
  const uploadEndpoint = 'https://content.dropboxapi.com/2/files/upload';
  const linkEndpoint = 'https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings';

  if (!context.config.has('accessToken')) {
    context.setProgress('Authorizing…');
    try {
      context.config.set('accessToken', await getAccessToken(context));
    } catch (error) {
      if (error.message === 'canceled') {
        context.cancel();
      } else {
        throw new Error('Authentication failed');
      }
    }
  }

  const accessToken = context.config.get('accessToken');

  try {
    const filePath = await context.filePath();

    context.setProgress('Uploading…');
    const body = fs.readFileSync(filePath);

    const {path = '', autorename, mute} = context.config.store;

    const dropboxParams = {
      path: `${path}/${context.defaultFileName}`,
      mode: {'.tag': 'add'},
      autorename,
      mute
    };

    const fileResponse = await context.request(uploadEndpoint, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/octet-stream',
        'Dropbox-API-Arg': JSON.stringify(dropboxParams)
      },
      body
    });

    const pathLower = JSON.parse(fileResponse.body).path_lower;

    context.setProgress('Getting link…');
    const linkResponse = await context.request(linkEndpoint, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({path: pathLower})
    });

    const link = JSON.parse(linkResponse.body).url;

    context.copyToClipboard(link);
    context.notify('A public link to the file has been copied to the clipboard');
  } catch (error) {
    if (error.statusMessage.startsWith('path/conflict/')) {
      throw new Error('A file with that name already exists');
    }
  }
};

const dropbox = {
  title: 'Upload to Dropbox',
  formats: ['gif', 'mp4', 'webm', 'apng'],
  action,
  config: {
    path: {
      title: 'Directory to save the files in',
      type: 'string',
      pattern: '^\/(.|[\r\n])*[^\/]$'
    },
    autorename: {
      title: 'Automatically rename to avoid conflicts',
      type: 'boolean',
      default: true,
    },
    mute: {
      title: 'Mute Dropbox desktop notification for the upload',
      type: 'boolean',
      default: false,
    }
  }
};

exports.shareServices = [dropbox];
