var Promise = require('bluebird');
var request = Promise.promisifyAll(require('request'), { multiArgs: true });
var env = require('nconf').argv().env().file('default', 'config.json');

['snapshotBucket','awsId','awsKey','awsSecret','roleName','esDomain']
  .forEach(d => { if (!env.get(d)) throw 'Missing env: "' + d + '"'; });

var roleArn = 'arn:aws:iam::'+env.get('awsId')+':role/'+env.get('roleName');
var url = 'https://'+env.get('esDomain')+'/_snapshot/'+env.get('snapshotBucket');

var data = {
  type: 's3',
  settings: {
    access_key: env.get('awsKey'),
    secret_key: env.get('awsSecret'),
    bucket: env.get('snapshotBucket'),
    role_arn: env.get('roleArn')
  }
};

console.log('Registering snapshot repository');
return request.postAsync({
  url: url,
  json: data
})
.spread((res,body) => console.log(body))
.catch(console.log)
.then(() => console.log('Testing snapshot'))
.then(() => request.putAsync({
  url: url + '/test'
}))
.spread((res,body) => console.log(body))
.catch(console.log)
.then(() => console.log('Listing all snapshot info'))
.then(() => request.getAsync({
  url: url + '/_all'
}))
.spread((res,body) => console.log(body))
.catch(console.log);
