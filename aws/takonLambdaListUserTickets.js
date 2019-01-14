exports.handler = function (event, context) {
  let AWS = require('aws-sdk')
  AWS.config.update({ region: 'eu-west-1' })
  let ddb = new AWS.DynamoDB.DocumentClient()

  let username = event.username || event.context['cognito-user'] || event.context.user

  let params = {
    TableName: 'TakonTicketsTable',
    IndexName: 'user-index',
    KeyConditionExpression: '#u = :u',
    ExpressionAttributeNames: {
      '#u': 'user'
    },
    ExpressionAttributeValues: {
      ':u': username
    },
    Count: 24
  }

  ddb.query(params, function (err, data) {
    if (err) {
      context.fail(err)
    } else {
      context.succeed(data.Items || data)
    }
  })
}
