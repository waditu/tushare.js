/* eslint-disable no-console */
import { stock } from '../../lib';
import * as extargsparse from 'extargsparse';

const util = require('util');
const strftime = require('strftime');

const commandfmt = `
{
	"ktype|k" : "day",
	"autype|a" : "hfq",
	"index|i" : false,
	"start|s" : "%s",
	"end|e" : "%s",
	"$" : "+"
}`;

const nowtime = new Date();
const etime = new Date(nowtime.getTime() - 24 * 1 * 3600 * 1000);
const stime = new Date(etime.getTime() - 24 * 365 * 3600 * 1000);

const sdate = strftime('%Y-%m-%d',stime);
const edate = strftime('%Y-%m-%d',etime);

const command=util.format(commandfmt,sdate,edate);
const parser = extargsparse.ExtArgsParse();
parser.load_command_line_string(command);
const args = parser.parse_command_line();


args.args.forEach(function(code) {
	let options = {};
	options.code = code;
	options.start = args.start;
	options.end = args.end;
	options.ktype = args.ktype;
	options.autype = args.autype;
	options.index = args.index;
	stock.getKData(options).then(data => {
		console.log('code %s',code);
		data.forEach(function(d) {
			console.log('%s',d);
		});			
	})
	.catch(err => {
		console.error('get %s error %s', code, err);
	});
});