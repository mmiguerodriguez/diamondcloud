window.onload = () => {
  console.log('Module loaded, grabbing data...');
  getData((error, result) => {
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
};
window.onresize = () => {
  console.log('Resized module...');
};

window.DiamondAPI.subscribe({
  request: {
    collection: 'postIt',
  },
  callback(data) {
    console.log('Subscribed, new data incoming...', data);
  }
});

//TODO: Remove this once subscription is ready
/*
window.setInterval(() => {
  getData((error, result) => {
    if(result) {
      let postIt = result[0]; // [{ _id, title, description }]
      handleNewData(postIt);
    }
  });
}, 2000);
*/

// First insert data
function insertStartupData(callback) {
  window.DiamondAPI.insert({
    collection: 'postIt',
    obj: {
      title: '',
      description: '',
    },
    visibleBy: [],
    callback,
  });
}

// API methods
function getData(callback) {
  window.DiamondAPI.get({
    collection: 'postIt',
    filter: {},
    callback,
  });
}
function updateData(object) {
  window.DiamondAPI.update(object);
}

// Module methods
function updateInput(e, which) {
  updateData({
    collection: 'postIt',
    filter: {},
    updateQuery: {
      $set: {
        [which]: e.value,
      }
    }
  });
}
function handleNewData(data) {
  pushData('title', data.title);
  pushData('description', data.description);

  function pushData(e, value) {
    document.getElementById(e).value = value;
  }
}
