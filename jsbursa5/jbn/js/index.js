/* global $:false */
/* global _:false */
/* global console:false */
(function app() {
  'use strict';

  var statusMap = {
    'active': 0,
    'redcard': 1,
    'removed': 2
  };
  var statusMapInverted = _.invert(statusMap);
  // var status_map_keys = _.keys(statusMap);
  (function StateManager() {
    var StateManager = new function StateManager() {
      var state = {};
      var instance;

      function StateManager() {
        if (!instance) {
          instance = this;
        } else {
          return instance;
        }

        StateManager.prototype._saveState = function _saveState() {
          localStorage.setItem('jbnState', JSON.stringify(state));
        };

        StateManager.prototype.loadState = function loadState() {
          var storedState = localStorage.getItem('jbnState');
          if (!storedState) {
            return;
          }
          state = JSON.parse(storedState);
          console.debug('State loaded.', state);
        };

        StateManager.prototype.init = function init(items) {
          if (state.items) {
            return;
          }
          state.items = {};
          state.order = {};
          $.each(items, function(idx, item) {
            if (!state.items[item.status]) {
              state.items[item.status] = [];
            }
            state.items[item.status].push(item);
          });
          $.each(items, function(idx, item) {
            if (!state.order[item.status]) {
              state.order[item.status] = [];
            }
            state.order[item.status].push({id: +item.id, idx: idx});
          });
          console.debug('[DEBUG] StateManager initialized, state: ', state);
          this._saveState();
        };

        StateManager.prototype.change = function change(id, oldStatus, newStatus) {
          var item = _.find(state.items[oldStatus], _.matchesProperty('id', id));
          if (!item) {
            console.warn('Item not found on change, item id = ', id);
          }
          _.remove(state.items[oldStatus], _.matchesProperty('id', id));
          state.items[newStatus].push(item);
          console.debug('[DEBUG] Status changed (id, item, oldStatus, newStatus)', id, item, oldStatus, newStatus);
          this._saveState();
        };

        StateManager.prototype.render = function render(uls) {
          uls.each(function() {
            $(this).empty();
          });
          $.each(state.items, function(i, items) {
            $.each(items, function(k, item) {
              var ul = uls.eq(statusMap[item.status]);
              var h3 = $('<h3>').text(item.name);
              var h4 = $('<h4>').text(item.phone);
              var li = $('<li>')
                .data('id', item.id)
                .append(h3)
                .append(h4);
              ul.append(li);
            });
          });
        };
      }

      return StateManager;
    };

    window.stateManager = StateManager;
  })();
  var stateManager = new window.stateManager();

  $(function() {
    var uls = $('.row > div.col-md-4 > ul');
    //stateManager.loadState();

    function _debugStatuses(response) {
      var statuses = {};
      $.each(response, function(idx, item) {
        if (!statuses[item.status]) {
          statuses[item.status] = 0;
        }
        statuses[item.status]++;
      });
      console.debug('[DEBUG] Count statuses:', statuses);
    }

    uls.each(function(index) {
      $(this).attr('id', statusMapInverted[index]);
      $(this).data('type', statusMapInverted[index]);
    });

    $.get(window.url, function getSuccess(response) {
      _debugStatuses(response);
      uls.each(function() {
        var ul = $(this);
        var other = uls.not(ul);
        var other_uls = [];
        var connectWith;
        if (ul.data('type') !== 'removed') {
          other.each(function() {
            var selector = $(this).attr('id');
            other_uls.push('#' + selector);
          });
        }
        connectWith = other_uls.join(',');
        console.debug('[DEBUG] connectWith:', ul.get(0), connectWith);
        ul.sortable({
          connectWith: connectWith,
          receive: function(event, ui) {
            var ul = $(this);
            var id = ui.item.data('id'); // student ID
            var oldStatus = ui.sender.data('type');
            var newStatus = ul.data('type');
            console.log('received', arguments);
            $.post(window.url + '/' + id, {status: newStatus}, function() {
              stateManager.change(id, oldStatus, newStatus);
            }).fail(function() {
              stateManager.render(uls);
              console.log('fail');
            });
          }
        });
      });
      stateManager.init(response);
      stateManager.render(uls);
    });
  });
}());
