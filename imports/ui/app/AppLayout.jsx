import React        from 'react';

import NavbarLayout from '../navbar/NavbarLayout.jsx';
import ErrorMessage from '../error-message/ErrorMessage.jsx';

const ERROR_DELAY = 5000;

export default class AppLayout extends React.Component {
  /**
   * Sets the error state so we can show an error
   * correctly.
   * @param {Object} object
   *  @param {String} body
   *   Error message.
   *  @param {Number} delay
   *   The delay until the message is closed
   *  @param {Boolean} showing.
   *   State to check if the message is being
   *   shown or not.
   */
  showError({ body, delay }) {
    this.setState({
      error: {
        body,
        delay: delay ? delay : ERROR_DELAY,
        showing: true,
      },
    });
  }
  /**
   * Resets the error state to the default.
   */
  hideError() {
    this.setState({
      error: {
        body: '',
        delay: ERROR_DELAY,
        showing: false,
      },
    });
  }

  constructor(props) {
    super(props);

    this.state = {
      error: {
        body: '',
        delay: ERROR_DELAY,
        showing: false,
      }
    };
    
    this.showError = this.showError.bind(this);
    this.hideError = this.hideError.bind(this);
  }

  render() {
    return (
      <div>
        <NavbarLayout
          path={ this.props.location.pathname }
          user={ this.props.user }
        />
        { 
          React.cloneElement(this.props.children, { 
            ...this.props,
            showError: this.showError,
            hideError: this.hideError,
          })
        }
        {
          this.state.error.showing ? (
            <ErrorMessage
              hideError={this.hideError}
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
