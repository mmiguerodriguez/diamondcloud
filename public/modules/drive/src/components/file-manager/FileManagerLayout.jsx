import React from 'react';
import { browserHistory } from 'react-router';

import { FOLDER_MIME_TYPE } from '../../helpers/driveApi';

class FileManagerLayout extends React.Component {
  static renderDocumentTypeImg(fileType) {
    switch (fileType) {
      case 'application/vnd.google-apps.document':
        return (
          <div
            className="col-xs-3 icon-type create-doc"
          />);
      case 'application/vnd.google-apps.drawing':
        return (
          <div
            className="col-xs-3 icon-type create-draw"
          />);
      case 'application/vnd.google-apps.spreadsheet':
        return (
          <div
            className="col-xs-3 icon-type create-sheet"
          />);
      case 'application/vnd.google-apps.presentation':
        return (
          <div
            className="col-xs-3 icon-type create-slides"
          />);

      default:
        // Check if the file is an image
        if(fileType.indexOf("image/") !== -1) {
          return (
            <div
              className="col-xs-3 icon-type create-img"
            />
          );
        // Check if the file is a video
        } else if (fileType.indexOf("video/") !== -1) {
          return (
            <div
              className="col-xs-3 icon-type create-video"
            />
          );
        // Return the default image
        } else {
          return (
            <div
              className="col-xs-3 icon-type create-doc"
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
    const self = this;
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
          data-toggle="tooltip"
          data-placement="bottom"
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
            mimeType: FOLDER_MIME_TYPE,
            isImported: folder.isImported,
            callback: (error, result) => {
              if (error) {
                this.props.toggleError({
                  type: 'show',
                  body: 'Hubo un error al eliminar la carpeta',
                });
              }

              this.setState({
                loadingFolders: false,
              });
            },
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
          data-toggle="tooltip"
          data-placement="bottom"
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
              if (error) {
                this.props.toggleError({
                  type: 'show',
                  body: 'Hubo un error al borrar el documento',
                });
              }

              this.setState({
                loadingFolders: false,
              });
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
    
    $('[data-toggle="tooltip"]').tooltip({
      container: 'body',
    });
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
              data-toggle="modal"
              data-target="#create-document"
            >
              <div
                className="img"
                title='Crear documento'
                data-toggle="tooltip"
                data-placement="left"
              />
            </div>
            <div className="options">
              <div
                id="import-file"
                className="option drive"
              >
                <div
                  title="Importar de drive"
                  data-toggle="tooltip"
                  data-placement="left"
                />
              </div>

              <div
                className="option folder"
                data-toggle="modal"
                data-target="#create-folder"
              >
                <div
                  title='Crear carpeta'
                  data-toggle="tooltip"
                  data-placement="left"
                />
              </div>

              <div
                className="option upload"
                data-toggle="modal"
                data-target="#upload-files"
              >
                <div
                  title="Subir foto o video"
                  data-toggle="tooltip"
                  data-placement="left"
                />
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
  uploadFile: React.PropTypes.func.isRequired,
  initPicker: React.PropTypes.func.isRequired,
  diamondCloudDriveFolderId: React.PropTypes.string.isRequired,
  openedDocumentId: React.PropTypes.string.isRequired,
};

export default FileManagerLayout;
