import { Meteor }  from 'meteor/meteor';
import React       from 'react';

import Collapsible from '../Collapsible';
import Board       from './board/Board';

export default class BoardsCollapsible extends React.Component {
  render() {
    return (
      <Collapsible
        id={'boards-collapsible'}
        header={
          <div>
            <div
              type="button"
              className="close col-xs-2"
              onClick={this.props.toggleCollapsible.bind(null, 'boards')}
            >
              <img src="/img/close-icon.svg" width="18px" />
            </div>
            <h3 className="col-xs-10 title">Pizarrones</h3>
          </div>
        }
        body={
          this.renderBoards()
        }
        footer={
          this.props.isAdmin ? (
            <a
              className="btn btn-default footer-btn"
              role="button"
              onClick={this.props.openCreateBoardModal}
            >
              CREAR PIZARRÓN
            </a>
          ) : (<div />)
        }
      />
    );
  }
  renderBoards() {
    const boards = [];
    const isDirector =
      this.props.team.userIsCertainHierarchy(Meteor.user().email(), 'director creativo') ||
      this.props.team.userIsCertainHierarchy(Meteor.user().email(), 'director de cuentas');

    this.props.boards.forEach((board) => {
      const _board = (
        <Board
          key={board._id}
          board={board}
          isAdmin={this.props.isAdmin}
          toggleCollapsible={this.props.toggleCollapsible}
          changeBoard={this.props.changeBoard}
          openBoardContextMenu={this.props.openBoardContextMenu}
        />
      );

      if (isDirector) {
        if ((board.type === 'creativos' && board.visibleForDirectors) || (board.type !== 'creativos' && board.type !== 'medios')) {
          boards.push(_board);
        }
      } else {
        boards.push(_board);
      }
    });

    return boards;
  }
}

BoardsCollapsible.propTypes = {
  boards: React.PropTypes.array.isRequired,
  team: React.PropTypes.object.isRequired,
  isAdmin: React.PropTypes.bool.isRequired,

  toggleCollapsible: React.PropTypes.func.isRequired,
  changeBoard: React.PropTypes.func.isRequired,
  openCreateBoardModal: React.PropTypes.func.isRequired,
  openBoardContextMenu: React.PropTypes.func.isRequired,
};
