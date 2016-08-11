import React from 'react';

export default class Board extends React.Component {
  render() {
    // define this classes on this boards.scss or use them globally?
    return (
      <div className="" onClick={ this.props.getMessages.bind(null, { boardId: this.props.board._id }) }>
        <h4 className="">{ this.props.board.name }</h4>
      </div>
    );
  }
}

Board.propTypes = {
  board: React.PropTypes.object.isRequired,
  getMessages: React.PropTypes.func.isRequired,
};
