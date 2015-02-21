# Matera GTFS

Project using [MapOurTransit](https://github.com/mapourtransit) toolkit
to create GTFS feed for Matera.

You can find output GTFS on:
http://dati.comune.matera.it/en/dataset/osm-challenges

## Static assets

* gtfs/agency.txt
* gtfs/calendar_dates.txt requires manual editing

## Commands

if you don't have grunt you need to install it first
     $ npm intall -g grunt-cli

next

     $ npm install
     $ grunt cache
     $ grunt [file-to-create]
