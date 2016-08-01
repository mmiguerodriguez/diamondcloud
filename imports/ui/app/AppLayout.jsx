import { Meteor } from 'meteor/meteor';
import React from 'react';

import NavbarLayout from '../navbar/NavbarLayout.jsx';
import Footer from '../footer/Footer.jsx';

export default class AppLayout extends React.Component {
  render() {
    return (
      <div>
        <NavbarLayout
          path={ this.props.location.pathname }
          user={ this.props.user }
        />
        { this.props.children }
        <Footer />
      </div>
    );
  }
}

AppLayout.propTypes = {
  user: React.PropTypes.object,
}
