const fs = require('fs')

let funcMap;
let calledArray = []
let unCalledArray = []
fs.readFile('functions-invoked.json', 'utf-8', (err, data) => {
    if (err) {
        throw err
    }
    // parse JSON object
    funcMap = JSON.parse(data.toString())

    for(func in funcMap) {
        console.log(funcMap[func])
        if(funcMap[func].times == 0) {
            unCalledArray.push(funcMap[func].name)
        } else {
            calledArray.push(funcMap[func].name)
        }
    }
    
    console.log('called functions:', calledArray)
    console.log('length of called functions:', calledArray.length)
    
    console.log('uncalled functions:', unCalledArray)
    console.log('length of uncalled functions:', unCalledArray.length)
})
