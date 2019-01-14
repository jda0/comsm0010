exports.listOffers = function (event, context) {
  var AWS = require('aws-sdk')
  AWS.config.update({ region: 'eu-west-1' })
  var ddb = new AWS.DynamoDB.DocumentClient()

  var params = {
    TableName: 'TakonOffersTable',
    IndexName: 'eventid-offer-index',
    FilterExpression: 'eventid = :e',
    ExpressionAttributeValues: {
      ':e': event.id
    }
  }

  // Call DynamoDB to scan the table
  ddb.scan(params, function (err, data) {
    if (err) {
      context.fail(err)
    } else {
      // reduce the list to return number of offers for every value
      let list = data.Items.reduce((a, b) => {
        return { ...a, [b.offer]: (a[b.offer] || 0) + 1 }
      }, {})
      context.succeed(list)
    }
  })
}
