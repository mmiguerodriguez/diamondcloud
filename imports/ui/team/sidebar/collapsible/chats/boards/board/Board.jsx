import React from 'react';

export default class Board extends React.Component {
  render() {
    return (
      <div
        className="row row-fixed-margin"
        onClick={this.props.addChat.bind(null, { boardId: this.props.board._id })}>
        <div className="col-xs-2 img-fixed-margin fixed-padding">
          <img
            className="img-circle"
            src="/img/board-chat.svg"
            width="22px" />
        </div>
        <div className="col-xs-8">
          <h4 className="truncate">{this.props.board.name}</h4>
        </div>
        {
          this.props.notifications > 0 ? (
            <div className="col-xs-2 badge-fixed-margin">
              <div className="messages-badge img-circle">{this.props.notifications}</div>
            </div>
          ) : (null)
        }
      </div>
    );
  }
}

Board.propTypes = {
  board: React.PropTypes.object.isRequired,
  notifications: React.PropTypes.number.isRequired,
  addChat: React.PropTypes.func.isRequired,
};
