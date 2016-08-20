var DiamondAPI;

DiamondAPI.subscribe = (moduleInstanceId, obj, callback) => {
  // Validation.
  let validation = typeof obj.collection == 'string';
  validation = validation && typeof obj.condition == 'object';
  validation = validation && (typeof callback == 'function' || typeof callback == 'undefined');
  if (validation) {
    // Subscribe to data
    Meteor.subscribe('moduleInstances.data', moduleInstanceId, obj, {
      onReady: callback,
      onError: (err) => {
        throw console.error('Error while subscribing.', err);
      },
    });
  } else throw console.error('The provided data is wrong.');
};

window.DiamondAPI = DiamondAPI;
