describe('scanner', () => {
  test('do scan', () => {});
});
/*
const nock = require('nock');
const nockBack = nock.back;

nockBack.fixtures = `${__dirname}/nockFixtures`;
nockBack.setMode('record');

describe('testing scanner lambda', () => {
  const startEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    nock.restore();
    process.env = { ...startEnv };
  });

  afterAll(() => {
    process.env = startEnv;
  });

  test('With text', async () => {
    process.env.IDX_TABLE = 'slss-s-idx-table-name';
    process.env.DATA_TABLE = 'table-name';
    process.env.TOTAL_SEGMENTS = '5';
    const scanner = require('../index');
    const { nockDone } = await nockBack('scanForTokensInstances.json');
    const res = await scanner.handler({
      tokens: ['bro', 'imp'],
      limit: 60,
      segment: 2,
    });
    nockDone();
    expect(res).toEqual({
      segment: 2,
      items: [
        {
          __typename: 'Product',
          updatedOn: '2021-04-23T17:13:35.576Z',
          satUnitId: 'H87',
          createdOn: '2021-04-23T17:13:35.576Z',
          status: 'ACTIVE',
          id: '6a6a303f-13f7-4470-ae3e-3f2e129d75a9',
          name: 'BROCA TRIUM AV 11211 11/64',
          satCategoryId: '27111500',
          sku: 'TRIU11/64'
        }
      ],
      nextToken: undefined
    });
  });
});
*/
