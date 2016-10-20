import { Meteor }         from 'meteor/meteor';
import { Accounts }       from 'meteor/accounts-base';
import { browserHistory } from 'react-router';

if (Meteor.isClient) {
  /**
   * Sets the startup config for the accounts-ui package
   * Config so we request Google Drive data to the user
   *
   * drive: View and manage the files in Google Drive.
   * drive.metadata: View and manage metadata of files in your Google Drive.
   * drive.appdata: View and manage its own configuration data in your
   *                Google Drive.
   * drive.file: View and manage Google Drive files and folders that
   *             you have opened or created with this app.
   * userinfo.email: View user email.
   * userinfo.profile: View user basic profile.
   *
   * forceApprovalPrompt: User can't deny from providing the information.
   */
  Accounts.ui.config({
    requestPermissions: {
      google: [
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/drive.metadata',
        'https://www.googleapis.com/auth/drive.appdata',
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
      ],
    },
    requestOfflineToken: {
      google: true,
    },
    forceApprovalPrompt: {
      google: true,
    },
  });

  /**
   * Client side callback when users logs in.
   *
   * We are using this to insert the first
   * team user and set it as 'sistemas'
   * hierarchy.
   */
  Accounts.onLogin(() => {
    let path;
    browserHistory.listen((e) => {
      path = e.pathname;
    });

    if (path === '/carlosydario' || path === '/diamond') {
      path = path.substr(1, path.length - 1);

      Meteor.call('Accounts.methods.insertFirstUser', { url: path }, (error, result) => {
        if (error) {
          throw new Meteor.Error(error);
        } else {
          browserHistory.push(`/team/${path}`);
        }
      });
    }
  });
}
