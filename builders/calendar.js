var _ = require('lodash');
var mkServiceId = require('../lib/utils').mkServiceId;

module.exports = function(data){

  var miccolis = data[0];

  var results = {};

  miccolis.forEach(function( row ){

    var serviceId = mkServiceId( row );
    if (serviceId)
      results[ serviceId ] = true;

  });

  return _.keys(results).map(function(serviceId){
    // empty entries should be edited by hand
    return {
      'service_id':serviceId,
      'monday': '',
      'tuesday': '',
      'wednesday': '',
      'thursday': '',
      'friday': '',
      'saturday': '',
      'sunday':'',
      'start_date':'',
      'end_date':''
    };
  });

};
