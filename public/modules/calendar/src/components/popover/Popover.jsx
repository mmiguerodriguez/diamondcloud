import React from 'react';

class Popover extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log(this.props.calendarEvent);
    return (
      <div>
        <div className="row popover-data">
          <div className="col-xs-10">
            <b className="user-info">{this.props.calendarEvent.title}</b>
            <p className="user-mail text-muted truncate">{`${this.props.calendarEvent.start._i} a ${this.props.calendarEvent.end._i}`}</p>
            <p className="user-mail text-muted truncate"></p>
          </div>
          <div className="col-xs-2">
            <img src='' className="popover-user-photo" />
          </div>
        </div>
      </div>
    );
  }
}

Popover.propTypes = {
  calendarEvent: React.PropTypes.object,
};

export default Popover;
