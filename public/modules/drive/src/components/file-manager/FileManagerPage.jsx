import React from 'react';
import checkAuth from '../../helpers/checkAuth';
import { FOLDER_MIME_TYPE, CLIENT_ID } from '../../helpers/driveApi';

import FileManagerLayout from './FileManagerLayout';

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
          collection: (fileType === FOLDER_MIME_TYPE) ? 'folders' : 'documents',
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
      q: `name = "${folderName}" and mimeType = "${FOLDER_MIME_TYPE}"`,
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
            mimeType: FOLDER_MIME_TYPE,
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
          mimeType: FOLDER_MIME_TYPE,
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
        if (mimeType === FOLDER_MIME_TYPE) {
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
          }).then((result) => {
            _callback(null, result);
          }, (error) => {
            _callback(error, null);
          });
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
              parentFolderId,
            },
            callback(error, response) {
              if (error) {
                _callback(error, response);
              } else {
                DiamondAPI.remove({
                  collection: 'documents',
                  filter: {
                    parentFolderId,
                  },
                  callback,
                });
              }
            }
          });
        } else {
          let collection = (mimeType === FOLDER_MIME_TYPE) ? 'folders' : 'documents';
          let filter = id ? { _id: id } : { parentFolderId };

          DiamondAPI.remove({
            collection,
            filter,
            callback: _callback,
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
       gapi,
  	});
  }
}

export default FileManagerPage;
