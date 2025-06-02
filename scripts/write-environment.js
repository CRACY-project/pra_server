const fs = require('fs');
const fileName = 'apps/web/public/environment.json';
const file = require('../' + fileName);
file.date = new Date().getTime();
file.sha = process.env.SHA;
file.version = process.env.TAG;
file.branch = process.env.BRANCH;

fs.writeFile(fileName, JSON.stringify(file), function writeJSON(err) {
    if (err) return console.log(err);
    console.log(JSON.stringify(file));
    console.log('writing to ' + fileName);
});
