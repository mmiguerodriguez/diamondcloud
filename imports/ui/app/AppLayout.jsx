import React from 'react';

export default class AppLayout extends React.Component {
  render() {
    return (
      <div>
        <h1>App</h1>
        { this.props.children }
      </div>
    );
  }
}