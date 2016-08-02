import { Accounts } from 'meteor/accounts-base';
import { browserHistory } from 'react-router';

Accounts.onLogin(() => {
  browserHistory.push('/dashboard');
});
