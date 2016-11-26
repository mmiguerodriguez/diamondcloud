import React from 'react';

class Popover extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div className="row popover-data">
          <div className="col-xs-10">
            <b className="user-info">Holaaa</b>
            <p className="user-mail text-muted truncate">Holaaa</p>
            <p className="user-mail text-muted truncate">Holaaa</p>
          </div>
          <div className="col-xs-2">
            <img alt="User" src='' className="popover-user-photo" />
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
