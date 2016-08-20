import React        from 'react';

import Message      from './message/Message.jsx';

export default class ChatLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chat: this.props.chat,
      position: this.props.position,
      message: '',
    };
  }
  render() {
    if (this.state.position === 'minimized') {
      let obj;
      if(this.props.chat.boardId) {
        obj = { boardId: this.props.chat.boardId };
      } else if(this.props.chat.directChatId) {
        obj = { directChatId: this.props.chat.directChatId };
      }
      
      
      return (
        <div className='chat minimized'>
          <p  className='col-xs-10 chat-text' 
              onClick={ this.togglePosition.bind(this, 'medium') }>
            <b>User name / Board name</b>
          </p>
          <div  className='col-xs-2 chat-image' 
                onClick={ this.props.removeChat.bind(this, obj) }>
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
                <b>User name / Board name</b>
            </p>
            <div  className='col-xs-2 chat-image'
                  onClick={ this.togglePosition.bind(this, 'maximized') }>
              <img  className='maximize-image' 
                    src='/img/chat/maximize.svg' 
                    width='16px' />
            </div>
          </div>
          <div className='chat-body'>
            { this.renderMessages() }
          </div>
          <div className='chat-footer col-xs-12'>
            <input 
              value={ this.state.message } 
              className='form-control'
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
            <p className='col-xs-10 chat-text'>User name / Board name</p>
            <div  className='col-xs-2 chat-image' 
                  onClick={ this.togglePosition.bind(this, 'medium') }>
              <img  className='exit-maximize-image' 
                    src='http://image.flaticon.com/icons/svg/60/60801.svg' 
                    width='16px' />
            </div>
          </div>
          <div className='chat-body'>
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
                onChange={ this.changeText.bind(this) }  />
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

  handleKey(event){
    if(event.which === 13) {
      this.sendMessage();
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
          console.log(response);
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
}

ChatLayout.propTypes = {
  chat: React.PropTypes.object.isRequired,
  position: React.PropTypes.string.isRequired,
  removeChat: React.PropTypes.func.isRequired,
};
