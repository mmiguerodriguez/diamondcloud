import { Meteor } from 'meteor/meteor';
import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import { Teams } from '../../api/teams/teams.js';

import DashboardLayout from './DashboardLayout.jsx';

export default class Dashboard extends React.Component {
  constructor() {
    super();
    Meteor.subscribe('teams.dashboard');
    

  }
  render() {
    return (<DashboardLayout teams={ this.props.teams } />);
  }
}

export default createContainer(() => {
  Meteor.subscribe('teams.dashboard');

  return {
    teams: Teams.find({}).fetch(),
  };
}, Dashboard);
