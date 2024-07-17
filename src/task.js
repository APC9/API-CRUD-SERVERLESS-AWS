import { 
  DeleteItemCommand,
  DynamoDBClient, 
  GetItemCommand, 
  PutItemCommand, 
  ScanCommand, 
  UpdateItemCommand 
} from "@aws-sdk/client-dynamodb"; 
import { v4 } from 'uuid'

const TableName = 'APC-taskTable'

export const addTask = async (event) => {
  const client = new DynamoDBClient()
  
  try {    
    const { title, description } = JSON.parse(event.body)
    const createdAt = new Date().toISOString();
    const id = v4()
    
    const Item = {
      id: { S: id },
      title: { S: title },
      description: { S: description },
      createdAt: { S: createdAt },
      done: { BOOL: false }
    }
  
    const input = {
      TableName,
      Item,
      ReturnValues: "ALL_OLD",
       ReturnItemCollectionMetrics: "SIZE"
    }
    
    const command = new PutItemCommand(input)
    return await client.send(command)

  } catch (error) {
    console.error("Error adding task:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to add task" })
    };
  }
}


export const getTasks = async () => {
  const client = new DynamoDBClient()

  const input = {
    TableName,
    Limit: Number("int"),
    TotalSegments: Number("int"),
    Segment: Number("int"),
  }

  const command = new ScanCommand(input);
  return await client.send(command);

}

export const getTask = async (event) => {
  const client = new DynamoDBClient()
  const { id } = event.pathParameters
  
  const input = {
    TableName,
    Key: {
      id: { S: id }
    }
  }

  const command = new GetItemCommand(input);
  return await client.send(command);
}

export const updateTask = async (event) => {
  const client = new DynamoDBClient()

  try {
    const { id } = event.pathParameters;
    const { done, title, description } = JSON.parse(event.body)
    
    const input = {
      TableName,
      Key: {
        id: { S: id }
      },
      UpdateExpression: 'set done = :done, title = :title, description = :description',
      ExpressionAttributeValues: {
        ':done': { BOOL: done },
        ':title': { S: title },
        ':description': { S: description }
      },
      ReturnValues: 'ALL_NEW'
    };
    
    const command = new UpdateItemCommand(input);
    return await client.send(command);

  } catch (error) {
    console.log({error})
  }
  
}

export const deleteTask = async (event) => {
  const client = new DynamoDBClient()
  const { id } = event.pathParameters
  
  const input = {
    TableName,
    Key: {
      id: { S: id }
    },
    ReturnValues: "ALL_OLD"
  }

  const command = new DeleteItemCommand(input);
  return await client.send(command);
} 
