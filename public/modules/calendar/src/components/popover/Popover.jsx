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
            <b className="event-name">{this.props.calendarEvent.title}</b>
            <p className="avent-duration text-muted truncate">{`${this.props.calendarEvent.start._i} a ${this.props.calendarEvent.end._i}`}</p>
          </div>
          <div className="col-xs-2 fixed">
            <img
              className="close-popover"
              src="http://image.flaticon.com/icons/svg/61/61155.svg"
              onClick= { () => {
                  $('.popover').popover('hide');
                }}
              />
          </div>
        </div>
        <div className="popover-footer">
          <div className="footer-icon">
            <img
              className="delete-event"
              src="http://image.flaticon.com/icons/svg/60/60761.svg"
              onClick={ () => {
                $('#calendar').fullCalendar('removeEvents', this.props.calendarEvent.id);
                $('.popover').popover('destroy');
              }}
              />
          </div>
          <div className="footer-icon">
            <img
              className="edit-event"
              src="http://image.flaticon.com/icons/svg/61/61094.svg"
              onClick={ () => {
                $('#calendar').fullCalendar('removeEvents', this.props.calendarEvent.id);
                $('.popover').popover('hide');
              }}
              />
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
