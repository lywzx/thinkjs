var assert = require('assert');
var muk = require('muk');
var path = require('path');

var _http = require('../_http.js');

function execMiddleware(middleware, config, options, data){
  think.APP_PATH = path.dirname(__dirname) + '/testApp';
  var req = think.extend({}, _http.req);
  var res = think.extend({}, _http.res);
  return think.http(req, res).then(function(http){
    if(config){
      http._config = config;
    }
    if(options){
      for(var key in options){
        http[key] = options[key];
      }
    }
    return think.middleware(middleware, http, data);
  })
}

describe('middleware/resource', function(){
  it('base, RESOURCE_PATH not set', function(done){
    var RESOURCE_PATH = think.RESOURCE_PATH;
    think.RESOURCE_PATH = '';
    execMiddleware('resource', {}, {}).then(function(data){
      assert.equal(data, false);
      think.RESOURCE_PATH = RESOURCE_PATH;
      done();
    })
  })
  it('base, resource_on off', function(done){
    execMiddleware('resource', {
      resource_on: false
    }, {}).then(function(data){
      assert.equal(data, false);
      done();
    })
  })
  it('base, pathname empty', function(done){
    execMiddleware('resource', {
      resource_on: true
    }, {
      pathname: ''
    }).then(function(data){
      assert.equal(data, false);
      done();
    })
  })
  it('base, reg not match', function(done){
    execMiddleware('resource', {
      resource_on: true,
      resource_reg: /^\d+$/
    }, {
      pathname: 'wwww'
    }).then(function(data){
      assert.equal(data, false);
      done();
    })
  })
  it('base, file not found', function(done){
    execMiddleware('resource', {
      resource_on: true,
      resource_reg: /^\d+$/
    }, {
      pathname: '01111'
    }).catch(function(err){
      assert.equal(think.isPrevent(err), true);
      done();
    })
  })
  it('base, file exist', function(done){
    var RESOURCE_PATH = think.RESOURCE_PATH;
    think.RESOURCE_PATH = __dirname;
    execMiddleware('resource', {
      resource_on: true,
      resource_reg: /^resource\.js/
    }, {
      pathname: 'resource.js'
    }).catch(function(err){
      assert.equal(think.isPrevent(err), true);
      think.RESOURCE_PATH = RESOURCE_PATH;
      done();
    })
  })
})