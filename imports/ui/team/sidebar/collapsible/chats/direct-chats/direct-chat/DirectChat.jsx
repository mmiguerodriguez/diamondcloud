import React      from 'react';
import classNames from 'classnames';

export default class DirectChat extends React.Component {
  render() {
    let columnClasses = classNames({
      'col-xs-8': this.props.notifications > 0,
      'col-xs-10': !(this.props.notifications > 0)
    });

    return (
      <div
        className='row row-fixed-margin'
        onClick={ this.props.addChat.bind(null, { directChatId: this.props.directChat._id }) }>
        <div className='col-xs-2 img-fixed-margin fixed-padding'>
          <img
            className='img-circle'
            src='http://image.flaticon.com/icons/svg/60/60541.svg'
            width='22px' />
        </div>
        <div className={ columnClasses }>
          <h4 className='truncate'>{ this.props.user.profile.name }</h4>
        </div>
        {
          this.props.notifications > 0 ? (
            <div className='col-xs-2 img-fixed-margin'>
              <div className='messages-badge img-circle'>{ this.props.notifications }</div>
            </div>
          ) : ( null )
        }
      </div>
    );
  }
}

DirectChat.propTypes = {
  directChat: React.PropTypes.object.isRequired,
  user: React.PropTypes.object.isRequired,
  notifications: React.PropTypes.number.isRequired,
  addChat: React.PropTypes.func.isRequired,
};
