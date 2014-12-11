#!/usr/bin/env node
/**
 * Created by dcazzaniga on 21/11/14.
 */
var request = require('request');
var log = require('./log');
var fs = require('fs')

console.log("Hello World")
var params = process.argv.slice(2)

var API_KEY = 'AIzaSyDD-u_oJWc47uV-lfJKlo2oOK2VSFRBAUM';

if( params.length == 1){
    readLines(params[0], function(msg){
        console.log('FINITO')
    } )
}else if(params.length == 3) {
    nearby(params[0],params[1],params[2]);
}else{
    console.log("MISSING PARAMETERS")
    console.log("example: ./geocoder.js + latlong.csv | lat lng")
}

function nearby(lat, lng, meters){
    var options = {
        url: 'https://maps.googleapis.com/maps/api/place/nearbysearch/json',
        method :'GET',
        qs : {location : lat +","+lng , radius : meters, key:API_KEY }
    }
    request.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json',
        options,
        function(error, response, body) {
            if(error){
                console.log(error);
            }
            var res = JSON.parse(body);
            console.log(options)
            if(res.status == 'OK'){
                console.log('results:',res.results.length)
                res.results.forEach(function(place){
                    console.log(place.name, place.types)
                })
            }else{
                console.log(res)
            }

            //if(result.re)
            /*if(result.results[0]){
                log.info(result.status, result.results[0] );
            }*/
        }
    )
}

function logLL(address){
    var options = {
        url: 'https://maps.googleapis.com/maps/api/geocode/json',
        method :'GET',
        key:API_KEY,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2049.0 Safari/537.36'
        },
        qs : { address : address }
    }
    request.get('https://maps.googleapis.com/maps/api/geocode/json',
        options,
        function(error, response, body) {
            if(error){
                console.log(address + ' , ' + error)
            }
            var result = JSON.parse(body)
            if(result.results[0]){
                log.info(result.status, address + ' ## ' + result.results[0].geometry.location.lat + ' , ' + result.results[0].geometry.location.lng + ' ##' );
            }else{
                log.info(result.status, address + ' ## , ## ' );
            }
        }
    )
}

function readLines( dirPath, callback){
    // FILEs NAME
    var counter = 0
    var stream = fs.createReadStream(dirPath);
    stream.on('data', onData).buffer = '';
    function onData(chunk) {
        var i, hasData = Buffer.isBuffer(chunk);
        if (hasData) {
            stream.buffer += chunk.toString('utf8');
            if (stream.paused)
                return;
        }
        if(counter % 50 == 0) console.log('PROCESSED:',counter);
        if ((i = stream.buffer.indexOf('\n')) > -1) {
            counter ++
            var line = stream.buffer.substring(0, i);
            stream.buffer = stream.buffer.substring(i + 1);
            stream.pause();
            stream.paused = true;
            onLine(line, onData);
        } else if (!hasData) {
            stream.resume();
            stream.paused = false;
        }
    }
    function onLine(line, cb) {
        setTimeout(function() {
            logLL(line);
            cb();
        }, 300);
    }
    stream.on('end',  callback )
}
