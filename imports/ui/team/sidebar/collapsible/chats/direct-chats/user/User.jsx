import React from 'react';

export default class User extends React.Component {
  constructor(props) {
    super(props);
    
    this.createDirectChat = this.createDirectChat.bind(this);
  }

  render() {
    return (
      <div
        className="row row-fixed-margin"
        onClick={() => this.props.createDirectChat(this.props.team._id, this.props.user._id)}
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
  createDirectChat: React.PropTypes.func.isRequired,
};
