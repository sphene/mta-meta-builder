// Builder module

const fs = require('fs');
const path = require('path');

const xmlbuilder2 = require('xmlbuilder2');

module.exports = class Builder {
  constructor (sourceDir, outputDir, name, author) {
    this.sourceDir = sourceDir;
    this.outputDir = outputDir;
    this.name = name;
    this.author = author;
  }

  copyFiles () {
    copyRecursiveSync(this.sourceDir, this.outputDir);
  }

  buildMeta () {
    createDirectoryIfNotExist(this.outputDir);

    let meta = xmlbuilder2.create()
    let root = meta.ele('meta');
    
    root.ele('info', {
      name: this.name,
      author: this.author,
      type: "misc"
    });

    let files = getAllFiles(this.outputDir);
    
    for (let file of files) {
      file = path.relative(this.outputDir, file);
      root.ele('file', { src: file.replace(/\\/g, '/') });
    }

    fs.writeFileSync(path.join(this.outputDir, 'meta.xml'), meta.end({ prettyPrint: true }));
  }
}

const getAllFiles = (directory) => {
  let foundFiles = [];

  if (fs.lstatSync(directory).isDirectory()) {
    files = fs.readdirSync(directory);
    files.forEach((file) => {
      const currentDirectory = path.join(directory, file);
      
      if (fs.lstatSync(currentDirectory).isDirectory()) {
        foundFiles = foundFiles.concat(getAllFiles(currentDirectory));
      } else {
        foundFiles.push(currentDirectory);
      }
    });
  }

  return foundFiles;
}


const copyRecursiveSync = (source, target) => {
  createDirectoryIfNotExist(target);

  let files = [];

  if (fs.lstatSync(source).isDirectory()) {
    files = fs.readdirSync(source);
    files.forEach((file) => {
      const curSource = path.join(source, file);
      
      if (fs.lstatSync(curSource).isDirectory()) {
        copyRecursiveSync(curSource, path.join(target, file));
      } else {
        fs.copyFileSync(curSource, path.join(target, file));
      }
    });
  }
};

const createDirectoryIfNotExist = (directory) => {
  if (!fs.existsSync(directory)){
    fs.mkdirSync(directory);
  }
}