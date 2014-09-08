/**
 * Module dependencies.
 */
var dns=require('dns')

dns.resolve4('lightbook.avaer.org',function(err,address){
    console.log(address);
})