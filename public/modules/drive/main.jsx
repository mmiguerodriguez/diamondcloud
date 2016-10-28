const { DiamondAPI, React, ReactDOM, ReactRouter } = window;
const { Router, Route, browserHistory } = ReactRouter;

browserHistory.push('/folder'); // initialize the router

// Google Drive API
const CLIENT_ID = '624318008240-lkme1mqg4ist618vrmj70rkqbo95njnd.apps.googleusercontent.com';
const folderMimeType = 'application/vnd.google-apps.folder';
const ERROR_DELAY = 5000;
let authObject;

class Index extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      openedDocumentId: '',

      error: {
        type: '',
        body: '',
        delay: '',
        showing: false,
      }
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
        // Check if the file is an image
        if(fileType.indexOf("image/") !== -1) {
          return (
            <img
              alt="Imagen"
              className="col-xs-3 icon-type create-doc"
              src="/modules/drive/img/image.svg"
            />
          );
        // Check if the file is a video
        } else if (fileType.indexOf("video/") !== -1) {
          return (
            <img
              alt="Video"
              className="col-xs-3 icon-type create-doc"
              src="/modules/drive/img/video.svg"
            />
          );
        // Return the default image
        } else {
          return (
            <img
              alt="Documento"
              className="col-xs-3 icon-type create-doc"
              src="/modules/drive/img/google-docs.svg"
            />
          );
        }
    }
  }
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      fileType: 'application/vnd.google-apps.document',
      initializedFilePickerCard: false,
      fileToUpload: null,
    };
  }

  handleImport(file) {
    this.props.importDocument({
      file,
      parentFolderId: this.props.folderId,
      callback(error) {
        if (error) {
          this.props.toggleError({
            type: 'show',
            body: 'Error al importar el documento',
          });
          self.setState({
            loadingDocuments: false,
          });
        }
      },
    });
  }

  renderFolders() {
    if (this.props.folders.length === 0) {
      return (
        <div
          className='document-container col-xs-6 col-sm-4 col-md-3 col-lg-2'
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
      <div className="document-container col-xs-6 col-sm-4 col-md-3 col-lg-2">
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
            className="document-container col-xs-6 col-sm-4 col-md-3 col-lg-2"
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
            className="document-container col-xs-6 col-sm-4 col-md-3 col-lg-2"
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
      <div className="document-container col-xs-6 col-sm-4 col-md-3 col-lg-2">
        <div
          className="document fixed"
          title={document.name}
          onClick={
            () => {
              browserHistory.push(`/document/${document._id}`);
            }
          }
        >
          {
            FileManagerLayout.renderDocumentTypeImg(document.fileType)
          }
          <p className="col-xs-9 document-title truncate">
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
            callback: (error, result) => {
              if(error) {
                this.props.toggleError({
                  type: 'show',
                  body: 'Error al borrar el documento',
                });
                self.setState({
                  loadingDocuments: false,
                });
              }
            },
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
        {
          (this.state.loadingDocuments || this.state.loadingFolders) ? (
            <div className="loading">
              <div className="loader"></div>
            </div>
          ) : (null)
        }
        <div className='file-manager ui-widget-content'>
          {
            // Create document modal
          }
          <div
            className="modal fade"
            id="create-document"
            tabIndex="-1"
            role="dialog"
            aria-labelledby="myModalLabel"
          >
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
                      callback: (error, result) => {
                        if (error) {

                        } else {
                          $('#create-document').modal('hide');
                        }
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
                  <button
                    type="button"
                    className="btn btn-default"
                    data-dismiss="modal"
                  >
                    Cancelar
                  </button>
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
            // Upload photos and videos modal
          }
          <div
            className="modal fade"
            id="upload-files"
            tabIndex="-1"
            role="dialog"
            aria-labelledby="myModalLabel"
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                  <h4 className="modal-title" id="myModalLabel">Subir foto o video</h4>
                </div>
                <div className="modal-body">
                  <div className="form-group name">
                    <label htmlFor="file">Seleccionar imagen o video para subir</label>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      className="form-control"
                      id="file"
                      placeholder="Seleccionar imagen o video"
                      onChange={(e) => {
                        this.setState({
                          file: e.target.files[0],
                        });
                      }}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-default"
                    data-dismiss="modal"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={this.props.uploadFile.bind(this, {
                        file: this.state.file,
                        parentFolderId: this.props.folderId,
                        diamondCloudDriveFolderId: this.props.diamondCloudDriveFolderId,
                        callback(error, result) {
                        if(error) {
                          this.props.toggleError({
                            type: 'show',
                            body: 'Error al subir la imagen/video',
                          });
                        } else {
                          $('#upload-files').modal('hide');
                        }
                        },
                      })
                    }
                  >
                    Subir
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className='folder-navbar'>
            {
              (this.props.folderId) ?
                (
                  <div
                    className="go-back"
                    onClick={browserHistory.goBack}
                  />
                ) : (null)
            }
            {
              (this.props.openedDocumentId) ?
                (
                  <div
                    className="drive-navbar-btn back-document"
                    onClick={
                      () => {
                        browserHistory.push(`/document/${this.props.openedDocumentId}`);
                      }
                    }
                  >
                    Volver al documento
                  </div>
                ) : (null)
            }
          </div>
          {
            (this.props.loadingDocuments || this.props.loadingFolders) ?
              (
                <div className="loading">
                  <div className="loader"></div>
                </div>
              ) : (
                <div className="container-fluid files-container">
                  <p className="folders-title-container">
                    Carpetas
                  </p>
                  <hr className="divider" />
                  <div className="folders-container">
                    {
                      this.renderFolders()
                    }
                  </div>
                  <p className="documents-title-container">
                    Archivos
                  </p>
                  <hr className="divider" />
                  <div className="documents-container">
                    {
                      this.renderDocuments()
                    }
                  </div>
                </div>
              )
          }
          <div className="create">
            <div
              className="img"
              data-toggle="modal"
              data-target="#create-document"
              title='Crear documento'
            />
            <div className="options">
              <div
                className="option drive"
                id="import-file"
                title="Importar de drive"
              />
              <div
                className="option folder"
                data-toggle="modal"
                data-target="#create-folder"
                title='Crear carpeta'
                >
              </div>
              <div
                className="option upload"
                id="upload-files"
                data-toggle="modal"
                data-target="#upload-files"
                title="Subir foto o video"
              />
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
  uploadFile: React.PropTypes.func.isRequired,
  initPicker: React.PropTypes.func.isRequired,
  diamondCloudDriveFolderId: React.PropTypes.string.isRequired,
  openedDocumentId: React.PropTypes.string.isRequired,
};

class FileManagerPage extends React.Component {
  /**
   * Inserts a file in module storage, and in rootFiles if necessary
   * @param {String} id
   * @param {String} name
   * @param {String} fileType
   * @param {String} parentFolderId (optional)
   * @param {String} isImported (optional)
   * @return {Promise} promise
   */
  static insertFileInStorage({ id, name, fileType, parentFolderId = null, isImported = false }) {
    function insertDocumentInStorage() {
      return new Promise((fulfill, reject) => {
        DiamondAPI.insert({
          // Depending on the type of file, insert it in folders or documents
          collection: (fileType === folderMimeType) ? 'folders' : 'documents',
          object: {
            _id: id,
            parentFolderId,
            name,
            fileType,
            isImported,
          },
          isGlobal: true,
          callback(error, result) {
            if (error) {
              reject(error);
            } else {
              fulfill(result);
            }
          },
        });
      });
    }
    function insertDocumentInRootFiles() {
      return new Promise((fulfill, reject) => {
        DiamondAPI.insert({
          collection: 'rootFiles',
          object: {
            documentId: id, // resp is the response to the create
                                        // request, not to the permission one
            boardId: DiamondAPI.getCurrentBoard()._id,
          },
          isGlobal: true,
          callback(error, result) {
            if (error) {
              reject(error);
            } else {
              fulfill(result);
            }
          },
        });
      });
    }
    if (!parentFolderId) {
      return new Promise((fulfill, reject) => {
        insertDocumentInRootFiles()
          .then(() => insertDocumentInStorage(), reject)
          .then(fulfill, reject);
      });
    }
    return new Promise((fulfill, reject) => {
      insertDocumentInStorage()
      .then(fulfill, reject);
    });
  }
  /**
   * Returns if the current user is the drive owner of certain folder
   * @param {String} folderId
   * @param {String} fileType
   * @param {Function} callback (optional)
   *   @param {String} error
   *   @param {Boolean} response
   */
  static isUserOwnerOfFolder(folderId, callback) {
    DiamondAPI.get({
      collection: 'folders',
      filter: {
        _id: folderId,
      },
      callback(error, result) {
        if (error) {
          callback(error);
          return;
        }
        callback(null, result[0].ownerId === DiamondAPI.getCurrentUser);
      },
    });
  }

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

      subscriptions: [], /** Array that stores the rootFiles,
                          *  folders and documents subscriptions
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
        uploadFile={this.uploadFile}
        initPicker={this.initPicker}
        diamondCloudDriveFolderId={this.state.diamondCloudDriveFolderId}
        openedDocumentId={this.props.openedDocumentId}
        toggleError={this.props.error}
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
    this.state.subscriptions.forEach((subscription) => {
      subscription.stop();
    });
    this.setState({
      subscriptions: [],
    });
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
      console.error(error); // TODO: handle error
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
          console.error(error); // TODO: handle error
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
    const self = this;
    let subscriptions = [];

    // Get the files of the current folder

    const getFiles = ({ parentFolderId = null, foldersIds = [], documentsIds = [] }) => {
      if (foldersIds.length !== 0 || parentFolderId) {
        subscriptions.push(DiamondAPI.subscribe({
          collection: 'folders',
          filter: (parentFolderId) ? { // if we are not in the root folder
            parentFolderId,
          } : { // If we are in the root folder
            _id: {
              $in: foldersIds,
            },
          },
          callback(err, res) {
            if (err) {
              console.error(err);
            } else {
              self.setState({
                loadingFolders: false,
                folders: res,
              });
            }
          },
        }));
      } else {
        self.setState({
          loadingFolders: false,
          folders: [],
        });
      }

      if (documentsIds.length !== 0 || parentFolderId) {
        subscriptions.push(DiamondAPI.subscribe({
          collection: 'documents',
          filter: (parentFolderId) ? { // if we are not in the root folder
            parentFolderId,
          } : { // If we are in the root folder
            _id: {
              $in: documentsIds,
            },
          },
          callback(err, res) {
            if (err) {
              console.error(err);
            } else {
              self.setState({
                loadingDocuments: false,
                documents: res,
              });
            }
          },
        }));
      } else {
        self.setState({
          loadingDocuments: false,
          documents: [],
        });
      }

      this.setState({
        subscriptions,
      });
    };

    ////////////////////////////////////////
    // Check if we are in the root folder //
    ////////////////////////////////////////

    if (!folderId) {
      //////////////////////////////////////////////////////////
      // Get the list of folders and documents in root folder //
      //////////////////////////////////////////////////////////

      subscriptions.push(DiamondAPI.subscribe({
        collection: 'rootFiles',
        filter: {
          boardId: DiamondAPI.getCurrentBoard()._id,
        },
        callback(err, res) {
          if (err) {
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
      }));
    } else {
      // we are not in the root folder
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
    const self = this;
    self.setState({
      loadingDocuments: true,
    });
    if (!diamondCloudDriveFolderId) {
      this.props.toggleError({
        type: 'show',
        body: 'Error al crear el documento',
      });
      self.setState({
        loadingDocuments: false,
      });
      callback('diamondCloudDriveFolderId is not defined');
      return;
    }
    if(name === '') {
      this.props.toggleError({
        type: 'show',
        body: 'No se puede crear un documento sin titulo',
      });
      self.setState({
        loadingDocuments: false,
      });
      callback('name is empty');
      return;
    }
    function createDocumentInDrive(isOwner) {
      return gapi.client.drive.files.create({
        resource: {
          name,
          mimeType: fileType,
          // Create the document inside the parent folder if it exists
          parents: (isOwner) ?
                     ([parentFolderId || diamondCloudDriveFolderId])
                     : [diamondCloudDriveFolderId],
        },
      });
    }
    function createDrivePermission(resp) {
      // Make the document editable to everyone with the link
      return gapi.client.drive.permissions.create({
        fileId: resp.result.id,
        role: 'writer',
        type: 'anyone',
      });
    }
    if (parentFolderId) {
      // Check if user is owner of current folder
      FileManagerPage.isUserOwnerOfFolder(parentFolderId, (error, result) => {
        if (error) {
          self.setState({
            loadingDocuments: false,
          });
          callback(error);
          return;
        }
        let id;
        createDocumentInDrive(result)
          .then((response) => {
            id = response.result.id;
            return createDrivePermission(response);
          }, (_error) => {
            self.setState({
              loadingDocuments: false,
            });
            callback(_error);
          })
          .then(() => FileManagerPage.insertFileInStorage({
            id,
            name,
            fileType,
            parentFolderId,
          }), (_error) => {
            self.setState({
              loadingDocuments: false,
            });
            callback(_error);
          })
          .then((_result) => {
            self.setState({
              loadingDocuments: false,
            });
            callback(null, _result);
          }, (_error) => {
            self.setState({
              loadingDocuments: false,
            });
            callback(_error);
          });
      });
    } else {
      let id;
      createDocumentInDrive()
        .then((response) => {
          id = response.result.id;
          return createDrivePermission(response);
        }, (_error) => {
          self.setState({
            loadingDocuments: false,
          });
          callback(_error);
        })
        .then(() => FileManagerPage.insertFileInStorage({
          id,
          name,
          fileType,
          parentFolderId,
        }), (_error) => {
          self.setState({
            loadingDocuments: false,
          });
          callback(_error);
        })
        .then((_result) => {
          self.setState({
            loadingDocuments: false,
          });
          callback(null, _result);
        }, (_error) => {
          self.setState({
            loadingDocuments: false,
          });
          callback(_error);
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
    const self = this;
    // Check if there is a Diamond Cloud drive folder
    if (!diamondCloudDriveFolderId) {
      this.props.toggleError({
        type: 'show',
        body: 'Error al crear la carpeta',
      });
      self.setState({
        loadingDocuments: false,
      });
      callback('diamondCloudDriveFolderId is not defined');
      return false;
    }
    self.setState({
      loadingFolders: true,
    });
    if(name === "") {
      this.props.toggleError({
        type: 'show',
        body: 'No se puede crear una carpeta sin titulo',
      });
      self.setState({
        loadingDocuments: false,
      });
      callback('name is empty');
      return;
    }
    function createFolderInDrive(isOwner) {
      // Create the folder in Drive
      gapi.client.drive.files.create({
        resource: {
          name,
          mimeType: folderMimeType,
          parents: (isOwner) ?
                   [parentFolderId || diamondCloudDriveFolderId]
                   : [diamondCloudDriveFolderId],
        }
      }).then(handleCreatedFolder, (error) => {
        self.setState({
          loadingFolders: false,
        });
        callback(error);
      });
    }
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
              if (err) {
                self.setState({
                  loadingFolders: false,
                });
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
          ownerId: DiamondAPI.getCurrentUser()._id,
        },
        isGlobal: true,
        callback(error, result) {
          self.setState({
            loadingFolders: false,
          });
          callback(error, result);
        },
      });
    }
    if (parentFolderId) {
      FileManagerPage.isUserOwnerOfFolder(parentFolderId, (error, result) => {
        if (error) {
          callback(error);
          return;
        }
        createFolderInDrive(result);
      });
    } else {
      createFolderInDrive();
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
    const self = this;
    self.setState({
      loadingFolders: true,
    });
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
        if (id && !isImported) {
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

  /**
   * uploadFile: Uploades a file to drive
   * @param {File} file
   * @param {String} parentFolderId (optional)
   * @param {String} diamondCloudDriveFolderId
   * @param {Function} callback (optional)
   *   @param {String} error
   *   @param {Object} response
   */
  uploadFile({ file, parentFolderId = null, diamondCloudDriveFolderId, callback = () => {} }) {
    const self = this;
    self.setState({
      loadingFolders: true,
    });
    if(!file) {
      this.props.toggleError({
        type: 'show',
        body: 'No se ha elegido la imagen/video',
      });
      self.setState({
        loadingFolders: false,
      });
      return;
    }
    /**
   * Insert new file.
   *
   * @param {File} fileData File object to read data from.
   * @param {Function} callback Function to call when the request is complete.
   */
    function insertFileToDrive(fileData, _callback = () => {}) {
      const boundary = '-------314159265358979323846';
      const delimiter = "\r\n--" + boundary + "\r\n";
      const close_delim = "\r\n--" + boundary + "--";

      let reader = new FileReader();
      reader.readAsBinaryString(fileData);
      reader.onload = function (e) {
        const contentType = fileData.type || 'application/octet-stream';
        const metadata = {
          title: fileData.name,
          mimeType: contentType,
          parents: [{ id: diamondCloudDriveFolderId }], // TODO: add parentFolderId
        };
        console.log("metadata: ", metadata);

        const base64Data = btoa(reader.result);
        const multipartRequestBody =
            delimiter +
            'Content-Type: application/json\r\n\r\n' +
            JSON.stringify(metadata) +
            delimiter +
            'Content-Type: ' + contentType + '\r\n' +
            'Content-Transfer-Encoding: base64\r\n' +
            '\r\n' +
            base64Data +
            close_delim;

        const request = gapi.client.request({
          path: '/upload/drive/v2/files',
          method: 'POST',
          params: { uploadType: 'multipart' },
          headers: {
            'Content-Type': `multipart/mixed; boundary="${boundary}"`,
          },
          body: multipartRequestBody
        });
        request.execute(_callback);
      };
    }
    insertFileToDrive(file, (result) => {
      FileManagerPage.insertFileInStorage({
        id: result.id,
        name: file.name,
        fileType: file.type,
        parentFolderId,
      })
        .then((_result) => {
          self.setState({
            loadingFolders: false,
          });
          callback(null, _result);
        }, (_error) => {
          self.setState({
            loadingFolders: false,
          });
          callback(_error);
        });
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

class FileViewerLayout extends React.Component {
  render() {
    if (this.props.loading) {
      return (
        <div className="loading">
          <div className="loader"></div>
        </div>
      );
    }
    let url = `https://drive.google.com/open?id=${this.props.id}`;
    return (
      <div>
        <div className='drive-navbar'>
          <i
            className="go-back"
            onClick={ () => { browserHistory.push('/folder') } }
          />
          <p className='file-name truncate' title={this.props.fileName}>{this.props.fileName}</p>
          {
            (this.props.fileType === 'application/vnd.google-apps.presentation') ?
            (<i
              className="drive-navbar-btn presentate"
              onClick={() => { browserHistory.push(`/presentation/${this.props.id}`) }}
            >
              Iniciar presentación
            </i>) :
            (null)
          }
        </div>
        {
          (this.props.fileType.indexOf('image') !== -1 || this.props.fileType.indexOf('video') !== -1) ?
          (
          <div className="content-container">
            <div className="image-container">
              <div className="photo" />
              <p className="image-text">
                Para poder acceder a la imagen/video hace click <a href={url} target="_blank">acá</a>
              </p>
          </div>
        </div>
          ) : (
            <iframe
              src={url}
              style={
                {
                  width: '100%',
                  height: 'calc(100% - 42px)'
                }
              }
            />
          )
        }
      </div>
    );
  }
}

FileViewerLayout.propTypes = {
  id: React.PropTypes.string.isRequired,
  fileType: React.PropTypes.string.isRequired,
  loading: React.PropTypes.string.isRequired,
  fileName: React.PropTypes.string.isRequired,
};

class PresentationPage extends React.Component {
  render() {
    return (
      <div>
        <div className='drive-navbar'>
          <i
            className="go-back"
            onClick={ () => { browserHistory.push('/folder') } }
          />
          <p className='file-name truncate' title={this.props.fileName}>{this.props.fileName}</p>
          <i
            className="drive-navbar-btn presentate"
            onClick={() => { browserHistory.push(`/document/${this.props.params.id}`) }}
          >
            Volver a edición
          </i>
        </div>
        <iframe
          src={`https://docs.google.com/presentation/d/${this.props.params.id}/preview`}
          style={
            {
              width: '100%',
              height: 'calc(100% - 42px)'
            }
          }
        />
      </div>
    );
  }
}

/**
 * In case of error show this component.
 */
class ErrorMessage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.close = this.close.bind(this);
  }

  componentDidMount() {
    setTimeout(this.close.bind(null), this.props.delay);
  }

  close() {
    const self = this;

    $('.error-message').removeClass('show-error');
    $('.error-message').addClass('hide-error', () => {
      setTimeout(self.props.error.bind(null, { type: 'hide' }), 700);
    });
  }

  render() {
    return (
      <div className="error-message show-error">
        <div className="error-body">{this.props.body}</div>
        <div className="error-close" onClick={this.close}>Cerrar</div>
      </div>
    );
  }
}

ErrorMessage.propTypes = {
  body: React.PropTypes.string.isRequired,
  delay: React.PropTypes.number.isRequired,
  showing: React.PropTypes.bool.isRequired,
};

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path='/' component={Index}>
      <Route path='/folder' component={FileManagerPage} />
      <Route path='/folder/:folderId' component={FileManagerPage} />
      <Route path='/document/:documentId' component={FileViewerPage} />
      <Route path='/presentation/:id' component={PresentationPage} />
    </Route>
  </Router>,
  document.getElementById('render-target')
);

/**
 * Check if current user has authorized this application.
 */
function checkAuth(callback = () => {}, i = 0) {
  if (i < 5) {
    if (gapi.auth) {
      const SCOPES = [
        'https://www.googleapis.com/auth/drive',
      ];
      gapi.auth.authorize({
        client_id: CLIENT_ID,
        scope: SCOPES.join(' '),
        immediate: true,
      }, (authResult) => {
        if (authResult) {
          authObject = authResult;
          gapi.client.load('drive', 'v3', callback);
        } else {
          setTimeout(() => {
            checkAuth(callback, i + 1);
          }, 100);
        }
      });
    } else {
      setTimeout(() => {
        checkAuth(callback, i + 1);
      }, 100);
    }
  } else {
    console.error('Google API did not load properly. Reload or try later.');
  }
}
