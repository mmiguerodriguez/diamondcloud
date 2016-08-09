import React from 'react';

export default class Board extends React.Component {
  render() {
    return (
      <div className='board-container'>
        <div className='sub-header'>
          <h3 className="title">BoardName</h3>
        </div>
        <div>{ /* main board */ }</div>
      </div>
    );
  }
}

Board.propTypes = {
  
};
