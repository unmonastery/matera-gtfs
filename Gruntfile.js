var config = require('./package.json').config;

var request = require('superagent');
var Promise = require('es6-promise').Promise;

var fs = require('fs');

var gtfsMaker = require('gtfs-maker');
var loadData = gtfsMaker.load;
var saveDataAsCsv = gtfsMaker.saveAsCsv;

// TODO
// gtfsMaker.config
// override directories

module.exports = function(grunt){


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
    var trips = tripsBuilder( loadData(['masters', 'miccolis']) );

    saveData(trips, './gtfs/trips.txt')
      .catch(function(err){
        console.log(err);
      }).then(done);

  });

  grunt.registerTask('calendar', function(){

    var done = this.async();
    var calendarBuilder = require('./builders/calendar');
    var calendar = calendarBuilder( loadData(['miccolis']) );

    saveData(calendar, './gtfs/calendar.txt')
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
    var frequencies = frequenciesBuilder( loadData(['miccolis']) );
    saveDataAsCsv( frequencies, './gtfs/frequencies.txt' )
      .catch(function(err){
        console.log(err);
      }).then(done);

  });

};
