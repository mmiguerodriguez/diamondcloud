// File Manager

class FileManagerLayout extends React.Component {
  renderFolders() {

  }

  render() {
    return (
      <div id='resizable' className='file-manager ui-widget-content'>
        <div className="container-fluid files-container">
          <p className="folders-title-container">
            Carpetas
          </p>
          <hr className="divider" />
          <div className="folders-container">
            <div className="col-xs-4 fixed">
              <div className="folder">
                <p className="truncate">Diamond Cloud</p>
              </div>
            </div>
          </div>
          <p className="documents-title-container">
            Archivos
          </p>
          <hr className="divider" />
          <div className="documents-container">
            <div className="col-xs-4 fixed">
              <div className="document">
                <p className="truncate">Soy un documento</p>
                <div className="preview"></div>
              </div>
            </div>
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
  renderFolders() {

  }

  render() {
    if (this.props.loading) return null;
    return (
      <FileManagerLayout folders={ this.props.folders } documents={ this.props.documents } />
    );
  }

  constructor(props) {
    super(props);
    let obj = {
      folders: [],
      documents: [],
      loading: false,
    };

    const handle = DiamondAPI.subscribe({
      request: {
        collection: 'files',
        condition: {
          $eq: ['$$element.boardId', DiamondAPI.getCurrentBoard()._id],
        }
      },
      callback: (err, res) => {
        res.files.forEach((file) => {
          if (file.documentId) {
            let subHandle = DiamondAPI.get({
              collection: 'documents',
              filter: {
                _id: file.documentId
              },
              callback: (err, res) => {
                obj.documents.push(res);
              }
            });
            obj.loading = obj.loading || !subHandle.ready();
          } else if (file.folderId) {
            let subHandle = DiamondAPI.get({
              collection: 'folders',
              filter: {
                _id: file.folderId
              },
              callback: (err, res) => {
                obj.folders.push(res);
              }
            });
            obj.loading = obj.loading || !subHandle.ready();
          }
        });
      }
    });

    obj.loading = obj.loading || !handle.ready();
    this.props = {
      ...obj,
      ...props,
    };
  }
}

ReactDOM.render(
  <FileManagerPage />,
  document.getElementById('container')
);
