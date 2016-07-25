import React from 'react';

import DashboardLayout from './DashboardLayout.jsx';

export default class Dashboard extends React.Component {
  render() {
    return (<DashboardLayout teamsCount={3} />);
  }
}
