/* global window:true,
    angular:true */
(function jsbursa() {
  'use strict';

  angular.module('jsbursa', [])
    .controller('jsbursaController', function($scope) {
      $scope.items1 = window.users.slice(0, 5);
      $scope.items2 = window.users.slice(5);

      //var cb = function(){
      //  var idx = 500;
      //  return function() {
      //    console.log($scope.moduleJsbursa, 'scope');
      //    idx++;
      //    var items = $scope.modelJsbursa.students;
      //    items.push({
      //      "id": idx,
      //      "name": "Frederick Padilla",
      //      "phone": "(252) 479-4740",
      //      "status": "added"
      //    });
      //    console.log('item 500 added:', items[items.length-1], $scope.modelJsbursa.students);
      //  };
      //}();
      //setInterval(cb, 5000);
    })
    .directive('draggableList', function() {
      return {
        restrict: 'E',
        scope: {
          items: '='
        },
        template: '<ul data-role="draggable-list">' +
                    '<li data-id="{{ ::item.id }}" ng-repeat="item in items" data-obj="{{ ::item }}">' +
                      '<h3>{{ ::item.name }}</h3>' +
                      '<h4>{{ ::item.phone }}</h4>' +
                    '</li>' +
                  '</ul>',
        link: function draggableListLink($scope, $element, $attrs) {
          var ul = $element.children('ul');
          var defaultSortOrder = [];
          var orderName = 'sortOrder' + $attrs.id;
          var sortOrder = JSON.parse(localStorage.getItem(orderName)) || defaultSortOrder;
          function saveOrder(ul) {
            sortOrder = $.map(ul.children('li:not(.ui-sortable-placeholder)').toArray(), function(item, idx) {
              var id = $(item).data('id').toString();
              return id;
            });
            if ($scope.hasId) {
              localStorage.setItem(orderName, JSON.stringify(sortOrder));
            }
            console.log('saveOrder');
          }
          function sortItems() {
            sortOrder.forEach(function(id, idx){
              _.forEach($scope.items, function(si){
                if (si.id === id) {
                  si.idx = idx;
                  return false;
                }
              });
            });
            $scope.items = _.sortBy($scope.items, 'idx');
          }
          sortItems();

          $scope.hasId = typeof $attrs.id !== 'undefined';

          if (!angular.element.fn || !angular.element.fn.jquery) {
            console.error('ui.sortable: jQuery should be included before AngularJS!');
            return;
          }

          var parentUl = null;
          var itemIndex = null;
          ul.sortable({
            connectWith: 'ul[data-role="draggable-list"]',
            stop: function(event, ui) {
              var ul = ui.item.parent('ul');
              if (parentUl[0] == ul[0]) {
                saveOrder(ul);
                sortItems();
                $scope.$apply();
              } else {
                itemIndex = ui.item.index();
              }
            },
            start: function(event, ui) {
              parentUl = ui.item.parent('ul');
              console.log('start', ui.item);
            },
            receive: function(event, ui) {
              var that = this;
              function processReceived() {
                var item = ui.item.data('obj');
                $scope.items.push(item);
                console.log('placeholder', itemIndex)
                console.log( $(ui.item).parent().index(ui.item), 'index')

              }
              var tempItems = angular.copy($scope.items);
              $scope.items = [];
              $scope.$applyAsync();
              setTimeout(function() {
                $scope.items = tempItems;
                $scope.$applyAsync();
                processReceived();
              }, 0);

              console.log('Event "receive":');
            },
            remove: function(event, ui) {
              console.log('Event "remove":', ui.item);
              //$scope.items = _.without($scope.items, _.findWhere($scope.items, {"id": ui.item.data('id')}));
            }
          });
        }
      };
    });

}());
