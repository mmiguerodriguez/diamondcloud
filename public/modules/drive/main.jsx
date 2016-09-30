// File Manager

const { React, ReactDOM, ReactRouter, classNames } = window;
const { Router, Route, IndexRoute, browserHistory } = ReactRouter;

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

browserHistory.push('/');

class FileManagerLayout extends React.Component {
  getDocumentName(document) {
    return document._id;
  }
  
  openDocument(link) {
    // TODO: Make an option to return to file manager
    window.location = link;
  }
  
  renderFolders() {
    return this.props.folders.length > 0 ?
           (
             this.props.folders.map((folder) => {
               return (
                 <div className="col-xs-4 fixed">
                   <div className="folder">
                     <p className="truncate">{ folder.name }</p>
                   </div>
                 </div>
               );
             })
           ) :
           (
             <div>No hay carpetas</div>
           );
  }
  
  renderDocuments() {
    return this.props.documents.length > 0 ? (
      this.props.documents.map((document) => {
        return (
          <div className="col-xs-4 fixed">
            <div onClick={ this.openDocument.bind(this, document.link) } className="document">
              <p className="truncate">{ this.getDocumentName(document) }</p>
              <div className="preview"></div>
            </div>
          </div>
          );
        })
      ) : (
        <div>No hay carpetas</div>
    );
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
    console.log(this.state, this.state.loadingBalance);
    
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

  componentDidMount() {
    let self = this;
    
    let documents = self.state.documents;
    let folders = self.state.folders;
    
    const handle = DiamondAPI.subscribe({
      request: {
        collection: 'files',
        condition: {
          $eq: ['$$element.boardId', DiamondAPI.getCurrentBoard()._id],
        }
      },
      callback: (err, subRes) => {
        console.log(err, subRes);
        self.setState({
          loadingBalance: self.state.loadingBalance + 10 - subRes[0].files.length,
        });
        subRes[0].files.forEach((file) => {
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
        });
      }
    });
  }
}

ReactDOM.render(
  <Router history={ browserHistory }>
    <Route path='/' component={ FileManagerPage }>
      <Route path='/:folderId' component={ FileManagerPage }></Route>
    </Route>
  </Router>,
  document.getElementById('render-target')
);