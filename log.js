/**
 * Created with JetBrains WebStorm.
 * User: gsabena
 * Date: 22/07/13
 * Time: 17:16
 * To change this template use File | Settings | File Templates.
 */
"use strict"
var winston = null
var Bunyan = require('bunyan')

var bunyan = Bunyan.createLogger({name: 'geocoder',
  streams: [
    {
      level: 'trace',
      path: 'log/geocode.log'
    }
  ]
})

/** @namespace */
var log = {}

/**
 * Log a message of level INFO
 * @param {string} msg Message
 * @param obj {object} obj Data object added to log line
 */
log.info = function (msg, obj) {
  obj = obj || null
  if (winston) {
    winston.info(msg, obj)
  }
  if (bunyan) {
    bunyan.info(obj, msg)
  }
}


/**
 * Log a message of level ERROR
 * @param {string} msg Message
 * @param obj {object} obj Data object added to log line
 */
log.error = function (msg, obj) {
  obj = obj || null
  if (winston) {
    winston.error(msg, obj)
  }
  if (bunyan) {
    bunyan.error(obj, msg)
  }
}

//////////////////////////////////////////
// Exports - Class Constructor          //
//////////////////////////////////////////

module.exports = log

//////////////////////////////////////////
// Note                                 //
//////////////////////////////////////////