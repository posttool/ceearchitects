
exports = module.exports = {
  config: require('./config'),
  models: require('./models'),
  workflow: require('../modules/postera/workflow'),
  permissions: require('../modules/postera/permission'),
  app: require('./app')
};

if (process.argv.length > 2 && process.argv[2] == 'admin') {
  var utils = require('../../currentcms/lib/utils');
  switch (process.argv[2]) {
    case 'admin':
      utils.create_admin(module.exports);
      break;
    case 'start':
      utils.start_server(module.exports);
      break;
  }
}
