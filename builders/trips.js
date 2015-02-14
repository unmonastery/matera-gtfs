var _ = require('lodash');

var mkServiceId = require('../lib/utils').mkServiceId;
var mkTripId = require('../lib/utils').mkTripId;


module.exports = function(data){

  var miccolis = data[0];

  var results = [];

  miccolis.forEach(function( row ){

    var serviceId = mkServiceId( row );
    var tripId = mkTripId( row );

    if ( !serviceId ){
      console.error('cannot create service id for ' + JSON.stringify(row));
    }

    // TODO row.osm_relation_id is missing in intermediate file
    results.push({
      // TODO use row.osm_relation_id to find master relation
      'route_id':'',
      'service_id':serviceId,
      'trip_id': tripId,
      'trip_headsign':row.to,
      // TODO use row.osm_relation_id
      'shape_id':''
    });

  });

  return results;

};
