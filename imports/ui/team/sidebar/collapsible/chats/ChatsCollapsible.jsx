import React              from 'react';

import Collapsible        from '../Collapsible.jsx';
import BoardsLayout       from './boards/BoardsLayout.jsx';
import DirectChatsLayout  from './direct-chats/DirectChatsLayout.jsx';

export default class ChatsCollapsible extends React.Component {
  render() {
    return (
      <Collapsible
        id={'chats-collapsible'}
        header={
          <div>
            <div
              type="button"
              className="close col-xs-2"
              onClick={this.props.toggleCollapsible.bind(null, 'chats')}>
              <img src="/img/close-icon.svg" width="18px" />
            </div>
            <h3 className="col-xs-10 title">Mensajes</h3>
          </div>
        }
        body={
          <div>
            <BoardsLayout
              team={this.props.team}
              boards={this.props.boards}
              addChat={this.props.addChat}
            />
            <DirectChatsLayout
              team={this.props.team}
              users={this.props.users}
              directChats={this.props.directChats}
              addChat={this.props.addChat}
              createDirectChat={this.props.createDirectChat}
              openConfigTeamModal={this.props.openConfigTeamModal}
            />
          </div>
        }
        footer={
          <div></div>
        }
      />
    );
  }
}

ChatsCollapsible.propTypes = {
  team: React.PropTypes.object.isRequired,
  users: React.PropTypes.array.isRequired,
  boards: React.PropTypes.array.isRequired,
  toggleCollapsible: React.PropTypes.func.isRequired,
  addChat: React.PropTypes.func.isRequired,
  createDirectChat: React.PropTypes.func.isRequired,
  openConfigTeamModal: React.PropTypes.func.isRequired,
};
