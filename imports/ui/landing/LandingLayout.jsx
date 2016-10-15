import React             from 'react';

import AccountsUIWrapper from '../accounts/AccountsUIWrapper.jsx';

export default class LandingLayout extends React.Component {
  render() {
    return (
      <div className='landing'>
        <div className='background'></div>
        <div className='items-container'>
          <img className='title' src='http://www.carlosydario.com/images/logo.jpg' />
          <AccountsUIWrapper />
        </div>
      </div>
    );
  }
}
