import React       from 'react';

import Collapsible from '../Collapsible.jsx';
import Board       from './board/Board.jsx';

export default class BoardsCollapsible extends React.Component {
  render() {
    return (
      <Collapsible
        id={ 'boards-collapsible' }
        header={
          <div>
            <div  type='button'
                  className='close col-xs-2'
                  onClick={ this.props.toggleCollapsible.bind(null, 'boards') }>
              <img src='/img/close-modal-icon.svg' width='18px' />
            </div>
            <h3 className='col-xs-10 title'>Boards</h3>
          </div>
        }
        body={
          this.renderBoards()
        }
        footer={
          this.props.owner ? (
            <a className='btn btn-default footer-btn' role='button' onClick={ this.props.openCreateBoardModal }>
              CREAR BOARD
            </a>
          ) : ( <div></div> )
        }
      />
    );
  }

  renderBoards() {
    let arr = [];

    this.props.boards.map((board) => {
      arr.push(
        <Board
          key={ board._id }
          board={ board }
          toggleCollapsible={ this.props.toggleCollapsible }
          changeBoard={ this.props.changeBoard }/>
      );
    });

    return arr;
  }
}

BoardsCollapsible.propTypes = {
  boards: React.PropTypes.array.isRequired,
  team: React.PropTypes.object.isRequired,
  owner: React.PropTypes.bool.isRequired,
  toggleCollapsible: React.PropTypes.func.isRequired,
  changeBoard: React.PropTypes.func.isRequired,
  openCreateBoardModal: React.PropTypes.func.isRequired,
};
