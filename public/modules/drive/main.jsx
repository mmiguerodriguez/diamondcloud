// File Manager

const { React, ReactDOM, ReactRouter, classNames } = window;
const { Router, Route, IndexRoute, browserHistory } = ReactRouter;

browserHistory.push('/');

class FileManagerLayout extends React.Component {
  getDocumentName(document) {
    return document._id;
  }

  openFolder(folderId) {
    console.log(folderId);
    browserHistory.push('/folder/JJCrf9CYeBDMdeDRt');
    //browserHistory.push(`/folder/${folderId}`);
  }

  openDocument(link) {
    // TODO: Make an option to return to file manager
    console.log(link);
    browserHistory.push(link);
  }

  renderFolders() {
    if (this.props.folders.length > 0) {
      return this.props.folders.map((folder, i) => {
        return (
          <div className="col-xs-4 fixed" key={i} >
            <div
              onClick={ this.openFolder.bind(this, folder._id) }
              className="folder">
              <p className="truncate">{ folder.name }</p>
            </div>
          </div>
        );
      });
    } else {
      return (
        <div>No hay carpetas</div>
      );
    }
  }

  renderDocuments() {
    if (this.props.documents.length > 0) {
      return this.props.documents.map((document, i) => {
        return (
          <div className="col-xs-4 fixed" key={i} >
            <div
              onClick={ this.openDocument.bind(this, document.link) }
              className="document">
              <p className="truncate">{ this.getDocumentName(document) }</p>
              <div className="preview"></div>
            </div>
          </div>
        );
      });
    } else {
      return (
        <div>No hay documentos</div>
      );
    }
  }

  render() {
    return (
      <div id='resizable' className='file-manager ui-widget-content'>
        <div className="container-fluid files-container">
          <p className="folders-title-container">Carpetas</p>
          <hr className="divider" />
          <div className="folders-container">
            { this.renderFolders() }
          </div>
          <p className="documents-title-container">Archivos</p>
          <hr className="divider" />
          <div className="documents-container">
            { this.renderDocuments() }
          </div>
        </div>
        <div className="create">
          <div className="options">
            <div className="option drive"></div>
            <div className="option new"></div>
          </div>
        </div>
      </div>
    );
  }
}

class FileManagerPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      folders: [],
      documents: [],
      loadingBalance: -10,
    };
  }

  render() {
    if (this.state.loadingBalance != 0) {
      return (
        <div className='loading'>
          <div className='loader'></div>
        </div>
      );
    }

    return (
      <FileManagerLayout
        folders={ this.state.folders }
        documents={ this.state.documents } />
    );
  }

  componentWillReceiveProps(nextProps) {
    let self = this;
    let documents = self.state.documents;
    let folders = self.state.folders;

    let folderId = nextProps.params.folderId;

    console.log(this.props.params);

    let showFile = (file) => {
      if (file.documentId) {
        let subHandle = DiamondAPI.get({
          collection: 'documents',
          filter: {
            _id: file.documentId
          },
          callback: (err, res) => {
            documents.push(res[0]);
            self.setState({
              documents,
            });
            self.setState({
              loadingBalance: self.state.loadingBalance + 1
            });
          }
        });
      } else if (file.folderId) {
        let subHandle = DiamondAPI.get({
          collection: 'folders',
          filter: {
            _id: file.folderId
          },
          callback: (err, res) => {
            folders.push(res[0]);
            self.setState({
              folders,
            });
            self.setState({
              loadingBalance: self.state.loadingBalance + 1
            });
          }
        });
      }
    };

    DiamondAPI.subscribe({
      request: {
        collection: !!folderId ? 'folders' : 'files',
        condition: {
          $eq: (
            !!folderId ?
            ['$$element._id', folderId] :
            ['$$element.boardId', DiamondAPI.getCurrentBoard()._id]
          )
        }
      },
      callback: (err, res) => {
        self.setState({
          loadingBalance: self.state.loadingBalance + 10 - res[0].files.length,
        });

        res[0].files.forEach(showFile);
      }
    });
  }

  componentDidMount() {
    let self = this;
    let documents = self.state.documents;
    let folders = self.state.folders;

    let folderId = this.props.params.folderId;

    console.log(this.props.params);

    let showFile = (file) => {
      if (file.documentId) {
        let subHandle = DiamondAPI.get({
          collection: 'documents',
          filter: {
            _id: file.documentId
          },
          callback: (err, res) => {
            documents.push(res[0]);
            self.setState({
              documents,
            });
            self.setState({
              loadingBalance: self.state.loadingBalance + 1
            });
          }
        });
      } else if (file.folderId) {
        let subHandle = DiamondAPI.get({
          collection: 'folders',
          filter: {
            _id: file.folderId
          },
          callback: (err, res) => {
            folders.push(res[0]);
            self.setState({
              folders,
            });
            self.setState({
              loadingBalance: self.state.loadingBalance + 1
            });
          }
        });
      }
    };

    DiamondAPI.subscribe({
      request: {
        collection: !!folderId ? 'folders' : 'files',
        condition: {
          $eq: (
            !!folderId ?
            ['$$element._id', folderId] :
            ['$$element.boardId', DiamondAPI.getCurrentBoard()._id]
          )
        }
      },
      callback: (err, res) => {
        self.setState({
          loadingBalance: self.state.loadingBalance + 10 - res[0].files.length,
        });

        res[0].files.forEach(showFile);
      }
    });
  }
}

ReactDOM.render(
  <Router history={ browserHistory }>
    <Route path='/' component={ FileManagerPage } />
    <Route path='folder/:folderId' component={ FileManagerPage } />
  </Router>,
  document.getElementById('render-target')
);
