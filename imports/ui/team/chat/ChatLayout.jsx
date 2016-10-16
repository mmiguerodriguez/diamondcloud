import React           from 'react';
import classNames      from 'classnames';

import Message         from './message/Message';

import { Boards }      from '../../../api/boards/boards';
import { DirectChats } from '../../../api/direct-chats/direct-chats';

export default class ChatLayout extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      chat: this.props.chat,
      position: this.props.position,
      message: '',
      chatType: {},
    };

    this.refs = {
      chat_body: null,
    };

    this.handleKey = this.handleKey.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  render() {
    const classes = classNames({
      hidden: this.props.hasMaximizedChats && this.state.position !== 'maximized',
    }, 'chat', 'hidden-xs', this.state.position);

    if (this.state.position === 'minimized') {
      return (
        <div className={classes}>
          <p
            className="col-xs-10 chat-text truncate"
            onClick={this.props.togglePosition.bind(null, this, this.state.position, 'medium')}
          >
            <b>{this.getName()}</b>
          </p>
          <div
            className="col-xs-2 chat-image"
            onClick={this.props.removeChat.bind(this, this.state.chatType)}
          >
            <div className="close-image chat-back-image" />
          </div>
        </div>
      );
    } else if (this.state.position === 'medium') {
      return (
        <div className={classes}>
          <div className="chat-header">
            <p
              className="col-xs-12 chat-text truncate"
              onClick={this.props.togglePosition.bind(null, this, this.state.position, 'minimized')}
            >
              <b>{this.getName()}</b>
            </p>
            { /* <div className="col-xs-2 chat-image" onClick={this.props.togglePosition.bind(null, this, this.state.position, 'maximized')}> <div className="maximize-image chat-back-image" /> </div> */ }
          </div>
          <div className="chat-body" ref="chat_body">
            {this.renderMessages()}
          </div>
          <div className="chat-footer col-xs-12">
            <input
              value={this.state.message}
              className="form-control message-input"
              type="text"
              placeholder="Escriba el mensaje"
              onKeyDown={this.handleKey}
              onChange={this.handleChange}
            />
          </div>
        </div>
      );
    } else if (this.state.position === 'maximized') {
      return (
        <div className={classes}>
          <div className="chat-header">
            <div className="col-xs-10 row chat-tabs">
              <div className="tab">
                <p
                  className="col-xs-10 chat-text truncate"
                  onClick={this.props.togglePosition.bind(null, this, this.state.position, 'minimized')}
                >
                  <b>{this.getName()}</b>
                </p>
                <div
                  className="col-xs-2 chat-image"
                  onClick={this.props.removeChat.bind(this, this.state.chatType)}
                >
                  <div className="close-image chat-back-image" />
                </div>
              </div>
            </div>
            <div
              className="col-xs-2 chat-image"
              onClick={this.props.togglePosition.bind(null, this, this.state.position, 'medium')}
            >
              <img
                className="exit-maximize-image"
                src='http://image.flaticon.com/icons/svg/60/60801.svg'
                width="16px"
              />
            </div>
          </div>
          <div className="chat-body container-fluid" ref="chat_body">
            {this.renderMessages()}
          </div>
          <div className="chat-footer">
            <input
              value={this.state.message}
              className="form-control"
              type="text"
              placeholder="Escriba el mensaje"
              onKeyDown={this.handleKey}
              onChange={this.handleChange}
            />
          </div>
        </div>
      );
    } else if (this.state.position === 'mobile') {
      return (
        <div className="chat mobile visible-xs-block">
          <div className="chat-header">
            <div
              className="chat-image-text chat-image truncate col-xs-12"
              onClick={this.props.removeChat.bind(this, this.state.chatType)}
            >
              <div className="chat-image">
                <div className="back-image chat-back-image" />
              </div>
              <b>{this.getName()}</b>
            </div>
          </div>
          <div className="chat-body" ref="chat_body">
            {this.renderMessages()}
          </div>
          <div className="chat-footer col-xs-12">
            <input
              value={this.state.message}
              className="form-control message-input"
              type="text"
              placeholder="Escriba el mensaje"
              onKeyDown={this.handleKey}
              onChange={this.handleChange}
            />
          </div>
        </div>
      );
    }

    return (null);
  }

  componentWillMount() {
    let type;
    if (this.props.chat.boardId) {
      type = { boardId: this.props.chat.boardId };
    } else if (this.props.chat.directChatId) {
      type = { directChatId: this.props.chat.directChatId };
    }

    this.setState({
      chatType: type,
    });
  }

  componentDidMount() {
    this.scrollDown();
  }

  sendMessage() {
    const self = this;

    let text = this.state.message;
    text = text.trim();

    const obj = {
      type: 'text',
      content: text,
      createdAt: new Date().getTime(),
    };

    if (this.props.chat.directChatId) {
      obj.directChatId = this.props.chat.directChatId;
    } else if (this.props.chat.boardId) {
      obj.boardId = this.props.chat.boardId;
    }

    if (text !== '' && /\S/.test(text)) {
      Meteor.call('Messages.methods.send', obj, (error, result) => {
        if (error) {
          self.props.toggleError({
            type: 'show',
            body: 'Hubo un error interno al crear el módulo',
          });
        }
      });
    }

    this.setState({
      message: '',
    });
  }

  renderMessages() {
    const scrollDown = this.scrollDown.bind(this);

    return this.props.chat.messages.map((message) => {
      const isSender = message.senderId === Meteor.userId();
      return (
        <Message
          key={message._id}
          message={message}
          isSender={isSender}
          scrollDown={scrollDown}
          position={this.state.position}
          toggleError={this.props.toggleError}
        />
      );
    });
  }

  getName() {
    if (this.props.chat.boardId) {
      const boardId = this.props.chat.boardId;

      return Boards.findOne(boardId).name;
    } else if (this.props.chat.directChatId) {
      const directChatId = this.props.chat.directChatId;
      const directChat = DirectChats.findOne(directChatId);

      return directChat.getUser().profile.name;
    }
  }

  scrollDown() {
    const chatBody = this.refs.chat_body;
    if (chatBody !== null && chatBody !== undefined) {
      let e = $(chatBody);
      e.scrollTop(e.prop("scrollHeight"));
    }
  }

  handleKey(event) {
    if (event.which === 13) {
      this.sendMessage();
    } else if (event.which === 27) {
      this.props.removeChat(this.state.chatType);
      // this.props.togglePosition('minimized');
    }
  }

  handleChange(event) {
    this.setState({
      message: event.target.value,
    });
  }
}

ChatLayout.propTypes = {
  chat: React.PropTypes.object.isRequired,
  users: React.PropTypes.array.isRequired,
  position: React.PropTypes.string.isRequired,
  hasMaximizedChats: React.PropTypes.bool.isRequired,
  boards: React.PropTypes.array.isRequired,
  directChats: React.PropTypes.array.isRequired,
  removeChat: React.PropTypes.func.isRequired,
  togglePosition: React.PropTypes.func.isRequired,
  toggleError: React.PropTypes.func.isRequired,
};
