import React from 'react';

export default class Board extends React.Component {
  constructor(props) {
    super(props);

    this.setBoard = this.setBoard.bind(this);
  }

  setBoard() {
    this.props.toggleCollapsible('boards');
    this.props.changeBoard(this.props.board._id);
  }

  render() {
    return (
      <div
        className="board-item-container"
        data-ripple="rgba(0,0,0, 0.3)"
        >
        <div
          className="board-item col-xs-10 row"
          onClick={this.setBoard}>
          <h4 className="board-name">{this.props.board.name}</h4>
        </div>
        {
          this.props.isAdmin ? (
            <div
              className="col-xs-2"
              onClick={this.props.openBoardContextMenu.bind(null, this.props.board._id)}>
              <img
                className="img board-preview"
                src="/img/sidebar/vertical-ellipsis.svg"
                width="22px"
              />
            </div>
          ) : (null)
        }
      </div>
    );
  }
}

Board.propTypes = {
  board: React.PropTypes.object.isRequired,
  isAdmin: React.PropTypes.bool.isRequired,

  toggleCollapsible: React.PropTypes.func.isRequired,
  changeBoard: React.PropTypes.func.isRequired,
  openBoardContextMenu: React.PropTypes.func.isRequired,
};
