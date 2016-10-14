import { Meteor }          from 'meteor/meteor';

import React               from 'react';
import { browserHistory }  from 'react-router';

import LandingLayout       from './LandingLayout.jsx';

export default class Landing extends React.Component {
  render() {
    return (
      <LandingLayout />
    );
  }
  componentWillMount() {
    if (Meteor.user()) {
      if (this.props.location.pathname.indexOf('carlosydario') > -1) {
        browserHistory.push('/team/idCarlos');
      } else {
        browserHistory.push('/team/idDiamond');
      }
    }
  }
}
