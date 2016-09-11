export let Notifications = {
  askPermission() {
    Notification.requestPermission((permission) => {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        let notification = new Notification("Genial!", {
          icon: 'http://diamondcloud.tk/img/logo.ico',
        });
      }
      this.props.close();//close notifications permission asker
    });
  },

  sendNotification({ body,icon,title }) {
    if (Notification.permission === "granted") {
      icon = icon || 'http://diamondcloud.tk/img/logo.ico';
      var notification = new Notification("Hi there!", { body, icon });
    }
  },
};
