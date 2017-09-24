const express = require('express');
const app = express();

app.use(express.static('node_modules/termlist-web/dist'));

app.get('/', function(req, res) {
  res.sendFile('index.html', {
    root: '/node_modules/termlist-web/dist/',
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
