var express = require('express');
var nodemailer = require('nodemailer');
var _ = require('lodash');
var util = require('./util');


// serve express app
exports = module.exports = function(config, meta) {
  var app = express();
  app.set('view engine', 'ejs');
  app.set('views',__dirname + '/views');
  app.use(express.static(__dirname + '/public'));

  var Page = meta.model('Page');

  app.get('/favicon.ico', function(req, res, next){
    res.sendfile(__dirname + '/public/assets/favicon.ico');
  });

  app.get('/page', function (req, res, next) {
    util.getSiteMapData(Page, false, basic_page_view, function (err, site) {
      if (err) return next(err);
      res.json(site);
    });
  });

  app.post('/contact-email', function (req, res, next) {
    var transporter = nodemailer.createTransport();
    transporter.sendMail({
      from: req.body.from,
      to: 'janecee@ceearchitects.com',
      subject: "[cee-contact]",
      text: req.body.body
    }, function(err, r){
      if (err) return next(err);
      res.json({msg:'ok'});
    });
  });

  app.get('/*', function (req, res, next) {
    util.getSiteMapData(Page, function (err, site) {
      if (err) return next(err);
      Page.findOne({url: req.path}).populate("resources").exec(function (err, page) { //state: PUBLISHED
        if (!err && !page) return next(new Error("No such page " + req.path));
        if (err) return next(err);
          var next_page = util.getNextNode(util.findById(site, page.id));
          res.render('index', {site: site, page: page, resource_basepath: util.get_res_bp(config), next_page: next_page});
        });
    });
  });

  return app;



  function basic_page_view(p) {
    return {
      id: p.id,
      title: p.title,
      description: p.description,
      url: p.url,
      pages: p.pages,
      body: p.body,
      resources: _.map(p.resources, function (o) {
        return {title: o.title, description: o.description,
          public_id: o.meta.public_id, url: o.meta.url}
      }),
      template: p.template
    };
  }

}
