var _ = require('lodash');


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
    return row.bus_number + '_' + row.osm_relation_id + module.exports.mkServiceId(row);
  }

}
