'use strict';

var http = require('http');
var _ = require('lodash');

var server = http.createServer(function(req, res){
  var users = [
    { id: '1', name: 'Illya Klymov', phone: '+380504020799', role: 'Administrator' },
    { id: '2', name: 'Ivanov Ivan', phone: '+380670000002', role: 'Student', strikes: 1 },
    { id: '3', name: 'Petrov Petr', phone: '+380670000001', role: 'Support', location: 'Kiev' }
  ];
  var user = {};
  var idx = -1;
  var headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'content-type'
  };

  function update(userData, index) {
    if (!userData || userData.id === undefined) {
      return 401;
    }

    if (userData.role === '' || userData.role === undefined || userData.role === 'Student') {
      users[index] = userData;
      delete users[index].location;
      if (users[index].strikes === undefined) {
        users[index].strikes = 1;
      }
      users[index].role = 'Student';
      return 204;
    }
    if (userData.role === 'Administrator' || userData.role === 'Admin') {
      users[index] = userData;
      return 204;
    }

    if (userData.role === 'Support') {
      users[index] = userData;
      delete users[index].strikes;
      return 204;
    }

    return 401;
  }

  if (req.url === '/api/users') {

    if (_.includes(['GET', 'POST', 'PUT', 'DELETE'], req.method)) {
      if (req.headers['content-type'] !== 'application/json') {
        res.writeHead(401);
        res.end();
      }
    }
    if (req.method === 'OPTIONS') {

      res.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, HEAD, PUT, POST, DELETE',
        'Access-Control-Allow-Headers': 'content-type'
      });
      res.end();

    }
    if (req.method === 'GET') {

      res.writeHead(200, headers);
      res.end(JSON.stringify(users));

    } else if (req.method === 'POST') {

      var data = '';
      req.on('data', function (chunk) {
        data += chunk;
      });
      req.on('end', function () {
        var status = 200;
        var body = JSON.parse(data);

        if (body.role === '' || body.role === null || body.role === undefined || body.role === 'Student') {
          body.role = 'Student';
          status = 200;
        }
        else if (body.role === 'Administrator' || body.role === 'Admin') {
          delete body.strikes;
          status = 200;
        }
        else if (body.role === 'Support') {
          delete body.strikes;
          status = 200;
        }
        else {
          status = 401;
        }

        res.writeHead(status, headers);
        if (status < 400) {
          user.id = users.length.toString();
          user.name = body.name;
          user.phone = body.phone;
          user.role = body.role;
          if (user.role === 'Student') {
            user.strikes = body.strikes;
          }
          users.push(user);
          res.end(JSON.stringify(user));
        } else {
          res.end();
        }
      });

    } else if (req.method === 'PUT') {
      var data = '';
      req.on('data', function (chunk) {
        data += chunk;
      });
      req.on('end', function () {
        var id = req.url.split('/api/users/')[1];


        if (!_.find(users, {id: id.toString()})) {
          status = 404;
          res.writeHead(status, headers);
          res.write(JSON.stringify("Not Found"));
          res.end();
          return;
        }


        var body = JSON.parse(data);
        var idx = _.findIndex(users, {id: id.toString()});
        var status = update(_.pick(body, ['id', 'name', 'phone', 'role', 'location', 'strikes']), idx);
        res.writeHead(status, headers);
        if (status >= 400) {
          res.end(JSON.stringify(users[idx]));
        } else {
          res.end();
        }
      });

    } else if (req.method === 'DELETE') {
      var id = req.url.split('/api/users/')[1];
      var status = 204;
      if (!_.find(users, {id: id.toString()})) {
        status = 404;
        res.writeHead(status, headers);
        res.write(JSON.stringify("Not Found"));
        res.end();
      } else {
        _.remove(users, {id: id.toString()});
        res.writeHead(status, headers);
        res.end();
      }

    } else {
      //res.writeHead(401);
      //res.end();
    }
  } else if (req.url === '/refreshAdmins' && req.method === 'GET') {


      res.writeHead(200, headers);
      res.end();







    //if (req.headers['content-type'] === undefined || req.headers['content-type'] !== 'application/json') {
    //  res.writeHead(401, headers);
    //  res.end();
    //} else {
    //  res.writeHead(200, headers);
    //  res.write(JSON.stringify(users));
    //  res.end();
    //}
  }
  //res.end('Unknown request!');
});

if (module.parent) { module.exports = server } else { server.listen(20007); }