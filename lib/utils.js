var _ = require('lodash');
var moment = require('moment');

module.exports = {

  mkServiceId: function(row){
    var service = '';
    _.forOwn(row, function(value, key){
      if (value==='x'){
        service += '_' + key;
      }
    });
    return service;
  },

  mkTripId: function(row){
    var start = moment( row.start_time, 'HH:mm:ss').format('HHmm');
    return row.bus_number + '_' + row.osm_relation_id + module.exports.mkServiceId(row) + '_' + start;
  }

}
