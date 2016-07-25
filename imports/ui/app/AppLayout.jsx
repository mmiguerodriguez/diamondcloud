import React from 'react';

import NavbarLayout from '../navbar/NavbarLayout.jsx';
import DashboardLayout from '../dashboard/DashboardLayout.jsx';

export default class AppLayout extends React.Component {
  render() {
    return (
      <div>
        <NavbarLayout />
        <DashboardLayout />
        { this.props.children }
      </div>
    );
  }
}