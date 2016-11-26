const fs = require('fs');

const readFile = moduleId => (
  new Promise((fulfill, reject) => {
    fs.readFile(`modules/${moduleId}/config.json`, 'utf8', (err, res) => {
      if (err) {
        reject(err);
      } else {
        fulfill(JSON.parse(res));
      }
    });
  })
);

export default readFile;
