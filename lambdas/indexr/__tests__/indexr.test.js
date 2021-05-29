describe('indexr', () => {
  test('do index', () => {});
});
/*
const nock = require('nock');
const nockBack = nock.back;

const insertEvent = require('./dynamoStreamFixtures/insertEvent.json');
const modifyEvent = require('./dynamoStreamFixtures/modifyEvent.json');
const removeEvent = require('./dynamoStreamFixtures/removeEvent.json');

nockBack.fixtures = `${__dirname}/nockFixtures`;
nockBack.setMode('record');

describe('testing indexer lambda', () => {
  const startEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    nock.restore();
    process.env = { ...startEnv };
  });

  afterAll(() => {
    process.env = startEnv;
  });

  test('insert event', async () => {
    process.env.FIELDS = 'name,sku';
    process.env.STATIC_FIELDS = 'sku';
    process.env.IDX_TABLE = 'table-name';
    const indexr = require('../index');
    const { nockDone } = await nockBack('insertEvent.json', {
      before(scope) {
        scope.filteringRequestBody = (body, recordedBody) =>
          body.replace(/"id":{"S":"([\w-]+)"}/, `"id":{"S":"${recordedBody.Item.id.S}"}`);
      },
    });
    await indexr.handler(insertEvent);
    nockDone();
  });

  test('modify event', async () => {
    process.env.FIELDS = 'name,sku';
    process.env.STATIC_FIELDS = 'sku';
    process.env.IDX_TABLE = 'table-name';
    const indexr = require('../index');
    const { nockDone } = await nockBack('modifyEvent.json', {
      before(scope) {
        scope.filteringRequestBody = (body, recordedBody) => {
          if (recordedBody.Item && recordedBody.Item.id && recordedBody.Item.id.S) {
            return body.replace(/"id":{"S":"([\w-]+)"}/, `"id":{"S":"${recordedBody.Item.id.S}"}`);
          }
          return body;
        };
      },
    });
    await indexr.handler(modifyEvent);
    nockDone();
  });

  test('remove event', async () => {
    process.env.FIELDS = 'name,sku';
    process.env.STATIC_FIELDS = 'sku';
    process.env.IDX_TABLE = 'table-name';
    const indexr = require('../index');
    const { nockDone } = await nockBack('removeEvent.json', {
      before(scope) {
        scope.filteringRequestBody = (body, recordedBody) => {
          if (recordedBody.Item && recordedBody.Item.id && recordedBody.Item.id.S) {
            return body.replace(/"id":{"S":"([\w-]+)"}/, `"id":{"S":"${recordedBody.Item.id.S}"}`);
          }
          return body;
        };
      },
    });
    await indexr.handler(removeEvent);
    nockDone();
  });
});
*/
