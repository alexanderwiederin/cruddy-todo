const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
var Promise = require('bluebird');

// var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  // var id = counter.getNextUniqueId();
  // items[id] = text;
  // callback(null, { id, text });

  counter.getNextUniqueId((err, id) => {
    fs.writeFile(`${exports.dataDir}/${id}.txt`, text, (err) => {
      if (err) {
        throw err;
      } else {
        console.log({ id, text });
        callback(null, { id, text });
      }
    });
  });
  
};

exports.readAll = (callback) => {
  var data = [];
  // data will have objects {id: id, text: id}
  var readFileAsync = Promise.promisify(fs.readFile);
  
  fs.readdir(exports.dataDir, (err, files) => {
    data = files.map((fileName) => {
      return readFileAsync(path.join(exports.dataDir, fileName), 'utf8')
        .then((fileContent) => {
          var id = fileName.slice(0, 5);
          var todoObj = {id, text: fileContent};
          return todoObj;
        });
    });
    Promise.all(data)
      .then((data) => callback(null, data));
  });
  
};

exports.readOne = (id, callback) => {
  
  fs.readFile(`${exports.dataDir}/${id}.txt`, 'utf8', (err, fileData) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, {'id': id, 'text': fileData});
    }
  });
  
};

exports.update = (id, text, callback) => {
  
  fs.readFile(`${exports.dataDir}/${id}.txt`, 'utf8', (err) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.writeFile(`${exports.dataDir}/${id}.txt`, text, (err) => {
        if (err) {
          callback(new Error(`No item with id: ${id}`));
        } else {
          callback(null, {id, text});
        }
      });
    }
  });
  
  
  
  // var item = items[id];
  // if (!item) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   items[id] = text;
  //   callback(null, { id, text });
  // }
};

exports.delete = (id, callback) => {
  
  fs.unlink(`${exports.dataDir}/${id}.txt`, (err) => {
    console.log('delete err: ', err);
    
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback();
    }
    
  });
  
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
