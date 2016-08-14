import React        from 'react';

import { Messages } from '../../../api/messages/messages.js';

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
      return (
        <div className='chat minimized'>
          <p className='col-xs-10 chat-text' onClick={ this.togglePosition.bind(this, 'medium') }>User name / Board name</p>
          <div className='col-xs-2 chat-image' onClick={ this.togglePosition.bind(this, 'maximized') }>
            <img src='http://image0.flaticon.com/icons/svg/126/126538.svg' width='16px' />
          </div>
        </div>
      );
    } else if (this.state.position === 'medium') {
      return (
        <div className='chat medium'>
          <div className='chat-header'>
            <p className='col-xs-10 chat-text' onClick={ this.togglePosition.bind(this, 'minimized') }>User name / Board name</p>
            <div className='col-xs-2 chat-image' onClick={ this.togglePosition.bind(this, 'maximized') }>
              <img src='http://image0.flaticon.com/icons/svg/126/126538.svg' width='16px' />
            </div>
          </div>
          <div className='chat-body'>
            { this.renderMessages() }
          </div>
          <div className='chat-footer'>
            <div className='col-xs-10'>
              <input value={ this.state.message } onChange={ this.changeText.bind(this) } type='text' placeholder='Escriba el mensaje' className='form-control' />
            </div>
            <div className='send-message col-xs-2' onClick={ this.sendMessage.bind(this) }>
              <img src='http://image0.flaticon.com/icons/svg/60/60525.svg' width='24px'/>
            </div>
          </div>
        </div>
      );
    } else if (this.state.position === 'maximized') {
      return (
        <div className='chat maximized'>
          <div className='chat-header'>
            <p className='col-xs-10 chat-text' onClick={ this.togglePosition.bind(this, 'minimized') }>User name / Board name</p>
            <div className='col-xs-2 chat-image' onClick={ this.togglePosition.bind(this, 'maximized') }>
              <img src='http://image0.flaticon.com/icons/svg/126/126538.svg' width='16px' />
            </div>
          </div>
          <div className='chat-body'>
            { this.renderMessages() }
          </div>
          <div className='chat-footer'>
            <div className='col-xs-10'>
              <input value={ this.state.message } onChange={ this.changeText.bind(this) } type='text' placeholder='Escriba el mensaje' className='form-control' />
            </div>
            <div className='send-message col-xs-2' onClick={ this.sendMessage.bind(this) }>
              <img src='http://image0.flaticon.com/icons/svg/60/60525.svg' width='24px'/>
            </div>
          </div>
        </div>
      );
    } else {
      return ( null );
    }
  }
  
  changeText(event) {
    this.setState({
      message: event.target.value
    });
  }
  togglePosition(position) {
    this.setState({
      position: position,
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
}

ChatLayout.propTypes = {
  chat: React.PropTypes.object.isRequired,
  position: React.PropTypes.string.isRequired,
};
