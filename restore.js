var Promise = require('bluebird');
var request = Promise.promisifyAll(require('request'), { multiArgs: true });
var env = require('nconf').argv().env().file('default', 'config.json');

['esDomain','snapshotBucket','snapshotName']
  .forEach(d => { if (!env.get(d)) throw 'Missing env: "' + d + '"'; });

console.log('Deleting all indices');
return request.deleteAsync({
  url: 'https://'+env.get('esDomain')+'/_all'
})
.spread((res,body) => console.log(body))
.catch(console.log)
.then(() => console.log('Restoring from snapshot'))
.then(() => request.postAsync({
  url: 'https://'+env.get('esDomain')+'/_snapshot/'+env.get('snapshotBucket')+'/'+env.get('snapshotName')+'/_restore'
}))
.spread((res,body) => console.log(body))
.catch(console.log);
