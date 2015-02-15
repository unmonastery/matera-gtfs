var _ = require('lodash');

var mkServiceId = require('../lib/utils').mkServiceId;
var mkTripId = require('../lib/utils').mkTripId;


module.exports = function(data){

  function findMaster(relation){
    return _.result(_.find(masters, function(master){
      var result = _.find(master.members, function(member){
        return member.ref == relation
      });
      return !_.isUndefined(result);
    }), 'id');
  };

  var masters = data[0].elements;
  var miccolis = data[1];

  var results = [];

  miccolis.forEach(function( row ){

    var serviceId = mkServiceId( row );
    var tripId = mkTripId( row );
    var routeId = findMaster(row.osm_relation_id) || row.osm_relation_id;

    if ( !serviceId ){
      console.error('cannot create service id for ' + JSON.stringify(row));
    }

    results.push({
      'route_id':routeId,
      'service_id':serviceId,
      'trip_id': tripId,
      'trip_headsign':row.to,
      'shape_id':row.osm_relation_id
    });

  });

  return results;

};