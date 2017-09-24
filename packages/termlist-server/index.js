const express = require('express');
const app = express();

/*
const testFolder = './node_modules/termlist-web';
const fs = require('fs');

fs.readdirSync(testFolder)
  .forEach(file => {
    console.log(file);
  })
*/

app.use(express.static('node_modules/termlist-web'));

app.get('/', function(req, res) {
  res.sendFile('index.html', {
    root: '/node_modules/termlist-web/',
    dotfiles: 'deny'
  }, function(err) {
    if (err) {
      console.error(err);
    }
  });
})

app.get('/pouchdb.min.js', function(req, res) {
  res.sendFile('node_modules/pouchdb/dist/pouchdb.min.js', {
    root: '.',
    dotfiles: 'deny'
  }, function(err) {
    if (err) {
      console.error(err);
    }
  });
})

app.listen(80, function() {
  console.log('listening on port 80!')
})
