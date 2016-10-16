import React        from 'react';

import NavbarLayout from '../navbar/NavbarLayout';
import ErrorMessage from '../error-message/ErrorMessage';

const ERROR_DELAY = 5000;

export default class AppLayout extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      error: {
        body: '',
        delay: ERROR_DELAY,
        showing: false,
      },
    };

    this.error = this.error.bind(this);
  }
  /**
  * Sets the error state so we can show an error
  * correctly.
  * @param {Object} object
  *  @param {String} type
  *   Used to say if we are hiding or showing
  *   the error message.
  *  @param {String} body
  *   Error message.
  *  @param {Number} delay
  *   The delay until the message is closed
  */
  error({ type = 'show', body = 'Ha ocurrido un error', delay = ERROR_DELAY }) {
    if (type === 'hide') {
      this.setState({
        error: {
          body: '',
          delay: ERROR_DELAY,
          showing: false,
        },
      });
    } else if (type === 'show') {
      this.setState({
        error: {
          body,
          delay: delay || ERROR_DELAY,
          showing: true,
        },
      });
    }
  }

  render() {
    return (
      <div>
        <NavbarLayout
          path={this.props.location.pathname}
          user={this.props.user}
        />
        {
          React.cloneElement(this.props.children, {
            ...this.props,
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
}

AppLayout.propTypes = {
  user: React.PropTypes.object,
};
