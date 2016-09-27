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

      /*<div id='resizable' className='file-manager ui-widget-content'>
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
        </div>*/
  render() {
    return (
      <div>
        <div id="authorize-div" style={{display: 'none'}}>
          <span>Authorize access to Drive API</span>
          {/*Button for the user to click to initiate auth sequence*/}
          <button id="authorize-button" onClick={handleAuthClick.bind(null, event)}>{/*TODO: make this work*/}
            Authorize
          </button>
        </div>
        <pre id="output"></pre>
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

  componentDidMount() {
    console.log('cachin barin de don pinguin');
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
  }
}

ReactDOM.render(
  <FileManagerPage />,
  document.getElementById('container')
);

let CreateDocument = () => {
  
};

var CLIENT_ID = '<YOUR_CLIENT_ID>';

var SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly'];

/**
 * Check if current user has authorized this application.
 */
function checkAuth() {
  gapi.auth.authorize(
    {
      'client_id': CLIENT_ID,
      'scope': SCOPES.join(' '),
      'immediate': true
    }, handleAuthResult);
}

/**
 * Handle response from authorization server.
 *
 * @param {Object} authResult Authorization result.
 */
function handleAuthResult(authResult) {
  var authorizeDiv = document.getElementById('authorize-div');
  if (authResult && !authResult.error) {
    // Hide auth UI, then load client library.
    authorizeDiv.style.display = 'none';
    loadDriveApi();
  } else {
    // Show auth UI, allowing the user to initiate authorization by
    // clicking authorize button.
    authorizeDiv.style.display = 'inline';
  }
}

/**
 * Initiate auth flow in response to user clicking authorize button.
 *
 * @param {Event} event Button click event.
 */
function handleAuthClick(event) {
  gapi.auth.authorize(
    {client_id: CLIENT_ID, scope: SCOPES, immediate: false},
    handleAuthResult);
  return false;
}

/**
 * Load Drive API client library.
 */
function loadDriveApi() {
  gapi.client.load('drive', 'v3', listFiles);
}

/**
 * Print files.
 */
function listFiles() {
  var request = gapi.client.drive.files.list({
      'pageSize': 10,
      'fields': "nextPageToken, files(id, name)"
    });

    request.execute(function(resp) {
      appendPre('Files:');
      var files = resp.files;
      if (files && files.length > 0) {
        for (var i = 0; i < files.length; i++) {
          var file = files[i];
          appendPre(file.name + ' (' + file.id + ')');
        }
      } else {
        appendPre('No files found.');
      }
    });
}

/**
 * Append a pre element to the body containing the given message
 * as its text node.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
  var pre = document.getElementById('output');
  var textContent = document.createTextNode(message + '\n');
  pre.appendChild(textContent);
}