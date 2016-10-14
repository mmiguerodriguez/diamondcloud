import React        from 'react';

import NavbarLayout from '../navbar/NavbarLayout.jsx';

export default class AppLayout extends React.Component {
  render() {
    return (
      <div>
        <NavbarLayout
          path={ this.props.location.pathname }
          user={ this.props.user }
        />
        { 
          React.cloneElement(this.props.children, { 
            ...this.props 
          })
        }
      </div>
    );
  }
}

AppLayout.propTypes = {
  user: React.PropTypes.object,
};
