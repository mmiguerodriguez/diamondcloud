import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import React from 'react';

import { Teams } from '../../api/teams/teams.js';
import { Boards } from '../../api/boards/boards.js';
import { DirectChats } from '../../api/direct-chats/direct-chats.js';

import TeamLayout from './TeamLayout.jsx';

export default class Team extends React.Component {
  render() {
    return (
      <TeamLayout
        team={ this.props.team }
        boards={ this.props.boards }
        directChats={ this.props.directChats }
      />
    );
  }
}

export default TeamPageContainer = createContainer(({ params }) => {
  const { teamId } = params;
  Meteor.subscribe('teams.team', teamId);

  return {
    team: Teams.findOne(),
    boards: Boards.find().fetch(),
    directChats: DirectChats.find().fetch(),
  };
}, Team);
