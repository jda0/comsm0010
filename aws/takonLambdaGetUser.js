exports.handler = function (event, context) {
  let AWS = require('aws-sdk')
  AWS.config.update({ region: 'eu-west-1' })
  let ddb = new AWS.DynamoDB.DocumentClient()

  let username = event.username || event.context['cognito-user'] || event.context.user

  let params = {
    TableName: 'TakonUserFundsTable',
    Key: {
      username
    }
  }

  ddb.get(params, function (err, data) {
    if (err) {
      context.fail(err)
    } else if (Object.keys(data).length === 0 && data.constructor === Object) {
      context.succeed({ username })
    } else {
      context.succeed(data.Item)
    }
  })
}
