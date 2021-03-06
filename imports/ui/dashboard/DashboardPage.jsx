import { Meteor }          from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Teams }           from '../../api/teams/teams.js';

import React               from 'react';

import DashboardLayout     from './DashboardLayout.jsx';

export default class Dashboard extends React.Component {
  render() {
    if (this.props.loading) {
      return ( null );
    }

    return (<DashboardLayout teams={ this.props.teams } />);
  }
}

export default DashboardPageContainer = createContainer(() => {
  const teamsHandle = Meteor.subscribe('teams.dashboard');
  const loading = !teamsHandle.ready();

  return {
    loading,
    teams: Teams.find({}, { sort: { name: -1 } }).fetch(),
  };
}, Dashboard);
