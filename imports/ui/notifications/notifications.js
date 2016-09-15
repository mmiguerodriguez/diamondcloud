export let Notifications = {
  askPermission() {
    Notification.requestPermission((permission) => {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        let notification = Notifications.sendNotification({
          title: 'Genial!'
        });
      }
      this.props.close();//close notifications permission asker
    });
  },

  sendNotification({ body, icon, title, timeout, onclick }) {
    if (Notification.permission === "granted") {
      icon = icon || 'http://diamondcloud.tk/img/logo.ico';
      timeout = timeout || 5000;
      onclick = onclick || (() => {
        window.focus();
      });
      let notification = new Notification(title, { body, icon });
      notification.onclick = onclick;
      setTimeout(notification.close.bind(notification), timeout);
      return notification;
    }
  },
};
