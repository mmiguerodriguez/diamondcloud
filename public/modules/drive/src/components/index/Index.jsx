import React from 'react';
import { browserHistory } from 'react-router';

import ErrorMessage from '../error-message/ErrorMessage';

const ERROR_DELAY = 5000;

class Index extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      openedDocumentId: '',

      error: {
        type: '',
        body: '',
        delay: ERROR_DELAY,
        showing: false,
      }
    };

    this.error = this.error.bind(this);
  }

  error({ type = 'show', body = 'Ha ocurrido un error', delay = ERROR_DELAY }) {
    console.log('ERROR ERROR ERROR', type === 'show');
    this.setState({
      error: {
        body,
        delay,
        showing: type === 'show',
      },
    });
  }

  render() {
    console.log(this.state.error);
    return (
      <div>
        {
          React.cloneElement(this.props.children, {
            openedDocumentId: this.state.openedDocumentId,
            presentationView: this.state.presentationView,
            slide: this.state.slide,
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
    let self = this;
    
    DiamondAPI.subscribe({
      collection: 'globalValues',
      callback: (error, result) => {
        if (error) {
          console.error(error); // TODO: handle error
          return;
        }

        if (result.length > 0) {
          self.setState({
            openedDocumentId: result[0].openedDocumentId,
          });
          browserHistory.push(`/document/${result[0].openedDocumentId}`);
        }
      },
    });
  }
}

export default Index;
