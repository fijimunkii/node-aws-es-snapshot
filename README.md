## Scripts to handle aws elasticsearch service snapshots to s3

Because the documentation recommends using boto and that was giving me a headache.

### Getting started

* Add config.json using config.json.sample as an example

* Update 1.sh manually

* Make sure you are logged into aws `aws configure`

* `chmod +x 1.sh`

* Run `./1.sh`

* `npm install`

* `node 2`


### Restoring from snapshot

* Specify `snapshotName` in config.json

* `node restore`
