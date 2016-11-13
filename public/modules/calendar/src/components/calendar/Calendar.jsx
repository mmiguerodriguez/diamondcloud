import React from 'react';

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
}

Calendar.propTypes = {
  children: React.PropTypes.node,
};
