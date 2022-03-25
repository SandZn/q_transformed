const recast = require('recast')
const fs = require('fs')

let funcIndex = 1
// let astNodeIndex = 0

let funcMap = {}

function recordAllFunctions(node) {
    recast.visit(node, {
        // 1
        visitFunctionDeclaration: function ({ value }) {
            // console.log('visitFunctionDeclaration:', astNodeIndex++)
            const id = `function_${value.loc.start.line}_${value.loc.start.column}`
            recordFunction(value, id)
            logFunctionId(value)
            recordAllFunctions(value.body)
            return false
        },
        // 2
        visitFunctionExpression: function ({ value }) {
            // console.log('visitFunctionExpression', astNodeIndex++)
            const id = `function_${value.loc.start.line}_${value.loc.start.column}`
            recordFunction(value, id)
            logFunctionId(value)
            recordAllFunctions(value.body)
            return false
        },
        // 3
        visitVariableDeclaration: function ({ value }) {
            // console.log('visitVariableDeclaration:', astNodeIndex++)
            forRecordCycle(value.declarations)
            return false
        },
        // 4
        visitVariableDeclarator: function ({ value }) {
            // console.log('visitVariableDeclarator', astNodeIndex++)
            recordAllFunctions(value.init)
            return false
        },
        // 5
        visitCallExpression: function ({ value }) {
            // console.log('visitCallExpression', astNodeIndex++)
            recordAllFunctions(value.callee)
            forRecordCycle(value.arguments)
            return false
        },
        // 6
        visitReturnStatement: function ({ value }) {
            // console.log('visitReturnStatement', astNodeIndex++)
            recordAllFunctions(value.argument)
            return false
        },
        // 7
        visitExpressionStatement: function ({ value }) {
            // console.log('visitExpressionStatement', astNodeIndex++)
            recordAllFunctions(value.expression)
            return false
        },
        // 8
        visitUnaryExpression: function ({ value }) {
            // console.log('visitUnaryExpression', astNodeIndex++)
            recordAllFunctions(value.argument)
            return false
        },
        // 9
        visitSequenceExpression: function ({ value }) {
            // console.log('visitSequenceExpression', astNodeIndex++)
            forRecordCycle(value.expressions)
            return false
        },
        // 10
        visitAssignmentExpression: function ({ value }) {
            // console.log('visitAssignmentExpression', astNodeIndex++)
            recordAllFunctions(value.right)
            return false
        },
        // 11
        visitConditionalExpression: function ({ value }) {
            // console.log('visitConditionalExpression', astNodeIndex++)
            recordAllFunctions(value.test)
            recordAllFunctions(value.consequent)
            recordAllFunctions(value.alternate)
            return false
        },
        // 12
        visitLogicalExpression: function ({ value }) {
            // console.log('visitLogicalExpression', astNodeIndex++)
            recordAllFunctions(value.left)
            recordAllFunctions(value.right)
            return false
        },
        // 13
        visitIfStatement: function ({ value }) {
            // console.log('visitIfStatement', astNodeIndex++)
            recordAllFunctions(value.test)
            recordAllFunctions(value.consequent)
            recordAllFunctions(value.alternate)
            return false
        },
        // 14
        visitUnaryExpression: function ({ value }) {
            // console.log('visitUnaryExpression', astNodeIndex++)
            recordAllFunctions(value.argument)
            return false
        },
        // 15
        visitArrayExpression: function ({ value }) {
            // console.log('visitArrayExpression', astNodeIndex++)
            forRecordCycle(value.elements)
            return false
        },
        // 16
        visitObjectExpression: function ({ value }) {
            // console.log('visitObjectExpression', astNodeIndex++)
            forRecordCycle(value.properties)
            return false
        },
        // 17
        visitProperty: function ({ value }) {
            // console.log('visitProperty', astNodeIndex++)
            recordAllFunctions(value.value)
            return false
        },
        // 18
        visitForStatement: function ({ value }) {
            // console.log('visitForStatement', astNodeIndex++)
            recordAllFunctions(value.init)
            recordAllFunctions(value.body)
            return false
        },
        // 19
        visitWhileStatement: function ({ value }) {
            // console.log('visitWhileStatement', astNodeIndex++)
            recordAllFunctions(value.body)
            return false
        },
        // 20
        visitDoWhileStatement: function ({ value }) {
            // console.log('visitDoWhileStatement', astNodeIndex++)
            recordAllFunctions(value.body)
            return false
        },
        // 21
        visitBlockStatement: function ({ value }) {
            // console.log('visitBlockStatement', astNodeIndex++)
            forRecordCycle(value.body)
            return false
        },
        // 22
        visitSwitchStatement: function ({ value }) {
            // console.log('visitSwitchStatement', astNodeIndex++)
            forRecordCycle(value.cases)
            return false
        },
        // 23
        visitSwitchCase: function ({ value }) {
            // console.log('visitSwitchCase', astNodeIndex++)
            forRecordCycle(value.consequent)
            return false
        },
        // 24
        visitThrowStatement: function ({ value }) {
            // console.log('visitThrowStatement', astNodeIndex++)
            recordAllFunctions(value.argument)
            return false
        },
        // 25
        visitTryStatement: function ({ value }) {
            // console.log('visitThrowStatement', astNodeIndex++)
            recordAllFunctions(value.block)
            recordAllFunctions(value.handler)
            return false
        },
        // 26
        visitCatchClause: function ({ value }) {
            // console.log('visitThrowStatement', astNodeIndex++)
            recordAllFunctions(value.body)
            return false
        },
    })
}

function logFunctionId(node) {
    const id = `function_${node.loc.start.line}_${node.loc.start.column}`
    // initial function map, set default value of times 0
    funcMap[`${id}`] = {}
    funcMap[`${id}`].name = `${id}`
    funcMap[`${id}`].times = 0
    
    console.log(`${id}, ${funcIndex++}`)
}

function countWhileRunning(id) {
    console.log(id)
    fs.readFile("functions-invoked.json", "utf-8", function(err, data) {
        if (err) {
            throw err;
        }
        let funcMap = JSON.parse(data.toString());
        if (!funcMap)
            funcMap = new Object()
        else {
            if (funcMap[id])
            funcMap[id].times++
            else {
                funcMap[id] = new Object()
                funcMap[id].name = id
                funcMap[id].time = 1
            }
        }
        
        console.log(id, funcMap[id].times)

        fs.writeFile('functions-invoked.json', `${JSON.stringify(funcMap)}`, 'utf-8')    
            
    })

    // console.log(funcMap)
    // if(!funcMap) return
    // fs.writeFileSync('functions-invoked.json', '', 'utf-8')
    // funcMap[id].times++
    // const times = funcMap[id].times
    // fs.appendFileSync('functions-invoked.json', `${id}, times: ${times}\n`, 'utf-8') 
    // fs.appendFileSync('functions-invoked.json', `${JSON.stringify(funcMap)}`, 'utf-8') 
    fs.appendFileSync('functions-executed.json', `${id} executed \n`, 'utf-8')   
}

function recordFunction(node, id) {
    const insertString = `countWhileRunning('${id}')\n`
    const insertAst = recast.parse(insertString).program.body[0]
    node.body.body.unshift(insertAst)
}

function forRecordCycle(nodeArr) {
    const len = nodeArr.length
    for (let i = 0; i < len; i++) {
        recordAllFunctions(nodeArr[i])
    }
}

function recordFuncMapToJson() {
    const funcData = JSON.stringify(funcMap)
    fs.appendFileSync('functions-original.json', `${funcData}`, 'utf-8')
}  

module.exports = {
    funcMap,
    recordAllFunctions,
    recordFuncMapToJson,
    countWhileRunning
}
  