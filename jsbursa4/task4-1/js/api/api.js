(function api() {
  'use strict';

  function url_domain(data) {
    var a = document.createElement('a');
    a.href = data;
    return a.protocol + '//' + a.hostname;
  }

  function inherit(proto) {
    function F() {}
    F.prototype = proto;
    var object = new F;
    return object;
  }
  if (!Object.create) Object.create = inherit;

  function xhrRequest(method, url, data, headers, successCallback, failCallback) {
    var xhr;
    try {
      xhr = new XMLHttpRequest();
      xhr.open(method, url);
      xhr.setRequestHeader('Content-type', 'application/json');
      if (headers) {
        headers.forEach(function hEach(item) {
          xhr.setRequestHeader(item.name, item.value);
        });
      }
      if (data) {
        xhr.send(JSON.stringify(data));
      } else {
        xhr.send();
      }
      xhr.addEventListener('readystatechange', function hXHR() {
        var response;
        if (xhr.readyState === xhr.DONE) {
          if (xhr.status.toString()[0] === '2') {
            response = JSON.parse(xhr.responseText);
            successCallback.call(this, xhr, response);
          } else {
            failCallback.call(this, xhr);
          }
        }
      });
    } catch (e) {
      // console.error('Unexpected error occurred.', e);
    }
  }

  function User(data) {
    console.log('User data', data);
    if (data.id) {
      this.id = data.id;
    }
    this.name = data.name;
    this.phone = data.phone;
    this.role = data.role;
  }

  User.load = function (callback) {
    xhrRequest('GET', window.crudURL, null, null,
    function hSuccess(xhr, response) {
      var users = [];
      var user = null;
      response.forEach(function(item){
        if (item.role === 'Administrator' || item.role === 'Admin') {
          user = new Admin(item);
        } else if (item.role === 'Support') {
          user = new Support(item);
        } else if (item.role === 'Student') {
          user = new Student(item);
        }
        else {
          user = new User(item);
          console.log(item.role);
        }
        users.push(user);
      });
      callback.call(this, false, users);
    },
    function hFail(xhr) {
      callback.call(this, true, null);
    });
  };

  User.prototype.save = function (callback) {
    var me = this;
    if (me.id) {
      console.log('update', this);
      xhrRequest('PUT', window.crudURL + '/' + me.id, null, null,
        function hSuccess(xhr, response) {
          callback.call(this, false);
        },
        function hFail(xhr) {
          callback.call(this, true);
        });
    } else {
      xhrRequest('POST', window.crudURL, me, null,
        function hSuccess(xhr, response) {
          me.id = response.id;
          callback.call(this, false);
        },
        function hFail(xhr) {
          callback.call(this, true);
        });
    }
  };

  function Student(data) {
    User.apply(this, arguments);
    this.strikes = data.strikes;
  }

  Student.prototype = Object.create(User.prototype);
  Student.prototype.constructor = Student;

  Student.prototype.getStrikesCount = function getStrikesCount() {
    return this.strikes;
  };

  function Support(data) {
    User.apply(this, arguments);
    //this.strikes = strikes;
  }
  Support.prototype = Object.create(User.prototype);
  Support.prototype.constructor = Support;

  function Admin(data) {
    User.apply(this, arguments);
    //this.strikes = strikes;
  }
  Admin.prototype = Object.create(User.prototype);
  Admin.prototype.constructor = Admin;

  Admin.prototype.save = function (callback) {
    var url = url_domain(window.crudURL) + '/refreshAdmins';
    xhrRequest('POST', url, {role: this.role}, null,
      function hSuccess(xhr, response) {
        User.prototype.save.apply(this, callback);
      },
      function hFail(xhr) {
        callback.call(this, true);
      });
  };

  window.User = User;
  window.Student = Student;
  window.Support = Support;
  window.Admin = Admin;
})();
