import React from 'react';

import AccountsUIWrapper from '../accounts/AccountsUIWrapper.jsx';

export default class LandingLayout extends React.Component {
  render() {
    return (
      <div>
        <h2>Landing</h2>
        <AccountsUIWrapper />
      </div>
    );
  }
}
