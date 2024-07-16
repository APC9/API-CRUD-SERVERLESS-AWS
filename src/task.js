const { v4 } = require('uuid')
const AWS = require('aws-sdk')

const addTask = async (event) => {
  const dynamodb = new AWS.DynamoDB.DocumentClient();

  const { title, description } = JSON.parse(event.body)
  const createdAt = new Date()
  const id = v4()

  const newTask = {
    id,
    title,
    description,
    createdAt,
    done: false
  }

  await dynamodb.put({
    TableName: 'APC-taskTable',
    Item: newTask
  }).promise()

  return {
    statusCode: 200,
    body: JSON.stringify(newTask)
  }
}

const getTasks = async (event) => {
  const dynamodb = new AWS.DynamoDB.DocumentClient();

  try {
    const result = await dynamodb.scan({
      TableName: 'APC-taskTable',
    }).promise()
  
    const tasks = result.Items
  
    return {
      statusCode: 200,
      body: JSON.stringify(tasks)
    }
  } catch (error) {
    console.log({error})
  }

}

const getTask = async (event) => {
  const dynamodb = new AWS.DynamoDB.DocumentClient();

  try {
    const { id } = event.pathParameters;

    const result = await dynamodb.get({
      TableName: 'APC-taskTable',
      Key: {
        id     
      }
    }).promise()
    
    return {
      statusCode: 200,
      body: JSON.stringify(result.Item)
    }
  } catch (error) {
    console.log({error})
  }

}

const updateTask = async (event) => {
  const dynamodb = new AWS.DynamoDB.DocumentClient();
  
  try {
    const { id } = event.pathParameters;
    const { done, title, description } = JSON.parse(event.body)
    
    const result = await dynamodb.update({
      TableName: 'APC-taskTable',
      Key: {
        id     
      },
      UpdateExpression: 'set done = :done, title = :title, description = :description',
      ExpressionAttributeValues: {
        ':done' : done,
        ':title' : title,
        ':description' : description
      },
      ReturnValues: 'ALL_NEW'
    }).promise()
    
    return {
      statusCode: 200,
      body: "update successfully"
    }
  } catch (error) {
    console.log({error})
  }
  
}

const deleteTask = async (event) => {
  const dynamodb = new AWS.DynamoDB.DocumentClient();

  try {
    const { id } = event.pathParameters;

    const result = await dynamodb.delete({
      TableName: 'APC-taskTable',
      Key: {
        id     
      }
    }).promise()
    
    return {
      statusCode: 200,
      body: "delete successfully"
    }
  } catch (error) {
    console.log({error})
  }

} 
module.exports = {
  addTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask
}