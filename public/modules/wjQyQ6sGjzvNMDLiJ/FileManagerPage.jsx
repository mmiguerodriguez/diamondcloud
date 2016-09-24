/*
import FileManagerLayout     from './FileManagerLayout.jsx';

let DiamondAPI = window.DiamondAPI;

export default class FileManagerPage extends React.Component {
  renderFolders() {

  }

  render() {
    return (
      <FileManagerLayout folders={ this.props.folders } documents={ this.props.documents } />
    );
  }
}

export default FileManagerPageContainer = createContainer(() => {
  const handle = DiamondAPI.subscribe({
    request: {
      collection: 'docsList',
      condition: {
        _id: DiamondAPI.getTeamData(),
      }
    }
  });

  const loading = !handle.ready();

  return {
    loading,
    teams: Teams.find({}, { sort: { name: -1 } }).fetch(),
  };
}, Dashboard);
*/
