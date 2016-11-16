import React from 'react';
import { browserHistory } from 'react-router';

import FileViewerLayout from './FileViewerLayout';

class FileViewerPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      file: {},
    };
  }

  render() {
    return (
      <FileViewerLayout
        id={this.props.params.documentId}
        fileType={this.state.file.fileType}
        loading={this.state.loading}
        fileName={this.state.file.name}
      />
    );
  }

  componentDidMount() {
    // Set in the data storage the opened document
    if (!this.props.openedDocumentId) {
      DiamondAPI.insert({
        collection: 'globalValues',
        object: {
          openedDocumentId: this.props.params.documentId,
        },
        isGlobal: false,
        callback(error) {
          if (error) {
            console.error(error); // TODO: handle error
          }
        },
      });
    } else if (this.props.openedDocumentId !== this.props.params.documentId ||
      this.props.presentationView) {
      DiamondAPI.update({
        collection: 'globalValues',
        updateQuery: {
          $set: {
            openedDocumentId: this.props.params.documentId,
          }
        },
        callback(error) {
          if (error) {
            console.error(error); // TODO: handle error
          }
        }
      });
    }
    const self = this;
    // Set the selected file
    DiamondAPI.get({
      collection: 'documents',
      filter: {
        _id: this.props.params.documentId,
      },
      callback(error, result) {
        if (error) {
          self.setState({
            loading: false,
          })
          self.props.toggleError({
            type: 'show',
            body: 'Error al abrir el documento',
          });
        } else if (result.length === 0) {
          browserHistory.push('/folder');
        } else {
          self.setState({
            loading: false,
            file: result[0],
          });
        }
      }
    });
  }
  
  componentWillReceiveProps(nextProps) {
    if (this.props.params.documentId !== nextProps.params.documentId) {
      const self = this;
      // Set the selected file
      DiamondAPI.get({
        collection: 'documents',
        filter: {
          _id: nextProps.params.documentId,
        },
        callback(error, result) {
          if (error) {
            self.setState({
              loading: false,
            });
            self.props.toggleError({
              type: 'show',
              body: 'Error al abrir el documento',
            });
          } else if (result.length === 0) {
            browserHistory.push('/folder');
          } else {
            self.setState({
              loading: false,
              file: result[0],
            });
          }
        }
      });
    }
  }
}

export default FileViewerPage;
