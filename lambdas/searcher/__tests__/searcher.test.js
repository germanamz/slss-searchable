describe('searcher', () => {
  test('do search', () => {});
});
/*
const nock = require('nock');
const nockBack = nock.back;

nockBack.fixtures = `${__dirname}/nockFixtures`;
nockBack.setMode('record');

describe('testing searcher lambda', () => {
  const startEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    nock.restore();
    process.env = { ...startEnv };
  });

  afterAll(() => {
    process.env = startEnv;
  });

  test('With query', async () => {
    process.env.SCANNER_ARN = 'arn:aws:lambda:us-east-1:11111111111111:function:slss-s-scanner-lambda-table-name';
    process.env.TOTAL_SEGMENTS = '5';
    const searcher = require('../index');
    const { nockDone } = await nockBack('searchWithQuery.json');
    const res = await searcher.handler({
      arguments: {
        query: 'broca',
        limit: 60,
      },
    });
    nockDone();
    expect(res).toEqual([
      {
        'segment': 0,
        'items': [
          {
            '__typename': 'Product',
            'updatedOn': '2021-04-23T17:13:35.576Z',
            'satUnitId': 'H87',
            'createdOn': '2021-04-23T17:13:35.576Z',
            'status': 'ACTIVE',
            'id': '6a6a303f-13f7-4470-ae3e-3f2e129d75a9',
            'name': 'BROCA TRIUM AV 11211 11/64',
            'satCategoryId': '27111500',
            'sku': 'TRIU11/64',
          },
        ],
      },
    ]);
  });

  test('With static query', async () => {
    process.env.SCANNER_ARN = 'arn:aws:lambda:us-east-1:11111111111111:function:slss-s-scanner-lambda-table-name';
    process.env.TOTAL_SEGMENTS = '5';
    const searcher = require('../index');
    const { nockDone } = await nockBack('searchWithStaticQuery.json');
    const res = await searcher.handler({
      arguments: {
        staticQuery: 'triu11/64',
        limit: 60,
      },
    });
    nockDone();
    expect(res).toEqual([
      {
        'segment': 0,
        'items': [
          {
            '__typename': 'Product',
            'updatedOn': '2021-04-23T17:13:35.576Z',
            'satUnitId': 'H87',
            'createdOn': '2021-04-23T17:13:35.576Z',
            'status': 'ACTIVE',
            'id': '6a6a303f-13f7-4470-ae3e-3f2e129d75a9',
            'name': 'BROCA TRIUM AV 11211 11/64',
            'satCategoryId': '27111500',
            'sku': 'TRIU11/64',
          },
        ],
      },
    ]);
  });

  test('With static and normal query', async () => {
    process.env.SCANNER_ARN = 'arn:aws:lambda:us-east-1:11111111111111:function:slss-s-scanner-lambda-table-name';
    process.env.TOTAL_SEGMENTS = '5';
    const searcher = require('../index');
    const { nockDone } = await nockBack('searchWithStaticAndQuery.json');
    const res = await searcher.handler({
      arguments: {
        query: 'imper',
        staticQuery: 'triu11/64',
        limit: 60,
      },
    });
    nockDone();
    expect(res).toEqual([
      {
        'segment': 0,
        'items': [
          {
            '__typename': 'Product',
            'updatedOn': '2021-04-23T17:13:35.576Z',
            'satUnitId': 'H87',
            'createdOn': '2021-04-23T17:13:35.576Z',
            'status': 'ACTIVE',
            'id': '6a6a303f-13f7-4470-ae3e-3f2e129d75a9',
            'name': 'BROCA TRIUM AV 11211 11/64',
            'satCategoryId': '27111500',
            'sku': 'TRIU11/64',
          },
        ],
      },
      {
        'segment': 1,
        'items': [
          {
            '__typename': 'Product',
            'updatedOn': '2021-04-23T17:10:08.055Z',
            'satUnitId': 'XBJ',
            'createdOn': '2021-04-23T17:10:08.055Z',
            'status': 'ACTIVE',
            'id': '49fe9167-5253-479e-95c2-ae0129388b19',
            'name': 'IMPERLACK 5 AÑOS ROJO CUB',
            'satCategoryId': '31201600',
            'sku': 'SIG050.5',
          },
        ],
      },
    ]);
  });
});
*/
