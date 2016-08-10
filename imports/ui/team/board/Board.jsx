import React from 'react';

export default class Board extends React.Component {
  render() {
    return (
      <div className='board-container'>
        <div className='sub-header'>
          <div className="col-xs-6">
            <h4 className="title col-xs-4">BoardName</h4>
            <h4 className="members col-xs-8">Miembros:</h4>
          </div>
          <div className="col-xs-6">
            <span><img src="/img/sidebar/messages.svg" width="28px" className="message-icon" /></span>
          </div>
        </div>
        <div>{ /* main board */ }</div>
      </div>
    );
  }
}

Board.propTypes = {
  
};
