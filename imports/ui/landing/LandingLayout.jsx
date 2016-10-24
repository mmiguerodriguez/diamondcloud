import React             from 'react';
import classNames        from 'classnames';

import AccountsUIWrapper from '../accounts/AccountsUIWrapper';

export default class LandingLayout extends React.Component {
  render() {
    const isCyD = this.props.location.pathname === '/carlosydario';
    const backgroundClass = classNames({
      diamond: !isCyD,
      cyd: isCyD,
    }, 'background');
    const logoSrc = classNames({
      '/img/logo.png': !isCyD,
      '/img/logo-cyd.jpg': isCyD,
    });

    return (
      <div className="landing">
        <div className={backgroundClass} />
        <div className="items-container">
          <img className="title" src={logoSrc} />
          <AccountsUIWrapper />
        </div>
      </div>
    );
  }
}

LandingLayout.propTypes = {
  location: React.PropTypes.object.isRequired,
};
