import React from 'react';

export default class User extends React.Component {
  constructor(props) {
    super(props);
    
    this.createDirectChat = this.createDirectChat.bind(this);
  }

  createDirectChat() {
    const self = this;

    Meteor.call('DirectChats.methods.create', {
      teamId: this.props.team._id,
      userId: this.props.user._id,
    }, (error, response) => {
      if (error) {
        console.log('error');
      } else {
        self.props.addChat({ directChatId: response._id });
      }
    });
  }

  render() {
    return (
      <div
        className="row row-fixed-margin"
        onClick={this.createDirectChat}
      >
        <div className="col-xs-2 img-fixed-margin fixed-padding">
          <img
            className="img-circle"
            src={`${this.props.user.profile.picture}?sz=60`}
            width="28px"
          />
        </div>
        <div className="col-xs-10">
          <h4 className="truncate">{this.props.user.profile.name}</h4>
        </div>
      </div>
    );
  }
}

User.propTypes = {
  team: React.PropTypes.object.isRequired,
  user: React.PropTypes.object.isRequired,
  addChat: React.PropTypes.func.isRequired,
};
