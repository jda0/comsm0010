exports.listEvents = function (event, context) {
  let AWS = require('aws-sdk')
  AWS.config.update({ region: 'eu-west-1' })
  let ddb = new AWS.DynamoDB.DocumentClient()

  let params = {
    TableName: 'TakonEventTable',
    IndexName: 'id-datetime-index',
    Limit: 12,
    FilterExpression: '#dt > :now',
    ExpressionAttributeValues: {
      ':now': Math.floor(Date.now() / 1000)
    },
    ExpressionAttributeNames: {
      '#dt': 'datetime'
    }
  }

  // Call DynamoDB to scan the table
  ddb.scan(params, function (err, data) {
    if (err) {
      context.fail(err)
    } else {
      context.succeed(data.Items || data)
    }
  })
}
