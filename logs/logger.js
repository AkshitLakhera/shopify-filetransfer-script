const winston = require('winston');
const path = require('path');
//creating logger isntance
const logger = winston.createLogger({
    //setting log level to info
    level:'info',
    format:winston.format.combine(
        //Adding time stamp in each log
        winston.format.timestamp(),
        //Formating logs as JSON
        winston.format.json()
    ),
    //Now writing transport,place where all the logs are saved.
    transports : [
        //displaying logs in  terminal
        new winston.transports.File({
            filename:path.join(__dirname,'../../logs/error.log'),
            level:'error' //error and above error level error wil be logged
        }),
        new winston.transports.File({ 
            filename: path.join(__dirname, '../../logs/combined.log') 
        }),
        new winston.transports.Console({
            format:winston.format.combine(
                winston.format.colorize(), //message displayed will be colorised
                winston.format.simple(),// simple message would be displayed

            )
        })
    ]
});