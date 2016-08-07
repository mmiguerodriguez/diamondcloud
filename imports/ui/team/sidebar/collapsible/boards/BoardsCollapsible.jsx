import React from 'react';

import Collapsible from '../Collapsible.jsx';
import Board       from './board/Board.jsx';

export default class BoardsCollapsible extends React.Component {
  render() {
    return (
      <Collapsible
        id={ 'boards-collapsible' }
        header={
          <div>
            <div  type="button"
                  className="close col-md-2"
                  onClick={ this.props.toggleCollapsible.bind(null, 'boards') }>
              <img src="/img/close-modal-icon.svg" width="18px" />
            </div>
            <h3 className="col-md-10 title">Boards</h3>
          </div>
        }
        body={
          this.renderBoards()
        }
      />
    );
  }

  renderBoards() {
    let arr = [];
    return arr;
  }
}

BoardsCollapsible.propTypes = {
  boards: React.PropTypes.array.isRequired,
  toggleCollapsible: React.PropTypes.func.isRequired,
};
