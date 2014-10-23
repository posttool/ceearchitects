
exports = module.exports = {
  config: require('./config'),
  models: require('./models'),
  workflow: require('./workflow'),
  permissions: require('./permission'),
  app: require('./app')
};

if (process.argv.length > 2) {
  var utils = require('../currentcms/lib/utils');
  switch (process.argv[2]) {
    case 'admin':
      utils.create_admin(module.exports);
      break;
    case 'start':
      utils.start_server(module.exports);
      break;
  }
}
