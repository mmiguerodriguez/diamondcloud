import React from 'react';

import AppLayout from './AppLayout.jsx';

export default class App extends React.Component {
  render() {
    return (<AppLayout { ...this.props } />);
  }
}
