const { DiamondAPI, React, ReactDOM, ReactRouter, classNames } = window;
const { Router, Route, IndexRoute, browserHistory } = ReactRouter;

browserHistory.push('/'); // initialize the router

// Google Drive API
const CLIENT_ID = '624318008240-lkme1mqg4ist618vrmj70rkqbo95njnd.apps.googleusercontent.com',
      folderMimeType = 'application/vnd.google-apps.folder';

class FileManagerLayout extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      fileType: 'application/vnd.google-apps.document',
    };
  }

  renderFolders() {
    if(this.props.folders.length === 0) {
      return (
        <div
            className="folder-item-container col-xs-4"
            data-toggle="modal"
            data-target="#create-folder">
            <div className='folder-item fixed'>
              <p className="truncate">Cree una carpeta</p>
            </div>
          </div>
      );
    } else {
      return this.props.folders.map((folder) => {
        return (
          <div
            className="folder-item-container col-xs-4"
            onClick={
              () => {
                browserHistory.push('/folder/' + folder._id);
              }
            }>
            <div className='folder-item fixed'>
              <p className="truncate">{folder.name}</p>
              <i className="material-icons delete">delete</i>
            </div>
          </div>
        );
      });
    }
  }
  renderDocuments() {
    if(this.props.documents.length === 0) {
      return (
        <div>
          <div className='document-container col-xs-4'>
            <div
              className="document fixed"
              data-toggle="modal"
              data-target="#create-document">
              <p className="truncate">Cree un documento</p>
            </div>
          </div>
          <div className='document-container col-xs-4'>
            <div
              className="document fixed"
              id="import-file">
              <p className="truncate">Importe desde drive</p>
            </div>
          </div>
        </div>
      );
    } else {
      return this.props.documents.map((document) => {
        return (
          <div className='document-container col-xs-4'>
            <div
              className="document fixed"
              onClick={
                () => {
                  browserHistory.push('/document/' + document._id);
                }
              } >
              <p className="truncate">{document.name}</p>
              <i className="material-icons delete">delete</i>
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
          {
            // Create document modal
          }
          <div className="modal fade" id="create-document" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                  <h4 className="modal-title" id="myModalLabel">Crear archivo</h4>
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
                    <option value='application/vnd.google-apps.drawing'>Drawing</option>
                    <option value='application/vnd.google-apps.spreadsheet'>Excel</option>
                    <option value='application/vnd.google-apps.presentation'>Slides</option>
                  </select>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-default" data-dismiss="modal">Cancelar</button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={ this.props.createDocument.bind(this, {
                    name: this.state.name,
                    fileType: this.state.fileType,
                    parentFolderId: this.props.folderId,
                    diamondCloudDriveFolderId: this.props.diamondCloudDriveFolderId,
                    callback: () => {
                      $('#create-document').modal('hide');
                    },
                  }) }>Crear</button>
                </div>
              </div>
            </div>
          </div>
          {
            // Create folder modal
          }
          <div className="modal fade" id="create-folder" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                  <h4 className="modal-title" id="myModalLabel">Crear capeta</h4>
                </div>
                <div className="modal-body">
                  <div className="form-group name">
                    <label for="file-name">Nombre de la carpeta</label>
                    <input
                      type="text"
                      className="form-control"
                      id="file-name"
                      placeholder="Nombre de la carpeta"
                      value={ this.state.name }
                      onChange={ this.handleChange.bind(this, 'name') } />
                  </div>

                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-default" data-dismiss="modal">Cancelar</button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={
                      this.props.createFolder.bind(this, {
                        name: this.state.name,
                        parentFolderId: this.props.folderId,
                        callback: () => {
                          $('#create-folder').modal('hide');
                        },
                      })
                    }>Crear</button>
                </div>
              </div>
            </div>
          </div>

          {
            !!this.props.folderId ?
            (
              <div className='folder-navbar'>
                <div
                  className='go-back'
                  onClick={ browserHistory.goBack }>
                </div>
              </div>
            ) : ( null )
          }
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
                className="option folder"
                data-toggle="modal"
                data-target="#create-folder">
                  <i className="material-icons icon">create_new_folder</i>
              </div>
              <div
                className="option doc"
                data-toggle="modal"
                data-target="#create-document">
              </div>
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

}

FileManagerLayout.propTypes = {
  folderId: React.PropTypes.string.isRequired,
  loadingFolders: React.PropTypes.bool.isRequired,
  folders: React.PropTypes.array.isRequired,
  loadingDocuments: React.PropTypes.bool.isRequired,
  documents: React.PropTypes.array.isRequired,
  createDocument: React.PropTypes.func.isRequired,
  createFolder: React.PropTypes.func.isRequired,
  initPicker: React.PropTypes.func.isRequired,
  diamondCloudDriveFolderId: React.PropTypes.string.isRequired,
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
      diamondCloudDriveFolderId: null, /** The drive folder in which
                                        *  all files are stored
                                        */
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
        createFolder={this.createFolder}
        initPicker={this.initPicker}
        diamondCloudDriveFolderId={this.state.diamondCloudDriveFolderId}
      />
    );
  }


  componentDidMount() {
    this.getDriveData();
    checkAuth(this.getDriveFolder.bind(this)); /** configure google drive api and
                                     *  call the getDriveFolder in the callback
                                     */
  }

  componentWillReceiveProps() {
    // the props have changed, so we have to remake the subscriptions
    this.getDriveData();
  }

  /**
   * getDriveFolder: sets the diamondCloudDriveFolderId state.
   *   It is the folder in the user's Drive in which all
   *   the Diamond Cloud files will be stored.
   *   If there is no folder, it creates it.
   */
  getDriveFolder() {
    // Search for the folder
    const folderName = DiamondAPI.getTeam().name + ' (Diamond Cloud)';
    let self = this;
    gapi.client.drive.files.list({
      q: `name = "${folderName}" and mimeType = "${folderMimeType}"`,
      pageSize: 1,
    }).then(handleFolderList, (error) => {
      console.log(error); // TODO: handle error
    });

    function handleFolderList(response) {
      // There isn't any folder created
      if (response.result.files.length === 0) {
        gapi.client.drive.files.create({
          resource: {
            name: folderName,
            mimeType: folderMimeType,
          }
        }).then(handleCreatedFolder, (error) => {
          console.log(error); // TODO: handle error
        });
      } else {
        self.setState({
          diamondCloudDriveFolderId: response.result.files[0].id,
        });
      }
    }

    function handleCreatedFolder(response) {
      self.setState({
        diamondCloudDriveFolderId: response.result.id,
      });
    }
  }

  getDriveData() {

    // TODO show only the documents and folders of the current folder
    // TODO dessuscribe from the old folders
    let self = this;

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
  }

  /**
   * Creates a document in the user's Drive
   * @param {String} name
   * @param {String} parentFolderId (optional)
   * @param {String} fileType
   *   it is the mimeType of the fileType
   *   https://developers.google.com/drive/v3/web/mime-types
   * @param {Function} callback (optional)
   *   @param {String} error
   *   @param {Object} response
   */
  createDocument({ name, parentFolderId = null, fileType, diamondCloudDriveFolderId, callback = () => {} }) {
    // Check if there is a Diamond Cloud drive folder
    if (!diamondCloudDriveFolderId) {
      console.error('There was an error while creating the document. Please try again');
      // TODO: handle this error
    } else {
      gapi.client.drive.files.create({
        resource: {
          name,
          mimeType: fileType,
          parents: [diamondCloudDriveFolderId],
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
              name,
              fileType,
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
  }

  /**
     * Creates a folder (not in Google Drive, but in our data)
     * @param {String} name
     * @param {String} parentFolderId (optional)
     * @param {Function} callback (optional)
     *   @param {String} error
     *   @param {Object} response
     */
  createFolder({ name, parentFolderId = null, callback = () => {} }) {
    let folderId = ''; // generates a random string
    const ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

    const ID_LENGTH = 16;
    for (let i = 0; i < ID_LENGTH; i++) {
      folderId += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
    }

    if (!parentFolderId) {
      DiamondAPI.insert({
        collection: 'rootFiles',
          obj: {
            folderId: folderId,
            boardId: DiamondAPI.getCurrentBoard()._id,
          },
          isGlobal: true,
          callback(err, res) {
            if (!!err) {
              console.error(err);
              callback(err, null);
            } else {
              callback(null, res);
            }
          }
      });
    }

    DiamondAPI.insert({
       collection: 'folders',
       obj: {
         _id: folderId,
         parentFolderId,
         name,
       },
       isGlobal: true,
       callback(err, res) {
         if (!!err) {
           console.error(err);
           callback(err, null);
         }
       },
     });
  }

  /**
   * deleteDocument: Deletes a document from the module data and from Drive.
   * If the document is a folder, deletes all its children.
   * If it recieves parentFolderId instead of id, it deletes all documents
   * with the given parent id.
   * @param {String} id (optional)
   * @param {String} parentFolderId (optional)
   * @param {Function} callback (optional)
   *   @param {String} error
   *   @param {Object} response
   */
  deleteDocument({ id = '', parentFolderId = '', callback = () => {}}) {
    if (id === '' && parentFolderId === '') {
      let error = 'Invalid parameters passed to deleteDocument';
      console.error(error);
      callback(error, null);
    }
    // If the document is on root directory, remove it.

    // if the document is a folder, recursively delete its children
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
    let url = 'https://drive.google.com/open?id=' + this.props.params.documentId;

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
      <div>
        <div className='drive-navbar'>
          <i
            className="material-icons go-back"
            onClick={ browserHistory.goBack }>
            arrow_back
          </i>
        </div>
        <iframe
          src={this.props.url}
          style={
            {
              width: '100%',
              height: 'calc(100% - 32px)'
            }
          }
        />
      </div>
    );
  }
}

FileViewerLayout.propTypes = {
  url: React.PropTypes.string.isRequired,
};

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path='/' component={FileManagerPage} />
    <Route path='/folder/:folderId' component={FileManagerPage} />
    <Route path='/document/:documentId' component={FileViewerPage} />
  </Router>,
  document.getElementById('render-target')
);

/**
 * Check if current user has authorized this application.
 */
function checkAuth(callback = () => {}, i = 0) {
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
        gapi.client.load('drive', 'v3', callback);
      });
    } else {
      i++;
      setTimeout(() => {
        checkAuth(callback, i);
      }, 100);
    }
  } else {
    console.error('Google API did not load properly. Reload or try later.');
  }
}
