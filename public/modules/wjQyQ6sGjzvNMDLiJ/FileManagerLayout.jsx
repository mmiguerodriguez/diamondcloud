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
                <p className="truncate">Doc Name</p>
                <div className="preview"></div>
              </div>
              <div className="document">
                <p className="truncate">Doc Name</p>
                <div className="preview"></div>
              </div>
            </div>
          </div>
    		</div>
    		<div className="create fixedActionBtn"></div>
    	</div>
    );
  }
}
