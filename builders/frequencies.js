var _ = require('lodash');

var mkTripId = require('../lib/utils').mkTripId;

module.exports = function(data){

  var miccolis = data[0];

  var results = [];

  miccolis.forEach(function( row ){

    var tripId = mkTripId( row );

      results.push({
      'trip_id': tripId,
      'start_time':row.start_time,
      'end_time':row.end_time,
      'headway_secs':row.frequency || 60,
      'exact_times':1
    });

  });

  return results;

};
