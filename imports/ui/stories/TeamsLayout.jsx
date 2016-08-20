import React from 'react';
import { storiesOf, action } from '@kadira/storybook';

import TeamsLayout from '../dashboard/teams/TeamsLayout.jsx';

let createTeamModal = () => {
  $('#createTeamModal').modal('show');
};

let openConfigTeamModal = (team) => {
  $('#configTeamModal').modal('show');
};

storiesOf('TeamsLayout', module)
  .add('with teams', () => {
    let teams = [
      {
        _id: '1', name: 'Team 1', plan: 'free', users: [
          { email: 'mmiguerodriguez@gmail.com', permission: 'owner' },
          { email: 'ryanitzcovitz@gmail.com', permission: 'member '}
        ]
      },
      {
        _id: '2', name: 'Team 2', plan: 'premium', users: [
          { email: 'mmiguerodriguez@gmail.com', permission: 'owner' },
          { email: 'joelsobolmark@gmail.com', permission: 'member '},
          { email: 'ryanitzcovitz@gmail.com', permission: 'member '},
          { email: 'nico@bilinkis.com', permission: 'member '},
          { email: 'dylanfridman@gmail.com', permission: 'member '}
        ]
      },
      {
        _id: '3', name: 'Team 3', plan: 'premium', users: [
          { email: 'mmiguerodriguez@gmail.com', permission: 'owner' },
          { email: 'ryanitzcovitz@gmail.com', permission: 'member '}
        ]
      },
      {
        _id: '4', name: 'Team 4', plan: 'premium', users: [
          { email: 'mmiguerodriguez@gmail.com', permission: 'owner' },
          { email: 'ryanitzcovitz@gmail.com', permission: 'member '}
        ]
      },
      {
        _id: '5', name: 'Team 5', plan: 'free', users: [
          { email: 'mmiguerodriguez@gmail.com', permission: 'owner' },
          { email: 'ryanitzcovitz@gmail.com', permission: 'member '}
        ]
      }
    ];
    return (
      <TeamsLayout  hasTeams={ true }
                    teams={ teams }
                    openCreateTeamModal={ createTeamModal }
                    openConfigTeamModal={ openConfigTeamModal } />
    );
  })
  .add('with no teams', () => {
    let teams = [];
    return (
      <TeamsLayout  hasTeams= { false }
                    teams={ teams }
                    openCreateTeamModal={ createTeamModal }
                    openConfigTeamModal={ openConfigTeamModal } />
    );
  });
