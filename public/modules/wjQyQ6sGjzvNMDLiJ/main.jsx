// File Manager

// Google Drive API
let CLIENT_ID = '624318008240-lkme1mqg4ist618vrmj70rkqbo95njnd.apps.googleusercontent.com';

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
  constructor(props) {
    super(props);

    this.state = {
      name: '',
    };
  }
  
  renderFolders() {

  }

  render() {
    return (
      <div>
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
    </div>
    );
  }
  
  handleChange(event) {
    this.setState({
       name: event.target.value,
    });
  }
}

class FileManagerPage extends React.Component {
  renderFolders() {

  }

  render() {
    if (this.props.loading) return null;
    return (
      <FileManagerLayout folders={ this.props.folders } documents={ this.props.documents } CreateDocument={ this.CreateDocument } />
    );
  }

  componentDidMount() {
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
        console.error(err);
        console.log('newData:', res);
        res[0].files.forEach((file) => {
          console.log(file);
          if (file.documentId) {
            let subHandle = DiamondAPI.get({
              collection: 'documents',
              filter: {
                _id: file.documentId
              },
              callback: (err, res) => {
                console.log('doc got:', res);
                obj.documents.push(res);
              }
            });
            obj.loading = obj.loading || !subHandle.ready();
          } else if (file.folderId) {
            console.log(file.folderId);
            let subHandle = DiamondAPI.get({
              collection: 'folders',
              filter: {
                _id: file.folderId
              },
              callback: (err, res) => {
                console.log('folder got:', res);
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
      ...this.props,
    };
    checkAuth(); // configure google drive api
  }
  createDocument({ name, fileType, callback }) {
    /**
     * callback(err, res)
     * fileType is the mimeType of the file
     * https://developers.google.com/drive/v3/web/mime-types
     */
    gapi.client.drive.files.create({
      resource: {
        name,
        mimeType: fileType,
      }
    }).then(function(resp) {
      callback(null, resp);
    }, function(reason) {
      callback(reason, resp);
    });
  }
}

ReactDOM.render(
  <FileManagerPage />,
  document.getElementById('container')
);

/**
 * Check if current user has authorized this application.
 */
function checkAuth() {

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
}

function initPicker() { // https://gist.github.com/Daniel15/5994054#file-filepicker-js
	let picker = new FilePicker({
		apiKey: 'PUT_YOUR_API_KEY_HERE',
		clientId: CLIENT_ID,
		buttonEl: document.getElementById('pick'),
		onSelect: function(file) {
			console.log(file);
			alert('Selected ' + file.title);
		}
	});	
}