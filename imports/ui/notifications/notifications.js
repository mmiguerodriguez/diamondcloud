const Notifications = {
  askPermission() {
    Notification.requestPermission((permission) => {
      // If the user accepts, let's create a notification
      if (permission === 'granted') {
        Notifications.sendNotification({
          title: 'Genial!',
        });
      }
      this.props.close();
    });
  },
  sendNotification({ body, icon = 'https://diamondcloud.tk/img/notifications-icon.ico', title, timeout = 5000, onclick = () => { window.focus(); } }) {
    if (Notification.permission === 'granted') {
      const notification = new Notification(title, { body, icon });

      notification.onclick = onclick;
      setTimeout(notification.close.bind(notification), timeout);

      return notification;
    }

    return false;
  },
};

export default Notifications;
