import React from 'react';

export default class Board extends React.Component {
  render() {
    return (
      <div className='board-item-container'>
        <div
          className='board-item col-xs-10 row'
          onClick={ this.setBoard.bind(this) }>
          <h4 className='board-name'>{ this.props.board.name }</h4>
        </div>
        {
          this.props.owner ? (
            <div
              className='col-xs-2'
              onClick={ this.props.openBoardContextMenu.bind(null, this.props.board._id) }>
              <img
                className='img board-preview'
                src='/img/sidebar/vertical-ellipsis.svg'
                width='22px' />
            </div>
          ) : ( null )
        }
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
  owner: React.PropTypes.bool.isRequired,

  toggleCollapsible: React.PropTypes.func.isRequired,
  changeBoard: React.PropTypes.func.isRequired,
  openBoardContextMenu: React.PropTypes.func.isRequired,
};
