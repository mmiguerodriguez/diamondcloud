import React from 'react';
import { browserHistory } from 'react-router';

import ErrorMessage from '../error-message/ErrorMessage';

const ERROR_DELAY = 5000;

class Calendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: {
        type: '',
        body: '',
        delay: '',
        showing: false,
      },
    };

    this.error = this.error.bind(this);
  }

  error({ type = 'show', body = 'Ha ocurrido un error', delay = ERROR_DELAY }) {
    console.log(type, body);
    this.setState({
      error: {
        body,
        delay: delay || ERROR_DELAY,
        showing: type === 'show',
      },
    });
  }

  render() {
    return (
      <div>
        {
          React.cloneElement(this.props.children, {
            error: this.error,
          })
        }
        {
          this.state.error.showing ? (
            <ErrorMessage
              error={this.error}
              {...this.state.error}
            />
          ) : (null)
        }
      </div>
    );
  }
  
  componentDidMount() {
    const self = this;
    // Check that the calendar was already set up
    DiamondAPI.get({
      collection: 'globalValues',
      callback(error, response) {
        if (error) {
          console.log('hubo un error: ', error);
          self.error({ body: error });
        } else {
          const isSetup = response[0] ? !!response[0].calendarUrl : false;
          if (!isSetup) {
            browserHistory.push('/setup');
          } else {
            // TODO: save the calendarUrl in the state
          }
        }
      }
    });
  }
}

Calendar.propTypes = {
  children: React.PropTypes.node,
};

export default Calendar;
