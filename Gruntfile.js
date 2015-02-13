var config = require('./package.json').config;

var request = require('superagent');
var Promise = require('es6-promise').Promise;
var cvs = require('ya-csv');
var fs = require('fs');

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

};
