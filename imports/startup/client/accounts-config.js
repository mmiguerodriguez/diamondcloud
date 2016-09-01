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
