Push.debug = true;
Push.allow({
  send(userId, notification) {
    return true;
  }
});

export const Notifications = {
  send({ from, title, text, query }) {
    Push.send({
      from,
      title,
      text,
      query,
    });
  },
  sendAll({ from, title, text }) {
    Push.send({
      from,
      title,
      text,
      query: {},
    });
  },
};
