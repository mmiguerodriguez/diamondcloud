import { CLIENT_ID } from './driveApi';

/**
 * Check if current user has authorized this application.
 */
const checkAuth = (callback = () => {}, i = 0) => {
  if (i < 5) {
    if (gapi.auth) {
      const SCOPES = [
        'https://www.googleapis.com/auth/drive',
      ];

      gapi.auth.authorize({
        client_id: CLIENT_ID,
        scope: SCOPES.join(' '),
        immediate: true,
      }, (authResult) => {
        if (authResult) {
          gapi.client.load('drive', 'v3', callback);
        } else {
          setTimeout(() => {
            checkAuth(callback, i + 1);
          }, 100);
        }
      });
    } else {
      setTimeout(() => {
        checkAuth(callback, i + 1);
      }, 100);
    }
  } else {
    console.error('Google API did not load properly. Reload or try later.');
  }
};

export default checkAuth;
