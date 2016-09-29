let teamData;
let subscriptions = [];
let TIMEOUT;
const INTERVAL = 1000;

window.onload = () => {
  DiamondAPI.get({
    collection: 'postIt',
    filter: {},
    callback: (error, result) => {
      if (error) throw error;
      console.log('Grabbed data...');
      if(!result) {
        insertStartupData((error, result) => {
          if (!!error) throw error;
          console.log('Inserted new data since there was none...');
          console.log(result);
        });
      } else {
        if(result.length > 0) {
          handleNewData(result[0]);
        }
      }
    },
  });

  let subscription = DiamondAPI.subscribe({
    request: {
      collection: 'postIt',
    },
    callback: (err, res) => {
      if (!!err) throw console.error(err);
      console.log('New data incoming...', res);

      if(res.postIt) {
        if(res.postIt.length > 0) {
          handleNewData(res.postIt[0]);
        }
      }
    },
  });

  subscriptions.push(subscription);
  teamData = DiamondAPI.getTeamData();
};

function insertStartupData(callback) {
  DiamondAPI.insert({
    collection: 'postIt',
    obj: {
      title: '',
      description: '',
    },
    callback,
  });
}

function updatePostIt(e, key) {
  clearTimeout(TIMEOUT);

  TIMEOUT = setTimeout(() => {
    DiamondAPI.update({
      collection: 'postIt',
      filter: {},
      updateQuery: {
        $set: {
          [key]: e.value
        }
      },
    });
  }, INTERVAL);
}

function handleNewData(data) {
  pushData('title', data.title);
  pushData('description', data.description);

  function pushData(e, value) {
    let elem = document.getElementById(e);
    elem.value = value;
  }
}
