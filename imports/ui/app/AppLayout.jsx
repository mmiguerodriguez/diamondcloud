import { Meteor }   from 'meteor/meteor';

import React        from 'react';

import NavbarLayout from '../navbar/NavbarLayout.jsx';
import Footer       from '../footer/Footer.jsx';

export default class AppLayout extends React.Component {
  render() {
    return (
      <div>
        <NavbarLayout
          path={ this.props.location.pathname }
          user={ this.props.user }
        />
        { this.props.children }
        { /*
          this.props.location.pathname.indexOf('/team') === -1 || this.props.location.pathname.indexOf('/') === -1 ? (
            <Footer />
          ) : ( null )
          */
        }
      </div>
    );
  }
}

AppLayout.propTypes = {
  user: React.PropTypes.object,
};
