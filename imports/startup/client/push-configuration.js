Push.Configure({
  android: {
    senderID: Meteor.settings.public.gcm.projectNumber,
  },
  badge: true,
  sound: true,
  alert: true,
  vibrate: true,
  production: true,
});

if (Meteor.isCordova){
    Push.debug = true;
    alert('Push.id', Push.id(), typeof Push.id());

    Push.addListener('register', function(evt) {
        // Platform specific event - not really used
        alert('register event', JSON.stringify(evt));
    });

    Push.addListener('startup', function(notification) {
        alert('startup', JSON.stringify(notification));
    });

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
