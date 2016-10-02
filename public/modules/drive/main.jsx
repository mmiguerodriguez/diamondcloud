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

  componentDidMount() {
    this.props.initPicker('import-file', (file) => {console.log(file)});
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
            <div
              className="option drive"
              id="import-file"
            ></div>
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

FileManagerLayout.propTypes = {
  folders: React.PropTypes.array.isRequired,
  documents: React.PropTypes.array.isRequired,
  createDocument: React.PropTypes.func.isRequired,
  initPicker: React.PropTypes.func.isRequired,
};

class FileManagerPage extends React.Component {
  renderFolders() {

  }

  render() {
    if (this.props.loading) {
      return null;
    } else {
      return (
        <FileManagerLayout
          folders={ this.props.folders }
          documents={ this.props.documents }
          createDocument={ this.createDocument }
          initPicker={ this.initPicker }
        />
      );
    }
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
     *  res: file
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
  <FileManagerPage />,
  document.getElementById('container')
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
      console.log(i);
      setTimeout(() => {
        checkAuth(i);
      }, 100);
    }
  } else {
    console.error('Google API did not load properly. Reload or try later.');
  }
}
