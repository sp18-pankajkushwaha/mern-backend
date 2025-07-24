import fs from 'fs'

console.log(1)

const data=fs.readFileSync('syncWrite.doc', 'utf8')
console.log(data)

console.log(2)