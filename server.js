var Hapi = require('hapi');
var Inert = require('inert');
var Vision = require('vision');
var Path = require('path');
var rot13 = require('rot13-transform');
// var H2o2 = require('h2o2');
var fs = require('fs');
var Joi = require('joi');



var server = new Hapi.Server();

server.register(Inert, function(err){
  if (err) throw err;
});


server.register(Vision, function (err){
  if (err) throw err;
});
// server.register(H2o2, function (err){
//   if (err) throw err;
// });

server.connection({
    host: 'localhost',
    port: Number(process.argv[2] || 8080)
});

  // server.route({
  //   path: '/{name}',
  //   method:'GET',
  //   handler: handler
  // });
  // server.route({
  //   path: '/',
  //   method:'GET',
  //   handler: {
  //     file: "index.html"
  //   }
  // });
  // server.route({
  //   path: '/foo/bar/baz/{filename}',
  //   method:'GET',
  //   handler: {
  //     directory: { path: './public'}
  //     // this tells it to look for filename in public folder.
  //   }
  // });
  // server.route({
  //   path: '/',
  //   method:'GET',
  //   handler: handler
  // });
  // server.route({
  //   path: '/proxy',
  //   method:'GET',
  //   handler: {
  //     proxy: {
  //       host: "127.0.0.1",
  //       port: 65535
  //     }
  //   }
  // });

  // server.views({
  //   engines: {
  //     html: require('handlebars')
  //   },
  //   path: Path.join(__dirname, 'templates'),
  //   helpersPath: 'helpers'
  // });

  // server.route({
  //     method: 'POST',
  //     path: '/login',
  //     config: {
  //         handler: function (request, reply) {
  //             reply('login successful');
  //         },
  //         validate: {
  //             payload: Joi.object({
  //                 isGuest: Joi.boolean().required(),
  //                 username: Joi.string().when('isGuest', { is: false, then: Joi.required() }),
  //                 password: Joi.string().alphanum(),
  //                 accessToken: Joi.string().alphanum()
  //             }).options({ allowUnknown: true }).without('password', 'accessToken')
  //         }
  //     }
  // });

  // server.route({
  //   method: 'POST',
  //   path: '/upload',
  //   config: {
  //     handler: function(request, reply) {
  //       var body = '';
  //       request.payload.file.on('data', function(data) {
  //         body += data;
  //       });
  //       request.payload.file.on('end', function() {
  //         var result = {
  //           description: request.payload.description,
  //           file: {
  //             data: body,
  //             filename: request.payload.file.hapi.filename,
  //             headers: request.payload.file.hapi.headers
  //           }
  //         };
  //         reply(JSON.stringify(result));
  //       });
  //     },
  //     payload: {
  //       output: 'stream',
  //       parse: true,
  //       allow: 'multipart/form-data'
  //     }
  //   }
  // });

var setCookieConfig = {
  method : 'GET',
  path : '/set-cookie',
  config :{
    handler: setCookieFunction,
    state : {
      parse : true,
      failAction: 'log'
    }
  }
};

function setCookieFunction (req,reply) {
  var unencoded = JSON.stringify( {
    key: 'makemehapi'
  });
  encoded = new Buffer(unencoded).toString('base64');
  reply('Nice one guys, cookies have ben SET')
  .state('session',encoded);
}

server.route(setCookieConfig);

var checkCookieConfig = {
  method : 'GET',
  path : '/check-cookie',
  config :{
    handler: checkCookieFunction,
    state : {
      parse : true,
      failAction: 'error'
    },
    "validate": {
               headers:{
                 "Cookie" : Joi.string().required()
               }
       }
  }
};

function checkCookieFunction (req,reply) {
  if(!req.state.session){
    reply('Here are your cookies, buddy:'+req.state.session);
  } else {
    reply({user: 'hapi'});
  }
}



server.route(checkCookieConfig);

server.state('session',{
  path:'/',
  domain : "localhost",
  ttl : 10

});
// server.route(routeConfig);

 // function myHandler(request,reply){
 //
 //   reply("login succesful");
 // }

//   var encoded = fs.createReadStream("text.txt")
//     .pipe(rot13());
//
// function handler (request,reply){
//
//
//   reply(encoded);
// }


server.start(function(){
  console.log("server is running at:", server.info.uri);
});
