/* eslint-disable no-console */
import * as extargsparse from 'extargsparse';

const util = require('util');
const fs = require('fs');


const _getTimeTick = ts => {
  const sarr = ts.split('-');
  let retval = 0;
  if (sarr.length >= 3) {
    retval += parseInt(sarr[0], 10) * 100 * 100;
    retval += parseInt(sarr[1], 10) * 100;
    retval += parseInt(sarr[2], 10);
    retval *= 10000;
  } else {
    retval += parseInt(ts, 10);
  }
  return retval;
};

const _findStoreIndex = (arr1,arr2) => {
  let idx = 0;
  let minidx = 0;
  let maxidx = arr1.length - 1;
  let curidx = Math.floor((minidx + maxidx) / 2);
  let v1min;
  let v1max;
  let v1cur;
  let v2;

  while( minidx < maxidx ) {
    v1min = _getTimeTick(arr1[minidx][0]);
    v1max = _getTimeTick(arr1[maxidx][0]);
    v1cur = _getTimeTick(arr1[curidx][0]);
    v2 = _getTimeTick(arr2[0][0]);
    if (v1min >= v2) {
      idx = 0;
      break;
    } else if (v1max <= v2) {
      idx = (maxidx + 1);
      break;
    }

    if ((minidx + 1) >= maxidx) {
      /*this is the smallest one*/
      if (v1min < v2 && v1max > v2) {
        idx = (minidx);
        break;
      } else {
        idx = (maxidx + 1);
        break;
      }
    }

    if (v1cur < v2) {
      minidx = curidx;
    } else if (v1cur > v2) {
      maxidx = curidx;
    } else if (v1cur == v2) {
      idx = curidx;
      break;
    }
    
    curidx = Math.floor((minidx + maxidx) / 2);
  }
  return idx;
};

const _mergeArray = (arr1,arr2) => {
	let _idx = 0;
	_idx = _findStoreIndex(arr1,arr2);
	arr2.forEach(function(d) {
		arr1.splice(_idx,0,d);
		_idx += 1;
	});
	return arr1;
};

const commandline = `
{
	"$" : 2
}
`;

const parser = extargsparse.ExtArgsParse();
parser.load_command_line_string(commandline);
const args = parser.parse_command_line();

fs.readFile(args.args[0],function(err1,data1) {
	if (err1 !== undefined && err1 !== null) {
		console.error('can not read [%s] error %s', args.args[0], err1);
		process.exit(4);
	}
	fs.readFile(args.args[1],function(err2,data2) {
		let json1;
		let json2;
		let idx;
		let lastval,curval;
		if (err2 !== undefined && err2 !== null) {
			console.error('can not read [%s] error %s', args.args[1], err2);
			process.exit(4);
		}

		// console.log('(%s)', data1);
		json1 = JSON.parse(data1);
		json2 = JSON.parse(data2);
		_mergeArray(json1,json2);
		lastval = 0;

		json1.forEach(function(d) {
			console.log('%s',d);
			curval = _getTimeTick(d[0]);
			if (curval < lastval) {
				console.log('%s not right for %s', d, lastval);
			}
			lastval = curval;
		});
	});
});
