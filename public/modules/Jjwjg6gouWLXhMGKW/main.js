var teamData;
var subscriptions = [];
var INTERVAL = 2000,
    TIMEOUT;


window.onload = () => {
  console.log('Module loaded, grabbing data...');

  getData('postIt', {}, (error, result) => {
    console.log('Grabbed data...');
    if(!result) {
      insertStartupData((error, result) => {
        console.log('Inserted new data since there was none...');
      });
    } else {
      console.log('Found data, handling it to the inputs...');
      let postIt = result[0];
      handleNewData(postIt);
    }
  });

  let subscription = subscribe('postIt', (data) => {
    console.log('Subscribed, new data incoming...', data);
    handleNewData(data.postIt[0]);
  });
  
  subscriptions.push(subscription);
  
  teamData = getTeamData();
  console.log('Got team data...', teamData);

};
window.onresize = () => {
  console.log('Resized module...');
};

// API methods
function insertStartupData(callback) {
  DiamondAPI.insert({
    collection: 'postIt',
    obj: {
      title: '',
      description: '',
    },
    visibleBy: [],
    callback,
  });
}
function getData(collection, filter, callback) {
  DiamondAPI.get({
    collection,
    filter,
    callback,
  });
}
function updateData(collection, filter, updateQuery) {
  DiamondAPI.update({
    collection,
    filter,
    updateQuery,
  });
}
function subscribe(collection, callback) {
  return DiamondAPI.subscribe({
    request: {
      collection,
    },
    callback,
  });
}
function unsubscribe(subscriptionId) {
  DiamondAPI.unsubscribe(subscriptionId);
}
function getTeamData() {
  return DiamondAPI.getTeamData();
}

// Module methods
function updateInput(e, which) {
  clearTimeout(TIMEOUT);
  /*
   * You can pass arguments to the function inside setTimeout
   * using Function.prototype.bind()
   * https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/Function/bind
   */
  TIMEOUT = setTimeout(
    updateData.bind(null, 'postIt', {}, {
      $set: {
        [which]: e.value,
      }
    }), INTERVAL);
}
function handleNewData(data) {
  if (needsData('title', data.title)) {
    pushData('title', data.title);
  }
  if (needsData('description', data.description)) {
    pushData('description', data.description);
  }

  function needsData(e, value) {
    let elem = document.getElementById(e);
    if (elem.value === value) {
      return false;
    }
    return true;
  }
  function pushData(e, value) {
    let elem = document.getElementById(e);
    elem.value = value;
  }
}
