import fs from 'fs'

console.log(1)

function syncFileWrite(){
    fs.writeFileSync('syncWrite.doc', 'Hi, this is a synchronous file written by fs module.', 'utf8')
    console.log('File written successfully')
}
syncFileWrite()
console.log(2)