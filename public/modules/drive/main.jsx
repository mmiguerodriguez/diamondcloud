// File Manager

/*

DiamondAPI.insert({
  collection: 'files',
  obj: {
		boardId: DiamondAPI.getCurrentBoard()._id,
		files: [
			{
				documentId: "gmQ7JZMtMB2n8GnS2",
			},
			{
				documentId: "Hzt6gdcLjie6nBJ4L",
			},
			{
				folderId: "JJCrf9CYeBDMdeDRt"
			},
		]
	}
});

DiamondAPI.insert({
  collection: 'documents',
  obj: {
    _id: "gmQ7JZMtMB2n8GnS2",
		link: "https://docs.google.com/document/d/1-cOSVJNpVqjBObCqu-OfyqTDLoUB5is_29Pk0zAjINo/edit#"
  }
});

DiamondAPI.insert({
  collection: 'documents',
  obj: {
    _id: "Hzt6gdcLjie6nBJ4L",
		link: "https://docs.google.com/document/d/1-cOSVJNpVqjBObCqu-OfyqTDLoUB5is_29Pk0zAjINo/edit#"
  }
});

DiamondAPI.insert({
  collection: 'documents',
  obj: {
    _id: "n4ckjK9n4n9psGeDD",
		link: "https://docs.google.com/document/d/1-cOSVJNpVqjBObCqu-OfyqTDLoUB5is_29Pk0zAjINo/edit#"
  }
});

DiamondAPI.insert({
  collection: 'folders',
  obj: {
    _id: "JJCrf9CYeBDMdeDRt",
		name: "Pepinos",
		files: [
			{
				documentId: "n4ckjK9n4n9psGeDD",
			}
		]
  }
});

*/

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
  constructor(props) {
    super(props);
    
    this.state = {
      folders: [],
      documents: [],
      loading: true,
    };
  }
  renderFolders() {

  }

  render() {
    //if (this.state.loading) return null;
    return (
      <FileManagerLayout folders={ this.state.folders } documents={ this.state.documents } />
    );
  }

  componentDidMount() {
    console.log('Loading module...');
    
    /*
    
    TODO: Fix the loading
    
    */
    
    const handle = DiamondAPI.subscribe({
      request: {
        collection: 'files',
        condition: {
          $eq: ['$$element.boardId', DiamondAPI.getCurrentBoard()._id],
        }
      },
      callback: (err, res) => {
        console.log('Callback called');
        console.log('Error:', err, '- Res:', res);
        res[0].files.forEach((file) => {
          console.log('File:', file);
          if (file.documentId) {
            let subHandle = DiamondAPI.get({
              collection: 'documents',
              filter: {
                _id: file.documentId
              },
              callback: (err, res) => {
                console.log('Doc got:', res);
                this.state.documents.push(res);
              }
            });
            this.state.loading = this.state.loading && !subHandle.ready();
          } else if (file.folderId) {
            console.log(file.folderId);
            let subHandle = DiamondAPI.get({
              collection: 'folders',
              filter: {
                _id: file.folderId
              },
              callback: (err, res) => {
                console.log('Folder got:', res);
                this.state.folders.push(res);
              }
            });
            this.state.loading = this.state.loading || !subHandle.ready();
          }
        });
      }
    });

    this.state.loading = this.state.loading || !handle.ready();
    console.log('Loaded module');
  }
}

ReactDOM.render(
  <FileManagerPage />,
  document.getElementById('container')
);
