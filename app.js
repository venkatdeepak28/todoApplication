let express = require('express')
let app = express()

app.use(express.json())

let path = require('path')

let {open} = require('sqlite')
let sqlite3 = require('sqlite3')

let dbpath = path.join(__dirname, 'todoApplication.db')

let db = null

let iniatilizeDbandServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server Started')
    })
  } catch (e) {
    console.log(`Error: "${e.messagse}"`)
    process.exit(1)
  }
}

module.exports = app

iniatilizeDbandServer()

// API 1

app.get('/todos/', async (request, response) => {
  let {status = '', priority = '', search_q = ''} = request.query
  status = status.replace('%20', ' ')
  if (status !== '' && priority !== '') {
    //Third Scenario

    const singleQuery = `SELECT * FROM todo WHERE 
    status LIKE "%${status}%"
    AND priority LIKE "%${priority}%";`
    let singleValue = await db.all(singleQuery)

    //Third Scenario
    response.send(singleValue)
  } else if (status !== '' && priority === '') {
    // First Scenario

    const singleQuery = `SELECT * FROM todo WHERE 
    status LIKE "%${status}%";`
    let singleValue = await db.all(singleQuery)
    response.send(singleValue)

    // First Scenario
  } else if (priority !== '' && status === '') {
    // Second Scenario

    const singleQuery = `SELECT * FROM todo WHERE 
    priority LIKE "%${priority}%";`
    let singleValue = await db.all(singleQuery)
    response.send(singleValue)

    // Second Scenario
  } else {
    // fourth Scenario

    const singleQuery = `SELECT * FROM todo WHERE 
    todo LIKE "%${search_q}%";`
    let singleValue = await db.all(singleQuery)
    response.send(singleValue)

    // fourth Scenario
  }
})

// API 2

app.get('/todos/:todoId', async (request, response) => {
  let {todoId} = request.params
  const specificTodoQuery = `SELECT * FROM todo WHERE id = ${todoId};`
  let specificTodoValue = await db.all(specificTodoQuery)
  response.send(specificTodoValue[0])
})

// API 3

app.post('/todos/', async (request, response) => {
  let {id, todo, priority, status} = request.body
  const insertValueQuery = `INSERT INTO todo(id,todo,priority,status) VALUES(${id},"${todo}","${priority}","${status}");`
  await db.run(insertValueQuery)
  response.send('Todo Successfully Added')
})

// API 4

app.put('/todos/:todoId/', async (request, response) => {
  let {todoId} = request.params
  let {status = '', priority = '', todo = ''} = request.body
  if (status !== '') {
    const statusUpdateQuery = `update todo set status = "${status}" where id = ${todoId};`
    await db.run(statusUpdateQuery)
    response.send('Status Updated')
  } else if (priority !== '') {
    const priorityUpdateQuery = `update todo set priority = "${priority}" where id = ${todoId};`
    await db.run(priorityUpdateQuery)
    response.send('Priority Updated')
  } else if (todo !== '') {
    const todoUpdateQuery = `update todo set todo = "${todo}" where id = ${todoId};`
    await db.run(todoUpdateQuery)
    response.send('Todo Updated')
  }
})

// API 5

app.delete('/todos/:todoId', async (request, response) => {
  let {todoId} = request.params
  const deleteQuery = `delete from todo where id = ${todoId};`
  await db.run(deleteQuery)
  response.send('Todo Deleted')
})
