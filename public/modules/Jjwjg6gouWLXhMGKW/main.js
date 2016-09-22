var teamData;
var subscriptions = [];

window.onload = () => {
  DiamondAPI.get({
    collection: 'postIt',
    filter: {},
    callback: (error, result) => {
      if (error) throw console.error(error);
      console.log('Grabbed data...');
      if(!result) {
        insertStartupData((error, result) => {
          if (!!error) throw console.error(error);
          console.log('Inserted new data since there was none...');
        });
      } else {
        handleNewData(result[0]);
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
      handleNewData(res.postIt[0]);
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

function updateInput(e, key) {
  console.log(key, e.value);
  DiamondAPI.update({
    collection: 'postIt',
    filter: {},
    updateQuery: {
      $set: {
        [key]: e.value
      }
    },
  });
}

function handleNewData(data) {
  pushData('title', data.title);
  pushData('description', data.description);

  function pushData(e, value) {
    let elem = document.getElementById(e);
    elem.value = value;
  }
}
