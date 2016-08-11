import React from 'react';

export default class Board extends React.Component {
  render() {
    return (
      <div onClick={ this.props.getMessages.bind(null, { boardId: this.props.board._id })}>
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
}

Board.propTypes = {
  board: React.PropTypes.object.isRequired,
  getMessages: React.PropTypes.func.isRequired,
};
