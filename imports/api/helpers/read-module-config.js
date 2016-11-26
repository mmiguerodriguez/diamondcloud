const fs = require('fs');
const path = require('path');

const readModuleConfig = (moduleId) => {
  const _path = path.join(process.cwd(), '../web.browser/app');

  return new Promise((resolve, reject) => {
    fs.readFile(`${_path}/public/modules/${moduleId}/config.json`, 'utf8', (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(JSON.parse(result));
      }
    });
  });
};

export default readModuleConfig;
