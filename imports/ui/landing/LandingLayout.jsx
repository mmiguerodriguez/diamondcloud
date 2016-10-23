import React             from 'react';

import AccountsUIWrapper from '../accounts/AccountsUIWrapper';

export default class LandingLayout extends React.Component {
  render() {
    return (
      <div className="landing">
        <div className="background" />
        <div className="items-container">
          <img className="title" src="/img/logo-cyd.jpg" />
          <AccountsUIWrapper />
        </div>
      </div>
    );
  }
}
