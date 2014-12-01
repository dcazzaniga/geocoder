#!/usr/bin/env node
/**
 * Created by dcazzaniga on 21/11/14.
 */
var request = require('request');
var log = require('./log');
var fs = require('fs')

console.log("Hello World")
var parameters = process.argv.slice(2)
var bedollars = '1';
var env = 'sand'
if( parameters.length == 3){
    bedollars = parameters[1];
    env = parameters[2]
    readLines(parameters[0], function(msg){
        console.log('FINITO')
    })
}else{
    console.log("MISSING PARAMETERS")
    console.log("example: ./dhc.js filenamewithmembersid.csv bedollars")
}

var config = {
    prod : {
        'apiUrl': 'https://api-v2.beintoo.com',
        'admin_token': '0123456789012345678901234567890123456789__JrguI9yJz1kLs3I2F9DhvbcCoW9fFfLTwIgaknU1'
    },
    sand : {
         'apiUrl': 'http://api-v2-sand.beintoo.com',
         'admin_token': '0123456789012345678901234567890123456789__1kleM9egRHQbU4ck5upISjQiDcKUg1pin3upfYKB'
    }
}


function logLL(memberid){
    var options = {
        url: config[env].apiUrl+'/members/'+memberid+'/givebedollars/'+bedollars,
        method :'POST',
        headers: {
            'x-beintoo-auth': '0123456789012345678901234567890123456789__1kleM9egRHQbU4ck5upISjQiDcKUg1pin3upfYKB'
        }
    };
    request.post(options.url,
        options,
        function(error, response, body) {
            if(error)
                log.error('ko', memberid)
            else
                log.info('ok',memberid)
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
        }, 1000);
    }
    stream.on('end',  callback )
}
