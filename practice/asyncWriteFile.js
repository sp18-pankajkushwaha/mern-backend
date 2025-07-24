import fs from 'fs/promises';

console.log(1);

fs.writeFile('asyncWrite.doc', 'This is an asynchronous write written by using fs module', 'utf8')
  .then(() => console.log("File created successfully."))
  .catch(err => console.log(err));

console.log(2);