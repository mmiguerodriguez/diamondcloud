import React from 'react';

export default class Board extends React.Component {
  render() {
    return (
      <div className='board-item-container' onClick={ this.setBoard.bind(this) }>
        <div className="board-item col-xs-10 row">
          <h4 className="board-name">{ this.props.board.name }</h4>
        </div>
        <div className="col-xs-2">
          <img  className="img board-preview"
                src="/img/sidebar/vertical-ellipsis.svg"
                width="22px" />
        </div>
      </div>
    );
  }
  setBoard() {
    this.props.toggleCollapsible('boards');
    this.props.changeBoard(this.props.board._id);
  }
}

Board.propTypes = {
  board: React.PropTypes.object.isRequired,
  toggleCollapsible: React.PropTypes.func.isRequired,
  changeBoard: React.PropTypes.func.isRequired,
};
