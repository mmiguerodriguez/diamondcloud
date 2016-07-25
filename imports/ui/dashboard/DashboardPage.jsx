import { Meteor } from 'meteor/meteor';
import React from 'react';

import DashboardLayout from './DashboardLayout.jsx';

export default class Dashboard extends React.Component {
  constructor(){
    super();
    Meteor.subscribe('teams.dashboard');
  }
  render() {
    return (<DashboardLayout teamsCount={3} />);
  }
}
