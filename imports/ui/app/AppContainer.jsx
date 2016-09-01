import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import AppLayout from './AppLayout.jsx';

export default class App extends React.Component {
  render() {
    if (this.props.user === undefined) {
      return ( null );
    }

    return (<AppLayout { ...this.props } />);
  }
}

export default AppContainer = createContainer(() => {
  const user = Meteor.user();
  return {
    user,
  };
}, App);
