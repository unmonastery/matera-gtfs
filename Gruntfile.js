var config = require('./package.json').config;
// upload settings specific to Miccolis
var settings = require('./miccolis.json');


var request = require('superagent');
var Promise = require('es6-promise').Promise;

var fs = require('fs');
var _ = require('lodash');

var gtfsMaker = require('gtfs-maker');
var loadData = gtfsMaker.load;
var saveDataAsCsv = gtfsMaker.saveAsCsv;

gtfsMaker.config({
  // TODO find better names for miccolis files
  miccolis:{
    format:'csv',
    ext:'.csv',
    dir:'./cache/'
  },
  timetables:{
    isDirectory:true,
    format:'csv',
    ext:'.csv',
    dir:'./extracted/timetables/',
    transform:function(item){
      function lookup(lineName){
        return _.result(
          _.find( settings.lines, function(line){
            return line.number == lineName;
          }), 'osmId' );
      }
      var matches = /MT(.*)\.csv/.exec(item.name);
      if ( !matches ){
        throw new Error('Timetables file not in correct format.');
      }
      var name = matches[1];
      var osmId = lookup( name );
      return {
        osmId:osmId,
        stopTimes:item.content
      };
    }
  }
});

module.exports = function(grunt){

  // utility function to parse command line options
  function fetchOptions(){
    return {
      include:grunt.option( "include" ).toString().split(',')
    };
  }

  grunt.registerTask('cache', function(){

   var done = this.async();

   function fetchCSV(){
    return new Promise(function(resolve, reject){
      request.get( config.miccolis.url )
          .end(function(err, res){
            if(err){
              reject(err);
            } else {
              resolve(res.text);
            }
          });
      });
    }

    function saveData(data){
      fs.writeFileSync('./cache/miccolis.csv', data);
    }

    gtfsMaker.cache()
      .then(
        fetchCSV().then(saveData)
      ).catch(function(err){
        console.log(err);
    }).then(done);

  });

  grunt.registerTask('trips', function(){
    var done = this.async();
    var tripsBuilder = require('./builders/trips');
    var trips = tripsBuilder( loadData(['masters', 'miccolis']), fetchOptions() );

    saveDataAsCsv(trips, './gtfs/trips.txt')
      .catch(function(err){
        console.log(err);
      }).then(done);

  });

  grunt.registerTask('calendar', function(){

    var done = this.async();
    var calendarBuilder = require('./builders/calendar');
    var calendar = calendarBuilder( loadData(['miccolis']), fetchOptions() );

    saveDataAsCsv(calendar, './gtfs/calendar.txt')
      .catch(function(err){
        console.log(err);
      })
      .then(function(){
        console.log('created ' + calendar.length + ' services.');
        console.log('please edit service properties in calendar.txt file.');
      }).then(done);

  });

  grunt.registerTask('frequencies', function(){
    var done = this.async();
    var frequenciesBuilder = require('./builders/frequencies');
    var frequencies = frequenciesBuilder( loadData(['miccolis']), fetchOptions() );
    saveDataAsCsv( frequencies, './gtfs/frequencies.txt' )
      .catch(function(err){
        console.log(err);
      }).then(done);

  });

  grunt.registerTask('routes', function(){
    var done = this.async();
    var routes = gtfsMaker.builders.routes( loadData(['masters']), fetchOptions() );
    saveDataAsCsv( routes, './gtfs/routes.txt' )
      .catch(function(err){
        console.log(err);
      }).then(done);
  });

  grunt.registerTask('stop_times', function(){
    var done = this.async();
    var stopTimes = gtfsMaker.builders.stopTimes(
      loadData([ 'masters', 'routes', 'stops', 'timetables', 'trips']),
      fetchOptions()
    );
    saveDataAsCsv( stopTimes, './gtfs/stop_times.txt' )
      .catch(function(err){
        console.log(err);
      }).then(done);
  });

};
