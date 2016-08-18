import React        from 'react';

import Message      from './message/Message.jsx';

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
  }
  render() {
    if (this.state.position === 'minimized') {
      return (
        <div className='chat minimized'>
          <p  className='col-xs-10 chat-text'
              onClick={ this.togglePosition.bind(this, 'medium') }>
            <b>{ this.getName() }</b>
          </p>
          <div  className='col-xs-2 chat-image'
                onClick={ this.props.removeChat.bind(this, this.state.chatType) }>
            <img  className='close-image'
                  src='/img/chat/close.svg'
                  width='16px' />
          </div>
        </div>
      );
    } else if (this.state.position === 'medium') {
      return (
        <div className='chat medium'>
          <div className='chat-header'>
            <p  className='col-xs-10 chat-text'
                onClick={ this.togglePosition.bind(this, 'minimized') }>
                <b>{ this.getName() }</b>
            </p>
            <div  className='col-xs-2 chat-image'
                  onClick={ this.togglePosition.bind(this, 'maximized') }>
              <img  className='maximize-image'
                    src='/img/chat/maximize.svg'
                    width='16px' />
            </div>
          </div>
          <div className='chat-body' ref='chat_body'>
            { this.renderMessages() }
          </div>
          <div className='chat-footer col-xs-12'>
            <input
              value={ this.state.message }
              className='form-control message-input'
              type='text'
              placeholder='Escriba el mensaje'
              onKeyDown={ this.handleKey.bind(this) }
              onChange={ this.changeText.bind(this) }  />
          </div>
        </div>
      );
    } else if (this.state.position === 'maximized') {
      return (
        <div className='chat maximized'>
          <div className='chat-header'>
            <p className='col-xs-10 chat-text'>{ this.getName() }</p>
            <div  className='col-xs-2 chat-image'
                  onClick={ this.togglePosition.bind(this, 'medium') }>
              <img  className='exit-maximize-image'
                    src='http://image.flaticon.com/icons/svg/60/60801.svg'
                    width='16px' />
            </div>
          </div>
          <div className='chat-body' ref='chat_body'>
            { this.renderMessages() }
          </div>
          <div className='chat-footer'>
            <div className='col-xs-10'>
              <input
                value={ this.state.message }
                className='form-control'
                type='text'
                placeholder='Escriba el mensaje'
                onKeyDown={ this.handleKey.bind(this) }
                onChange={ this.changeText.bind(this) } />
            </div>
            <div  className='send-message col-xs-2'
                  onClick={ this.sendMessage.bind(this) }>
              <img src='http://image0.flaticon.com/icons/svg/60/60525.svg' width='24px'/>
            </div>
          </div>
        </div>
      );
    } else {
      return ( null );
    }
  }
  componentWillMount() {
    let type;
    if(this.props.chat.boardId) {
      type = { boardId: this.props.chat.boardId };
    } else if(this.props.chat.directChatId) {
      type = { directChatId: this.props.chat.directChatId };
    }

    this.setState({
      chatType: type,
    });
  }
  componentDidUpdate(prevProps, prevState) {
    // Scroll to bottom if a new message is sent or received
    if(this.props.chat.messages.length > prevProps.chat.messages.length) {
      let chat_body = this.refs.chat_body;
      if(chat_body !== null && chat_body !== undefined) {
        let e = $(chat_body);
        e.scrollTop(e.prop("scrollHeight"));
      }
    }
  }

  handleKey(event){
    if(event.which === 13) {
      this.sendMessage();
    } else if(event.which === 27) {
      this.props.removeChat(this.state.chatType);
      // this.togglePosition('minimized');
    }
  }
  changeText(event) {
    this.setState({
      message: event.target.value,
    });
  }
  togglePosition(position) {
    this.setState({
      position: position,
    });
  }
  sendMessage() {
    let text = this.state.message;
    let obj = {
      type: 'text',
      content: text,
      createdAt: new Date().getTime(),
    };

    if(this.props.chat.directChatId) {
      obj.directChatId = this.props.chat.directChatId;
    } else if(this.props.chat.boardId) {
      obj.boardId = this.props.chat.boardId;
    }

    if(text != '') {
      Meteor.call('Messages.methods.send', obj, (error, response) => {
        if(error) {
          throw new Meteor.Error(error);
        } else {
          // Message sent correctly
        }
      });
    }

    this.setState({
      message: '',
    });
  }
  renderMessages() {
    let arr = [];

    this.props.chat.messages.map((message) => {
      let isSender = message.senderId === Meteor.userId();
      arr.push(
        <Message
          key={ message._id }
          message={ message }
          isSender={ isSender }
          position={ this.state.position } />);
    });

    return arr;
  }
  getName() {
    let name = '';
    if(this.props.chat.boardId) {
      let board = this.props.boards.find((_board) => {
        return _board._id === this.props.chat.boardId;
      });

      name = board.name;
    } else if(this.props.chat.directChatId) {
      let directChat = this.props.directChats.find((_directChat) => {
        return _directChat._id === this.props.chat.directChatId;
      });

      directChat.users.map((user) => {
        if(user._id !== Meteor.userId()) {
          name = Meteor.users.findOne(user._id).profile.name;
        }
      });
    }
    return name;
  }
}

ChatLayout.propTypes = {
  chat: React.PropTypes.object.isRequired,
  users: React.PropTypes.array.isRequired,
  position: React.PropTypes.string.isRequired,
  removeChat: React.PropTypes.func.isRequired,
};
