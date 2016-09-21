Push.Configure({
  gcm: {
    projectNumber: 624318008240,
  },
  android: {
    senderID: 624318008240,
  },
  badge: true,
  sound: true,
  alert: true,
  vibrate: true,
  production: true,
});

if (Meteor.isCordova){
    Push.debug = true;

    Push.addListener('token', function(token) {
        alert('(Test) Push token received: ' + JSON.stringify(token));
    });

    Push.addListener('error', function(err) {
        alert('(Test) Push error: ' + JSON.stringify(err));
    });

    Push.addListener('message', function(notification) {
        alert('(Test) Push message: '+ notification.message);
    });

    Push.addListener('alert', function(notification) {
        alert('(Test) Push alert: '+ notification.message);
    });
} else {
    console.warn('NOT registering Push events');
}
