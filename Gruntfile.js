var config = require('./package.json').config;

var request = require('superagent');
var Promise = require('es6-promise').Promise;
var csv = require('csvjson');
var converter = require('json-2-csv');
var fs = require('fs');

function loadData(list){

  return list.map(function(type){
    var file = config.data[ type ];
    var content;

    if (!file)
      throw new Error('file ' + type + ' not found.');

    // TODO select proper parser using file.format information
    return csv.toObject( file.path ).output;

  });
}

function saveData(data, filepath){
  console.log(filepath)
  return new Promise(function(resolve, reject){
    converter.json2csv(data, function(err, csv){
      if (err){
        reject(err);
      } else {
        fs.writeFileSync( filepath, csv );
        resolve();
      }

    });
  });

}

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

    fetchCSV()
      .then(saveData)
      .catch(function(err){
        console.log(err);
      }).then(done);

  });

  grunt.registerTask('trips', function(){
    var done = this.async();
    var tripsBuilder = require('./builders/trips');
    var trips = tripsBuilder( loadData(['miccolis']) );

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

    saveData(frequencies, './gtfs/frequencies.txt')
      .catch(function(err){
        console.log(err);
      }).then(done);

  });

};
