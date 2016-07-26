import React from 'react';

import NavbarLayout from '../navbar/NavbarLayout.jsx';

export default class AppLayout extends React.Component {
  render() {
    return (
      <div>
        <NavbarLayout />
        { this.props.children }
      </div>
    );
  }
}