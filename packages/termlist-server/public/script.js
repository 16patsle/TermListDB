var db = new PouchDB('http://localhost:5984/termlist');

db.info()
  .then(function(info) {
    console.log(info);
  })
