import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import React from 'react';

import { Teams } from '../../api/teams/teams.js';
import { Boards } from '../../api/boards/boards.js';
import { DirectChats } from '../../api/direct-chats/direct-chats.js';

import TeamLayout from './TeamLayout.jsx';

export default class Team extends React.Component {
  render() {
    const { team, boards, directChats, loading } = this.props;

    if(loading) {
      return null;
    } else {
      return (
        <TeamLayout
          team={ team }
          boards={ boards }
          directChats={ directChats }
        />
      );
    }
  }
}

export default TeamPageContainer = createContainer(({ params }) => {
  const { teamId } = params;
  const teamHandle = Meteor.subscribe('teams.team', teamId);
  const loading = !teamHandle.ready();

  return {
    loading,
    team: Teams.findOne(),
    boards: Boards.find().fetch(),
    directChats: DirectChats.find().fetch(),
  };
}, Team);
