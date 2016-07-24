import React from 'react';

import NavbarLayout from '../navbar/NavbarLayout.jsx';

export default class AppLayout extends React.Component {
  render() {
    return (
      <div>
        <NavbarLayout />
        <h1>App</h1>
        { this.props.children }
      </div>
    );
  }
}