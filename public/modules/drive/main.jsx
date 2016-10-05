const { DiamondAPI, React, ReactDOM, ReactRouter, classNames } = window;
const { Router, Route, IndexRoute, browserHistory } = ReactRouter;

browserHistory.push('/'); // initialize the router

// Google Drive API
let CLIENT_ID = '624318008240-lkme1mqg4ist618vrmj70rkqbo95njnd.apps.googleusercontent.com';

class FileManagerLayout extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      fileType: 'application/vnd.google-apps.document',
    };
  }

  renderFolders() {
    console.log(this.props);
    if(this.props.folders.length === 0) {
      return (
        <p>
          No hay carpetas
        </p>
      );
    } else {
      return this.props.folders.map((folder) => {
        return (
          <div className="folder col-xs-4 fixed">
            <p className="truncate">{folder.name}</p>
          </div>
        );
      });
    }
  }
  renderDocuments() {
    console.log('DOCUMENTS: ', this.props.documents);
    if(this.props.documents.length === 0) {
      return (
        <div>
          <p>
            No hay documentos para mostrar
          </p>
        </div>
      );
    } else {
      return this.props.documents.map((document) => {
        return (
          <div className='document-container col-xs-4'>
            <div
              className="document fixed"
              onClick={() => {
                browserHistory.push('/document/' + document._id);
              }}>
              <p className="truncate">{document.name}</p>
            </div>
          </div>
        );
      });
    }
  }

  componentDidMount() {
    this.props.initPicker('import-file', (file) => {console.log(file)});
  }

  render() {
    return (
      <div>
        <div id='resizable' className='file-manager ui-widget-content'>
          <div
            className="modal-container"
            id='create-doc-modal'>
            <div className="create-doc-modal">
              <div className="modal-head">
              <div className="header-data">
              <h4 className="modal-title">Cree un documento</h4>
              <i
                className="material-icons close"
                onClick={ this.closeModal.bind(this) }>close</i>
            </div>

            </div>
              <div className="modal-body">
              <div className="form-group name">
                <label for="file-name">Nombre del archivo</label>
                <input
                  type="text"
                  className="form-control"
                  id="file-name"
                  placeholder="Nombre del archivo"
                  value={ this.state.name }
                  onChange={ this.handleChange.bind(this, 'name') } />
              </div>

              <label for="file-type">Tipo de archivo</label>
              <select
                id="file-type"
                className="form-control"
                value={ this.state.fileType }
                onChange={ this.handleChange.bind(this, 'fileType') }>
                <option value='application/vnd.google-apps.document'>Docs</option>
                <option value='application/vnd.google-apps.spreadsheet'>Excel</option>
                <option value='application/vnd.google-apps.presentation'>Slides</option>
              </select>
            </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-default"
                  data-dismiss="modal"
                  onClick={ this.closeModal.bind(this) }>Cancelar</button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={ this.props.createDocument.bind(this, {
                    name: this.state.name,
                    fileType: this.state.fileType,
                    parentFolderId: this.props.folderId,
                  }) }>Crear</button>
              </div>
            </div>
          </div>
          <div className="container-fluid files-container">
            <p className="folders-title-container">
              Carpetas
            </p>
            <hr className="divider" />
            <div className="folders-container">
              {
                (this.props.loadingFolders) ?
                  (
                    <p>Cargando...</p>
                  ) : (
                    this.renderFolders()
                  )
              }
            </div>
            <p className="documents-title-container">
              Archivos
            </p>
            <hr className="divider" />
            <div className="documents-container">
              {
                (this.props.loadingDocuments) ?
                  (
                    <p>Cargando...</p>
                  ) : (
                    this.renderDocuments()
                  )
              }
            </div>
          </div>
          <div className="create">
            <div className="options">
              <div
                className="option drive"
                id="import-file"
              ></div>
              <div
                className="option new"
                onClick={this.openModal.bind(this)}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  handleChange(index, event) {
    this.setState({
       [index]: event.target.value,
    });
  }

  closeModal() {
    $('#create-doc-modal').removeClass('active');
  }
  openModal() {
    $('#create-doc-modal').addClass('active');
  }
}

FileManagerLayout.propTypes = {
  folderId: React.PropTypes.string.isRequired,
  loadingFolders: React.PropTypes.bool.isRequired,
  folders: React.PropTypes.array.isRequired,
  loadingDocuments: React.PropTypes.bool.isRequired,
  documents: React.PropTypes.array.isRequired,
  createDocument: React.PropTypes.func.isRequired,
  initPicker: React.PropTypes.func.isRequired,
};

class FileManagerPage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      loadingFolders: true, /** indicates if the folders subscription
                             *  has already returned data
                             */
      folders: [],
      loadingDocuments: true, /** indicates if the documents subscription
                               *  has already returned data
                               */
      documents: [],
    };
  }

  render() {
    return (
      <FileManagerLayout
        folderId={this.props.params.folderId}
        loadingFolders={this.state.loadingFolders}
        folders={this.state.folders}
        loadingDocuments={this.state.loadingDocuments}
        documents={this.state.documents}
        createDocument={this.createDocument}
        initPicker={this.initPicker}
      />
    );
  }


  componentDidMount() {

    let self = this;

    ////////////////////////////////////////
    // Check if we are in the root folder //
    ////////////////////////////////////////

    if (!this.props.params.folderId) {
      //////////////////////////////////////////////////////////
      // Get the list of folders and documents in root folder //
      //////////////////////////////////////////////////////////

      DiamondAPI.subscribe({
        collection: 'rootFiles',
        filter: {
          boardId: DiamondAPI.getCurrentBoard()._id,
        },
        callback(err, res) {
          if (!!err) {
            console.error(err);
          } else {
            if (!res || res.length === 0) {
              self.setState({
                loadingFolders: false,
                folders: [],
                loadingDocuments: false,
                documents: [],
              })
            } else {
              getFiles({
                // returns only the folders id's
                foldersIds: res.filter((element) => {
                  return !!element.folderId
                }).map((element) => {
                  return element.folderId
                }),

                // returns only the documents id's
                documentsIds: res.filter((element) => {
                  return !!element.documentId;
                }).map((element) => {
                  return element.documentId
                }),
              });
            }
          }
        }
      });
    } else {

      ///////////////////////////////////
      // we are not in the root folder //
      ///////////////////////////////////

      getFiles({
        parentFolderId: this.props.params.folderId,
      });
    }

    /////////////////////////////////////////
    // Get the files of the current folder //
    /////////////////////////////////////////

    const getFiles = ({ parentFolderId = null, foldersIds = [], documentsIds = [] }) => {
      if (foldersIds.length !== 0) {
        const foldersHandle = DiamondAPI.subscribe({
          collection: 'folders',
          filter: (!!parentFolderId) ? { // if we are not in the root folder
            parentFolderId,
          } : { //if we are in the root folder
            _id: {
              $in: foldersIds,
            },
          },
          callback(err, res) {
            if (!!err) {
              console.error(err);
            } else {
              self.setState({
                loadingFolders: false,
                folders: res
              });
            }
          },
        });
      } else {
        self.setState({
          loadingFolders: false,
          folders: []
        });
      }

      if (documentsIds.length !== 0) {
        const documentsHandle = DiamondAPI.subscribe({
          collection: 'documents',
          filter: (!!parentFolderId) ? { // if we are not in the root folder
            parentFolderId,
          } : { //if we are in the root folder
            _id: {
              $in: documentsIds,
            },
          },
          callback(err, res) {
            if (!!err) {
              console.error(err);
            } else {
              self.setState({
                loadingDocuments: false,
                documents: res
              });
            }
          },
        });
      } else {
        self.setState({
          loadingDocuments: false,
          documents: [],
        });
      }
    }

    checkAuth(); // configure google drive api
  }

  createDocument({ name, parentFolderId, fileType, callback = () => {} }) {

     /**
      * callback(err, res)
      * res: file
      * fileType is the mimeType of the file
      *   https://developers.google.com/drive/v3/web/mime-types
      */

    $('#create-doc-modal').removeClass('active');
    gapi.client.drive.files.create({
      resource: {
        name,
        mimeType: fileType,
      }
    }).then((resp) => {
      // Make the document editable to everyone with the link
      gapi.client.drive.permissions.create({
        fileId: resp.result.id,
        role: 'writer',
        type: 'anyone',
      }).then(() => {
        if (!parentFolderId) {
          DiamondAPI.insert({
            collection: 'rootFiles',
            obj: {
              documentId: resp.result.id, // resp is the response to the create
                                          // request, not to the permission one
              boardId: DiamondAPI.getCurrentBoard()._id,
            },
            isGlobal: true,
            callback(err, res) {
              if (!!err) {
                console.error(err);
              }
            }
          });
        }

        DiamondAPI.insert({
          collection: 'documents',
          obj: {
            _id: resp.result.id,
            parentFolderId,
            name
          },
          isGlobal: true,
          callback(err, res) {
            if (!!err) {
              console.error(err);
            }
          },
        });
        callback(null, resp);
      }, (reason) => {
        callback(reason, resp);
      });
    }, (reason) => {
      callback(reason, resp);
    });
  }

  initPicker(openButtonId, callback) {
    /**
     * openButtonId is the button that is used to open the file picker
     * callback(file)
     */
  	let picker = new FilePicker({
  		apiKey: 'AIzaSyCb04iiO8_pvdHsuf3XCNbdGw8SIbR9CxQ',
  		clientId: CLIENT_ID,
  		buttonEl: document.getElementById(openButtonId),
  		onSelect: callback,
  		gapi
  	});
  }
}

class FileViewerPage extends React.Component {

  render() {
    let url = 'https://docs.google.com/document/d/' + this.props.params.documentId + '/edit';

    return (
      <FileViewerLayout
        url={url}
        />
    );
  }
}

class FileViewerLayout extends React.Component {
  render() {
    return (
      <iframe
        src={this.props.url}
        style={
          {
            width: '100%',
            height: '100%'
          }
        }
      />
    );
  }
}

FileViewerLayout.propTypes = {
  url: React.PropTypes.string.isRequired,
};

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path='/' component={FileManagerPage} />
    <Route path='/:folderId' component={FileManagerPage} />
    <Route path='/document/:documentId' component={FileViewerPage} />
  </Router>,
  document.getElementById('render-target')
);

/**
 * Check if current user has authorized this application.
 */
function checkAuth(i) {
  i = i || 0;
  if (i < 5) {
    if (!!gapi.auth) {
      let SCOPES = [
        'https://www.googleapis.com/auth/drive'
      ];
      gapi.auth.authorize({
        'client_id': CLIENT_ID,
        'scope': SCOPES.join(' '),
        'immediate': true
      }, () => {
        gapi.client.load('drive', 'v3');
      });
    } else {
      i++;
      setTimeout(() => {
        checkAuth(i);
      }, 100);
    }
  } else {
    console.error('Google API did not load properly. Reload or try later.');
  }
}
