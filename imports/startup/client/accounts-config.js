import { Accounts } from 'meteor/accounts-base';
import { browserHistory } from 'react-router';

Accounts.onLogin(() => {
  let path;
  browserHistory.listen((e) => {
    path = e.pathname;
  });

  if(path === '/') {
    if(!Meteor.user()) {
      browserHistory.push('/dashboard');
    }
  }
});

Accounts.ui.config({
  requestPermissions: {
    google: [
      'https://www.googleapis.com/auth/drive', //View and manage the files in your Google Drive
      'https://www.googleapis.com/auth/drive.metadata', //View and manage metadata of files in your Google Drive
      'https://www.googleapis.com/auth/drive.appdata', //View and manage its own configuration data in your Google Drive
      'https://www.googleapis.com/auth/drive.file', //View and manage Google Drive files and folders that you have opened or created with this app
    ]
  },
  forceApprovalPrompt: {
    google: true
  },
});
