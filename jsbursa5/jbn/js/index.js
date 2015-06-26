;(function app(){
  'use strict';

  var status_map = {
    'active': 0,
    'redcard': 1,
    'removed': 2
  };
  var status_map_inverted = _.invert(status_map);
  var status_map_keys = _.keys(status_map);

  $(function(){
    var items = $('.row > div.col-md-4 > ul');
    function _debugStatuses(response) {
      var statuses = {};
      $.each(response, function(idx, item){
        if (!statuses[item.status]) {
          statuses[item.status] = 0;
        }
        statuses[item.status]++;
      });
      console.log(statuses);
    }

    items.each(function(index){
      $(this).attr('id', status_map_inverted[index]);
    });

    $.get(window.url, function(response){
      _debugStatuses(response);
      items.each(function(index){
        var item = $(this);
        var other = items.not(item);
        var other_selectors = [];
        var connectWith;
        if (item.attr('id') !== 'removed') {
          other.each(function(index){
            var selector = $(this).attr('id');
            other_selectors.push('#' + selector);
          });
        }
        console.log('other_selectors', other_selectors);
        //if (other_selectors.length) {
          connectWith = other_selectors.join(',');
          console.log('wwwww', connectWith);
          item.sortable({
            connectWith: connectWith,
            receive: function () {
              console.log('received');
              var id = this.attr('id');
              $.post(window.url + '/' + id);
            }
          });
        //}
      });
      $.each(response, function(idx, item){
        var ul = items.eq(status_map[item.status]);
        var h3 = $('<h3>').text(item.name);
        var h4 = $('<h4>').text(item.phone);
        var li = $('<li>').append(h3).append(h4);
        ul.append(li);

        //console.log(this, arguments)
      });
    });
  });
}());