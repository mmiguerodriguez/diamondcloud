import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import React from 'react';

import { Teams } from '../../api/teams/teams.js';

import DashboardLayout from './DashboardLayout.jsx';

export default class Dashboard extends React.Component {
  render() {
    if (this.props.loading) {
      return null;
    } else {
      return (<DashboardLayout teams={ this.props.teams } />);
    }
  }
}

export default DashboardPageContainer = createContainer(() => {
  const teamsHandle = Meteor.subscribe('teams.dashboard');
  const loading = !teamsHandle.ready();

  return {
    loading,
    teams: Teams.find().fetch(),
  };
}, Dashboard);