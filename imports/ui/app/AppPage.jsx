import React     from 'react';

import AppLayout from './AppLayout';

export default class AppPage extends React.Component {
  render() {
    if (this.props.user === undefined) {
      return (null);
    }

    return (
      <AppLayout {...this.props} />
    );
  }
}

AppPage.propTypes = {
  user: React.PropTypes.object,
};
