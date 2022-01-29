export default {
  // message 1
  instanceTerminatedMessage: {
    version: '0',
    id: '6a7e8feb-b491-4cf7-a9f1-bf3703467718',
    'detail-type': 'EC2 Instance State-change Notification',
    source: 'aws.ec2',
    account: '111122223333',
    time: '2017-12-22T18:43:48Z',
    region: 'us-west-1',
    resources: [
      'arn:aws:ec2:us-west-1:123456789012:instance/i-1234567890abcdef0',
    ],
    detail: {
      'instance-id': ' i-1234567890abcdef0',
      state: 'terminated',
    },
  },
  // message 2
  basicMessage: {
    exampleValue: 'test',
  },
  // message 3
  httpMessage: {
    body: {
      id: 1234,
      userId: 'user@example.com',
      price: 10.0,
      serviceTier: 'premium',
      address: '2965 S Sierra Heights, Mesa, AZ 85212',
      createdAt: 1000001231234,
      eb_event_id: '',
    },
    method: 'POST',
    principalId: '',
    stage: 'dev',
    headers: {
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Encoding': 'gzip, deflate',
      'Accept-Language': 'en-us',
      'CloudFront-Forwarded-Proto': 'https',
      'CloudFront-Is-Desktop-Viewer': 'true',
      'CloudFront-Is-Mobile-Viewer': 'false',
      'CloudFront-Is-SmartTV-Viewer': 'false',
      'CloudFront-Is-Tablet-Viewer': 'false',
      'CloudFront-Viewer-Country': 'US',
      Cookie:
        '__gads=ID=d51d609e5753330d:T=1443694116:S=ALNI_MbjWKzLwdEpWZ5wR5WXRI2dtjIpHw; __qca=P0-179798513-1443694132017; _ga=GA1.2.344061584.1441769647',
      Host: 'xxx.execute-api.us-east-1.amazonaws.com',
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/601.6.17 (KHTML, like Gecko) Version/9.1.1 Safari/601.6.17',
      Via: '1.1 c8a5bb0e20655459eaam174e5c41443b.cloudfront.net (CloudFront)',
      'X-Amz-Cf-Id': 'z7Ds7oXaY8hgUn7lcedZjoIoxyvnzF6ycVzBdQmhn3QnOPEjJz4BrQ==',
      'X-Forwarded-For': '221.24.103.21, 54.242.148.216',
      'X-Forwarded-Port': '443',
      'X-Forwarded-Proto': 'https',
    },
    query: {},
    path: {},
    identity: {
      cognitoIdentityPoolId: '',
      accountId: '',
      cognitoIdentityId: '',
      caller: '',
      apiKey: '',
      sourceIp: '221.24.103.21',
      cognitoAuthenticationType: '',
      cognitoAuthenticationProvider: '',
      userArn: '',
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/601.6.17 (KHTML, like Gecko) Version/9.1.1 Safari/601.6.17',
      user: '',
    },
    stageVariables: {},
  },
};
