
const recast = require('recast')
const fs = require('fs')
const { recordAllFunctions, recordFuncMapToJson } = require('./utils')

const sourceFile = fs.readFileSync('q.js', 'utf8')

// parse the code -> ast
const ast = recast.parse(sourceFile)
const astBody = ast.program.body

// transform the ast

fs.writeFileSync('q_transformed.js', '', 'utf-8')
fs.writeFileSync('functions-original.json', '', 'utf-8')
fs.writeFileSync('functions-invoked.json', '', 'utf-8')
fs.writeFileSync('functions-executed.json', '', 'utf-8')

recordAllFunctions(astBody)
recordFuncMapToJson()

// // generate code <- ast
// const prefixCode = 'var fs = require("fs");\n var { countWhileRunning } = require("./utils");\nvar funcMap; \n fs.readFile("functions-original.json", "utf-8", function(err, data) {\nif (err) {\nthrow err;\n}\nfuncMap = JSON.parse(data.toString());\n});'
const prefixCode = 'var fs = require("fs");var { countWhileRunning } = require("./utils");'
const outputFile = prefixCode + recast.print(ast).code
fs.writeFileSync('q_transformed.js', outputFile, 'utf-8')