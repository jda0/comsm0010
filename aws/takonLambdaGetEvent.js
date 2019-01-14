exports.getEvent = function (event, context) {
  var AWS = require('aws-sdk')
  AWS.config.update({ region: 'eu-west-1' })
  var ddb = new AWS.DynamoDB.DocumentClient()

  var params = {
    TableName: 'TakonEventTable',
    Key: {
      'id': event.id
    }
  }

  // Call DynamoDB to read the item from the table
  ddb.get(params, function (err, data) {
    if (err) {
      context.fail(err)
    } else {
      context.succeed(data.Item || data)
    }
  })
}
