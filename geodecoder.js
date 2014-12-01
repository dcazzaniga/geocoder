#!/usr/bin/env node
/**
 * Created by dcazzaniga on 21/11/14.
 */
var request = require('request');
var log = require('./log');
var fs = require('fs')

console.log("Hello World")

var API_KEY = 'AIzaSyDD-u_oJWc47uV-lfJKlo2oOK2VSFRBAUM';

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

readLines('postpay.csv', function(msg){
    console.log('FINITO')
} )


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
