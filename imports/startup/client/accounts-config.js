import { Accounts } from 'meteor/accounts-base';
import { browserHistory } from 'react-router';

Accounts.onLogin(() => {
  let path;
  browserHistory.listen((e) => {
      path = e.pathname;
  });

  if(path == '/') {
    browserHistory.push('/dashboard');
  }
});
