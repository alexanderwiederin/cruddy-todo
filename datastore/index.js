const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

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
  fs.readdir(exports.dataDir, (err, files) => {
    // each item in files array is the file name
    files.forEach((fileName) => {
      fileName = fileName.slice(0, 5);
      data.push({id: fileName, text: fileName});
    });
    console.log('data', data);
    callback(null, data);
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
  
  fs.writeFile(`${exports.dataDir}/${id}.txt`, text, (err) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, {id, text});
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
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
