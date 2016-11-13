import React from 'react';

/**
 * Renders users information from the task.
 */
class UserTaskInformation extends React.Component {
  prettyDate(date) {
    let difference_ms = date;
    difference_ms = difference_ms / 1000;

    let seconds = Math.floor(difference_ms % 60);
    difference_ms = difference_ms / 60;

    let minutes = Math.floor(difference_ms % 60);
    difference_ms = difference_ms / 60;

    let hours = Math.floor(difference_ms % 24);

    seconds = seconds > 9 ? "" + seconds: "0" + seconds;
    minutes = minutes > 9 ? "" + minutes: "0" + minutes;
    hours = hours > 9 ? "" + hours: "0" + hours;

    return hours + ':' + minutes + ':' + seconds;
  }

  renderUsers() {
    return this.props.users.map((user) => {
      let time = 0;
      let working = false;

      this.props.durations.forEach((duration) => {
        if (duration.userId === user._id) {
          if (duration.endTime) {
            time += duration.endTime - duration.startTime;
          } else {
            working = true;
          }
        }
      });

      time = time !== 0 ? this.prettyDate(time) + ' hrs.' : 'No trabajó';

      return (
        <div className="col-xs-12 col-sm-6 col-md-4 col-lg-3 user-time-info">
          <p><b>{user.profile.name}</b></p>
          <p>{working ? 'Trabajando actualmente' : `Tiempo trabajado:  ${time}`}</p>
        </div>
      );
    });
  }

  render() {
    return (
      <div>
        {this.renderUsers()}
      </div>
    );
  }
}

export default UserTaskInformation;
