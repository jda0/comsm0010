exports.reserveOffer = function (event, context) {
  let AWS = require('aws-sdk')
  AWS.config.update({ region: 'eu-west-1' })
  let ddb = new AWS.DynamoDB.DocumentClient()

  // get the user
  let user = event.context['cognito-user'] || event.context.user
  let eventid = (event.params && event.params.path && event.params.path.id) || event['body-json'].event
  let type = event['body-json'].type
  let condition = (type === 'bid' ? 'offer > :z' : 'offer < :z')

  let limit = event['body-json'].limit

  // Update the offer
  let queryParams = {
    TableName: 'TakonOffersTable',
    IndexName: 'eventid-offer-index',
    KeyConditionExpression: `eventid = :ev AND ${condition}`,
    FilterExpression: '( attribute_not_exists (reserveExpires) OR :now > reserveExpires ) OR reservedby = :u',
    ExpressionAttributeValues: {
      ':ev': eventid,
      ':u': user,
      ':now': Math.floor(Date.now() / 1000),
      ':z': 0
    }
  }

  let updateParams = {
    TableName: 'TakonOffersTable',
    UpdateExpression: 'set reservedby = :u, reserveExpires = :expiry',
    ExpressionAttributeValues: {
      ':u': user,
      ':expiry': Math.floor(Date.now() / 1000) + 90
    },
    ReturnValues: 'ALL_NEW'
  }

  ddb.query(queryParams, function (err, event) {
    if (err || !event.Items || !event.Items[0] || (limit && event.Items[0].offer > limit)) {
      context.fail(err || 'ItemNotFound')
    } else {
      ddb.update({ ...updateParams, Key: { id: event.Items[0].id } }, function (err, event) {
        if (err) {
          context.fail(err)
        } else {
          context.succeed(event.Attributes)
        }
      })
    }
  })
}
