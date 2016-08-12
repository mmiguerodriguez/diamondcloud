import React from 'react';

import Collapsible        from '../Collapsible.jsx';
import BoardsLayout       from './boards/BoardsLayout.jsx';
import DirectChatsLayout  from './direct-chats/DirectChatsLayout.jsx';

export default class ChatsCollapsible extends React.Component {
  render() {
    return (
      <Collapsible
        id={ 'chats-collapsible' }
        header={
          <div>
            <div  type="button"
                  className="close col-xs-2"
                  onClick={ this.props.toggleCollapsible.bind(null, 'chats') }>
              <img src="/img/close-modal-icon.svg" width="18px" />
            </div>
            <h3 className="col-xs-10 title">Mensajes</h3>
          </div>
        }
        body={
          <div>
            <BoardsLayout
              boards={ this.props.boards }
              getMessages={ this.props.getMessages } />
            <DirectChatsLayout
              directChats={ this.props.directChats }
              getMessages={ this.props.getMessages } />
          </div>
        }
        footer={
          <a className='btn btn-default footer-btn' role='button'>
            <img src='http://image.flaticon.com/icons/svg/60/60807.svg' width="32px" />
          </a>
        }
      />
    );
  }
}

ChatsCollapsible.propTypes = {
  boards: React.PropTypes.array.isRequired,
  directChats: React.PropTypes.array.isRequired,
  toggleCollapsible: React.PropTypes.func.isRequired,
  getMessages: React.PropTypes.func.isRequired,
};
