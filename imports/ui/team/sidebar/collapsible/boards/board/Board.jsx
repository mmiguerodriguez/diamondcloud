import React from 'react';

export default class Board extends React.Component {
  render() {
    return (
      <div>Board item</div>
    );
  }
}

Board.propTypes = {
  board: React.PropTypes.object.isRequired,
};
