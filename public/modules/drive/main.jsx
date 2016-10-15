const { DiamondAPI, React, ReactDOM, ReactRouter } = window;
const { Router, Route, browserHistory } = ReactRouter;

browserHistory.push('/'); // initialize the router

// Google Drive API
const CLIENT_ID = '624318008240-lkme1mqg4ist618vrmj70rkqbo95njnd.apps.googleusercontent.com';
const folderMimeType = 'application/vnd.google-apps.folder';

class FileManagerLayout extends React.Component {
  static renderDocumentTypeImg(fileType) {
    switch (fileType) {
      case 'application/vnd.google-apps.document':
        return (
          <img
            alt="Documento"
            className="col-xs-3 icon-type create-doc"
            src="/modules/drive/img/google-docs.svg"
          />);
      case 'application/vnd.google-apps.drawing':
        return (
          <img
            alt="Dibujo"
            className="col-xs-3 icon-type create-doc"
            src="/modules/drive/img/google-drawings.svg"
          />);
      case 'application/vnd.google-apps.spreadsheet':
        return (
          <img
            alt="Hoja de cálculo"
            className="col-xs-3 icon-type create-doc"
            src="/modules/drive/img/google-sheets.svg"
          />);
      case 'application/vnd.google-apps.presentation':
        return (
          <img
            alt="Presentación"
            className="col-xs-3 icon-type create-doc"
            src="/modules/drive/img/google-slides.svg"
          />);
      default:
        return null;
    }
  }
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      fileType: 'application/vnd.google-apps.document',
      initializedFilePickerCard: false,
    };
  }

  handleImport(file) {
    this.props.importDocument({
      file,
      parentFolderId: this.props.folderId,
      callback(error) {
        if (error) {
          console.error(error); // TODO: handle error
        }
      },
    });
  }

  renderFolders() {
    if (this.props.folders.length === 0) {
      return (
        <div
          className="document-container col-xs-4 col-sm-3 col-lg-2"
          data-toggle="modal"
          data-target="#create-folder"
        >
          <div className="document fixed">
            <img
              alt="Crear carpeta"
              className="col-xs-3 icon-type create-folder"
              src="/modules/drive/img/folder.svg"
            />
            <p className="col-xs-9 document-title truncate">Crear</p>
          </div>
        </div>
      );
    }
    return this.props.folders.map(folder => (
      <div className="document-container col-xs-4 col-sm-3 col-lg-2">
        <div
          className="document fixed"
          title={folder.name}
          onClick={
            () => {
              browserHistory.push(`/folder/${folder._id}`);
            }
          }
        >
          <img
            alt="Crear carpeta"
            className="col-xs-3 icon-type create-folder"
            src="/modules/drive/img/folder.svg"
          />
          <p className="col-xs-9 document-title truncate">{folder.name}</p>
        </div>
        <i
          className="material-icons delete"
          onClick={this.props.deleteDocument.bind(this, {
            id: folder._id,
            parentFolderId: this.props.folderId,
            mimeType: folderMimeType,
            isImported: folder.isImported,
            callback: () => {}, // TODO: handle loading and error
          })}
        >
          delete
        </i>
      </div>
    ));
  }

  renderDocuments() {
    if (this.props.documents.length === 0) {
      return (
        <div>
          <div
            className="document-container col-xs-4 col-sm-3 col-lg-2"
            data-toggle="modal"
            data-target="#create-document"
          >
            <div className="document fixed">
              <img
                alt="Crear documento"
                className="col-xs-3 icon-type create-doc"
                src="/modules/drive/img/google-docs.svg"
              />
              <p className="col-xs-9 document-title truncate">Crear</p>
            </div>
          </div>
          <div
            className="document-container col-xs-4 col-sm-3 col-lg-2"
            id="import-file-card"
          >
            <div className="document fixed">
              <img
                alt="Importar"
                className="col-xs-3 icon-type import-drive"
                src="/modules/drive/img/google-drive-logo.svg"
              />
              <p className="col-xs-9 document-title truncate">Importar</p>
            </div>
          </div>
        </div>
      );
    }
    return this.props.documents.map(document => (
      <div className="document-container col-xs-4 col-sm-3 col-lg-2">
        <div
          className="document fixed"
          title={document.name}
        >
          {
            FileManagerLayout.renderDocumentTypeImg(document.fileType)
          }
          <p
            className="col-xs-9 document-title truncate"
            onClick={
              () => {
                browserHistory.push(`/document/${document._id}`);
              }
            }
          >
            {document.name}
          </p>
        </div>
        <i
          className="material-icons delete"
          onClick={this.props.deleteDocument.bind(this, {
            id: document._id,
            parentFolderId: this.props.folderId,
            mimeType: document.fileType,
            isImported: document.isImported,
            callback: () => {}, // TODO: handle loading and error
          })}
        >
          delete
        </i>
      </div>
    ));
  }


  componentDidMount() {
    this.props.initPicker('import-file', this.handleImport.bind(this));
  }

  componentDidUpdate() {
    if (!this.state.initializedFilePickerCard &&
        !this.props.loadingDocuments &&
        this.props.documents.length === 0) {
      this.props.initPicker('import-file-card', this.handleImport.bind(this));
      this.setState({
        initializedFilePickerCard: true,
      });
    }
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
                    })}>
                      Crear
                    </button>
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
                        diamondCloudDriveFolderId: this.props.diamondCloudDriveFolderId,
                        callback: (error) => {
                          if (!!error) {
                            console.error(error); // TODO: handle error
                          }
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
                title='Importar de drive'
              ></div>
              <div
                className="option folder"
                data-toggle="modal"
                data-target="#create-folder"
                title='Crear carpeta'>
                  <i className="material-icons icon">create_new_folder</i>
              </div>
              <div
                className="option doc"
                data-toggle="modal"
                data-target="#create-document"
                title='Crear documento'>
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
  importDocument: React.PropTypes.func.isRequired,
  deleteDocument: React.PropTypes.func.isRequired,
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
        importDocument={this.importDocument}
        deleteDocument={this.deleteDocument}
        initPicker={this.initPicker}
        diamondCloudDriveFolderId={this.state.diamondCloudDriveFolderId}
      />
    );
  }


  componentDidMount() {
    this.getDriveData(this.props.params.folderId);
    checkAuth(this.getDriveFolder.bind(this)); /** configure google drive api and
                                     *  call the getDriveFolder in the callback
                                     */
  }

  componentWillReceiveProps(nextProps) {
    // the props have changed, so we have to remake the subscriptions
    DiamondAPI.unsubscribe();
    this.getDriveData(nextProps.params.folderId);
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

  getDriveData(folderId) {
    console.log('Se esta por llamar getDriveData; las props son: ', folderId);
    // TODO show only the documents and folders of the current folder
    // TODO dessuscribe from the old folders
    let self = this;

    /////////////////////////////////////////
    // Get the files of the current folder //
    /////////////////////////////////////////

    const getFiles = ({ parentFolderId = null, foldersIds = [], documentsIds = [] }) => {
      if (foldersIds.length !== 0 || parentFolderId) {
        DiamondAPI.subscribe({
          collection: 'folders',
          filter: (parentFolderId) ? { // if we are not in the root folder
            parentFolderId,
          } : { // If we are in the root folder
            _id: {
              $in: foldersIds,
            },
          },
          callback(err, res) {
            console.log('Me acaban de llegar carpetas. Son: ', res);
            if (err) {
              console.error(err);
            } else {
              self.setState({
                loadingFolders: false,
                folders: res,
              });
            }
          },
        });
      } else {
        self.setState({
          loadingFolders: false,
          folders: [],
        });
      }

      if (documentsIds.length !== 0 || parentFolderId) {
        DiamondAPI.subscribe({
          collection: 'documents',
          filter: (parentFolderId) ? { // if we are not in the root folder
            parentFolderId,
          } : { // If we are in the root folder
            _id: {
              $in: documentsIds,
            },
          },
          callback(err, res) {
            console.log('Me acaban de llegar archivos. Son: ', res);
            if (err) {
              console.error(err);
            } else {
              self.setState({
                loadingDocuments: false,
                documents: res,
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
    };

    ////////////////////////////////////////
    // Check if we are in the root folder //
    ////////////////////////////////////////

    if (!folderId) {
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
        parentFolderId: folderId,
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
          // Create the document inside the parent folder if it exists
          parents: [parentFolderId || diamondCloudDriveFolderId],
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
              object: {
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
            object: {
              _id: resp.result.id,
              parentFolderId,
              name,
              fileType,
              isImported: false,
            },
            isGlobal: true,
            callback,
          });
        }, (reason) => {
          callback(reason, resp);
        });
      }, (reason) => {
        callback(reason, resp);
      });
    }
  }

  /**
     * Creates a folder in the module storage, and in Drive
     * @param {String} name
     * @param {String} parentFolderId (optional)
     * @param {Function} callback (optional)
     *   @param {String} error
     *   @param {Object} response
     */
  createFolder({ name, parentFolderId = null, diamondCloudDriveFolderId, callback = () => {} }) {
    // Check if there is a Diamond Cloud drive folder
    if (!diamondCloudDriveFolderId) {
      callback('There was an error while creating the document. Please try again');
      return false;
      // TODO: handle this error
    }

    // Create the folder in Drive
    gapi.client.drive.files.create({
      resource: {
        name,
        mimeType: folderMimeType,
        parents: [parentFolderId || diamondCloudDriveFolderId],
      }
    }).then(handleCreatedFolder, (error) => {
      callback(error);
    });

    function handleCreatedFolder(result) {
      let folderId = result.result.id;
      if (!parentFolderId) {
        DiamondAPI.insert({
          collection: 'rootFiles',
            object: {
              folderId: folderId,
              boardId: DiamondAPI.getCurrentBoard()._id,
            },
            isGlobal: true,
            callback(err, res) {
              if (!!err) {
                callback(err, null);
              } else {
                insertFolderInStorage(folderId);
              }
            }
        });
      } else {
        insertFolderInStorage(folderId);
      }
    }

    function insertFolderInStorage(folderId) {
      DiamondAPI.insert({
        collection: 'folders',
        object: {
         _id: folderId,
         parentFolderId,
         name,
        },
        isGlobal: true,
        callback,
      });
    }
  }

  /**
     * Inserts a Drive file in module storage
     * @param {Object} file
     * @param {String} parentFolderId (optional)
     * @param {Function} callback (optional)
     *   @param {String} error
     *   @param {Object} response
     */
  importDocument({ file, parentFolderId = '', callback = () => {} }) {
    if (!parentFolderId) {
      DiamondAPI.insert({
        collection: 'rootFiles',
          object: {
            documentId: file.id,
            boardId: DiamondAPI.getCurrentBoard()._id,
          },
          isGlobal: true,
          callback(err, res) {
            if (!!err) {
              callback(err, null);
            } else {
              insertDocumentInStorage(file.id, file.name, file.mimeType);
            }
          }
      });
    } else {
      insertDocumentInStorage(file.id, file.name, file.mimeType);
    }

    function insertDocumentInStorage(id, name, fileType) {
      DiamondAPI.insert({
        collection: 'documents',
        object: {
          _id: id,
          parentFolderId,
          name,
          fileType,
          isImported: true,
        },
        isGlobal: true,
        callback,
      });
    }
  }

  /**
   * deleteDocument: Deletes a document from the module data and from Drive.
   * If the document is a folder, deletes all its children.
   * If it does not recieve an id, it deletes all documents
   * with the given parent id.
   * It does not delete from Drive imported files.
   * @param {String} id (optional)
   * @param {String} parentFolderId (optional)
   * @param {String} mimeType (optional)
   * @param {String} isImported true if the file was imported from Drive
   * @param {Function} callback (optional)
   *   @param {String} error
   *   @param {Object} response
   */
  deleteDocument(params) {
    // We need to redeclare the function to have a reference to it.
    // Otherwise, we would not be able to call it recursivaly,
    // as we don't know in which context it is going to run.
    function recursiveDeleteDocument({ id = '', parentFolderId = '', mimeType = '', isImported, callback = () => {}}) {
      if ((id === '' && parentFolderId === '')) {
        let error = 'Invalid parameters passed to deleteDocument';
        console.error(error);
        callback(error, null);
        return false;
      }

      let self = this;

      // TODO: handle this with promises
      removeFromRoot((error, result) => {
        if (!!error) {
          callback(error, result);
          return false;
        }
        deleteChildren((error, result) => {
          if (!!error) {
            callback(error, result);
            return false;
          }
          deleteFromDrive((error, result) => {
            if (!!error) {
              callback(error, result);
              return false;
            }
            deleteFromStorage(callback);
          });
        });
      });

      // If the document is on root directory, removes it.
      function removeFromRoot(_callback) {
        if (parentFolderId === '') {
          DiamondAPI.remove({
            collection: 'rootFiles',
            filter: {
              $or: [
                {
                  documentId: id
                },
                {
                  folderId: id
                },
              ],
            },
            callback: _callback,
          });
        } else {
          _callback();
        }
      }

      // If the document is a folder, recursively delete its children.
      function deleteChildren(_callback) {
        if (mimeType === folderMimeType) {
          recursiveDeleteDocument({
            parentFolderId: id,
            callback: _callback,
          });
        } else {
          _callback();
        }
      }

      function deleteFromDrive(_callback) {
        if (!!id && !isImported) {
          gapi.client.drive.files.delete({
            fileId: id,
          }).then(_callback, _callback);
        } else {
          _callback();
        }
      }

      function deleteFromStorage(_callback) {
        if (!id) {
          // It means we have to delete folders and documents
          DiamondAPI.remove({
            collection: 'folders',
            filter: {
              parentFolderId
            },
            callback(error, response) {
              if (!!error) {
                _callback(error, response);
              } else {
                DiamondAPI.remove({
                  collection: 'documents',
                  filter: {
                    parentFolderId
                  },
                  callback
                });
              }
            }
          })
        } else {
          let collection = (mimeType === folderMimeType) ? 'folders' : 'documents',
              filter = (!!id) ? {
                _id: id
              } : {
                parentFolderId,
              };
          DiamondAPI.remove({
            collection: collection,
            filter,
            callback: _callback
          });
        }
      }
    }
    recursiveDeleteDocument(params);
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
  
  componentDidMount() {
    // Set in the data storage the opened document
    DiamondAPI.update({
      collection: 'globalValues',
      updateQuery: {
        $set: {
          '$.openedDocumentId': this.props.params.documentId,
        },
      },
      callback(error) {
        if (error) {
          console.error(error);
        }
        console.log('hola. Cambie el openedDocumentId');
      }
    });
  }
}

class FileViewerLayout extends React.Component {
  render() {
    return (
      <div>
        <div className='drive-navbar'>
          <i
            className="go-back"
            onClick={ browserHistory.goBack }>
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
