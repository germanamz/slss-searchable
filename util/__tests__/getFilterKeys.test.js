const faker = require('faker');
const { v4: uuidv4 } = require('uuid');

const getFilterKeys = require('../getFilterKeys');

const ids = [uuidv4(), uuidv4(), uuidv4()];
const names = [faker.name.firstName(), faker.name.firstName(), faker.name.firstName()];

describe('getFilterKeys', () => {
  test('serialize simple filter', () => {
    const id = uuidv4();
    const {
      ExpressionAttributeValues,
      FilterExpression,
      ExpressionAttributeNames,
    } = getFilterKeys({
      id,
    });

    expect(FilterExpression).toEqual('#id = :id');
    expect(ExpressionAttributeValues).toEqual({
      ':id': {
        S: id,
      },
    });
    expect(ExpressionAttributeNames).toEqual({
      '#id': 'id',
    });
  });

  test('serialize simple filter with multiple expressions', () => {
    const id = uuidv4();
    const name = faker.name.firstName();
    const {
      ExpressionAttributeValues,
      FilterExpression,
      ExpressionAttributeNames,
    } = getFilterKeys({
      id,
      name,
    });

    expect(FilterExpression).toEqual('#id = :id AND #name = :name');
    expect(ExpressionAttributeValues).toEqual({
      ':id': {
        S: id,
      },
      ':name': {
        S: name,
      },
    });
    expect(ExpressionAttributeNames).toEqual({
      '#id': 'id',
      '#name': 'name',
    });
  });

  test('serialize filter with oneOf', () => {
    const {
      ExpressionAttributeValues,
      FilterExpression,
      ExpressionAttributeNames,
    } = getFilterKeys({
      id: {
        $oneOf: ids,
      },
    });

    expect(FilterExpression).toEqual('#id IN (:id0,:id1,:id2)');
    // expect(FilterExpression).toEqual(`#id IN (${ids.join(', ')})`);
    expect(ExpressionAttributeValues).toEqual({
      ':id0': {
        S: ids[0],
      },
      ':id1': {
        S: ids[1],
      },
      ':id2': {
        S: ids[2],
      },
    });
    expect(ExpressionAttributeNames).toEqual({
      '#id': 'id',
    });
  });

  test('serialize filter with multiple oneOf', () => {
    const {
      ExpressionAttributeValues,
      FilterExpression,
      ExpressionAttributeNames,
    } = getFilterKeys({
      id: {
        $oneOf: ids,
      },
      name: {
        $oneOf: names,
      },
    });

    expect(FilterExpression).toEqual('#id IN (:id0,:id1,:id2) AND #name IN (:name0,:name1,:name2)');
    // expect(FilterExpression).toEqual(`#id IN (${ids.join(', ')}) AND #name IN (${names.join(', ')})`);
    expect(ExpressionAttributeValues).toEqual({
      ':id0': {
        S: ids[0],
      },
      ':id1': {
        S: ids[1],
      },
      ':id2': {
        S: ids[2],
      },
      ':name0': {
        S: names[0],
      },
      ':name1': {
        S: names[1],
      },
      ':name2': {
        S: names[2],
      },
    });
    expect(ExpressionAttributeNames).toEqual({
      '#id': 'id',
      '#name': 'name',
    });
  });

  test('serialize filter with and', () => {
    const id = uuidv4();
    const name = faker.name.firstName();
    const {
      ExpressionAttributeValues,
      FilterExpression,
      ExpressionAttributeNames,
    } = getFilterKeys({
      $and: [
        {
          id,
        },
        {
          name,
        },
      ],
    });

    expect(FilterExpression).toEqual('(#id = :id AND #name = :name)');
    expect(ExpressionAttributeValues).toEqual({
      ':id': {
        S: id,
      },
      ':name': {
        S: name,
      },
    });
    expect(ExpressionAttributeNames).toEqual({
      '#id': 'id',
      '#name': 'name',
    });
  });

  test('serialize filter with or', () => {
    const id = uuidv4();
    const name = faker.name.firstName();
    const {
      ExpressionAttributeValues,
      FilterExpression,
      ExpressionAttributeNames,
    } = getFilterKeys({
      $or: [
        {
          id,
        },
        {
          name,
        },
      ],
    });

    expect(FilterExpression).toEqual('(#id = :id OR #name = :name)');
    expect(ExpressionAttributeValues).toEqual({
      ':id': {
        S: id,
      },
      ':name': {
        S: name,
      },
    });
    expect(ExpressionAttributeNames).toEqual({
      '#id': 'id',
      '#name': 'name',
    });
  });

  test('serialize filter oneOf in and', () => {
    const {
      ExpressionAttributeValues,
      FilterExpression,
      ExpressionAttributeNames,
    } = getFilterKeys({
      $and: [
        {
          id: {
            $oneOf: ids,
          },
        },
        {
          name: {
            $oneOf: names,
          },
        },
      ],
    });

    expect(FilterExpression).toEqual('(#id IN (:id0,:id1,:id2) AND #name IN (:name0,:name1,:name2))');
    // expect(FilterExpression).toEqual(`(#id IN (${ids.join(', ')}) AND #name IN (${names.join(', ')}))`);
    expect(ExpressionAttributeValues).toEqual({
      ':id0': {
        S: ids[0],
      },
      ':id1': {
        S: ids[1],
      },
      ':id2': {
        S: ids[2],
      },
      ':name0': {
        S: names[0],
      },
      ':name1': {
        S: names[1],
      },
      ':name2': {
        S: names[2],
      },
    });
    expect(ExpressionAttributeNames).toEqual({
      '#id': 'id',
      '#name': 'name',
    });
  });

  /*test('serialize complex filter', () => {
    const zips = [faker.address.zipCode(), faker.address.zipCode(), faker.address.zipCode()];
    const city = faker.address.city();
    const state = faker.address.state();
    const product = faker.commerce.productName();
    const price = faker.commerce.price();
    const date = faker.date.soon().toISOString();
    const account = faker.finance.account();
    const companyName = faker.company.companyName();

    const {
      ExpressionAttributeValues,
      FilterExpression,
    } = getFilterKeys({
      product,
      $or: [
        {
          city,
        },
        {
          state,
        },
        {
          $and: [
            {
              price,
            },
            {
              date,
            },
          ],
        },
        {
          zip: {
            $oneOf: zips,
          },
        },
      ],
      $and: [
        {
          id: {
            $oneOf: ids,
          },
        },
        {
          $or: [
            {
              account,
            },
            {
              companyName,
            },
          ],
        },
        {
          name: {
            $oneOf: names,
          },
        },
      ],
    });

    expect(FilterExpression).toEqual('(#product = :product) AND ((#city = :city OR #state = :state) OR (#price = :price AND #date = :date) OR (zip IN (:zip0, :zip1, :zip2))) AND ((id IN (:id0, :id1, :id2)) AND ((account = :account) OR (companyName = :companyName)) AND (name IN (:name0, :name1, :name2)))');
    expect(ExpressionAttributeValues).toEqual({
      ':product': {
        S: product,
      },
      ':city': {
        S: city,
      },
      ':state': {
        S: state,
      },
      ':price': {
        S: price,
      },
      ':date': {
        S: date,
      },
      ':zip0': {
        S: zips[0],
      },
      ':zip1': {
        S: zips[1],
      },
      ':zip2': {
        S: zips[2],
      },
      ':account': {
        S: account,
      },
      ':companyName': {
        S: companyName,
      },
      ':id0': {
        S: ids[0],
      },
      ':id1': {
        S: ids[1],
      },
      ':id2': {
        S: ids[2],
      },
      ':name0': {
        S: names[0],
      },
      ':name1': {
        S: names[1],
      },
      ':name2': {
        S: names[2],
      },
    });
  });*/
});
