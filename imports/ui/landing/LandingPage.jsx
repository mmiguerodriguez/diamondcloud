import { Meteor }          from 'meteor/meteor';

import React               from 'react';
import { browserHistory }  from 'react-router';

import LandingLayout       from './LandingLayout.jsx';

export default class Landing extends React.Component {
  render() {
    console.log(this.props.router)
    return (
      <LandingLayout />
    );
  }
  componentWillMount() {
    if (Meteor.user()) {
      if (this.props.location.pathname.indexOf('carlosydario')) {
        browserHistory.push('/team/elIdDelEquipoCarlosYDario');
      } else {
        browserHistory.push('/team/elIdDelEquipoDiamond');
      }
    }
  }
}
