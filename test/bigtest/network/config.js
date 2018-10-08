import CQLParser, { CQLBoolean } from './cql';

// typical mirage config export
export default function configure() {
  // users
  this.get('/users', ({ users }, request) => {
    if (request.queryParams.query) {
      const cqlParser = new CQLParser();
      cqlParser.parse(request.queryParams.query);
      return users.where({
        id: cqlParser.tree.term
      });
    } else {
      return [];
    }
  });

  // item-storage
  this.get('/service-points', {
    servicepoints: [],
    totalRecords: 0
  });

  this.get('/inventory/items', ({ items }, request) => {
    if (request.queryParams.query) {
      const cqlParser = new CQLParser();
      cqlParser.parse(request.queryParams.query);
      return items.where({
        barcode: cqlParser.tree.term
      });
    } else {
      return items.all();
    }
  });

  this.get('/circulation/loans', ({ loans }, request) => {
    if (request.queryParams.query) {
      const cqlParser = new CQLParser();
      cqlParser.parse(request.queryParams.query);
      if (cqlParser.tree instanceof CQLBoolean) {
        return loans.where({
          itemId: cqlParser.tree.left.term
        });
      } else {
        return loans.where({
          itemId: cqlParser.tree.term
        });
      }
    } else {
      return loans.all();
    }
  });

  this.put('/circulation/loans/:id', (_, request) => {
    return JSON.parse(request.requestBody);
  });

  this.get('/holdings-storage/holdings', {
    holdingsRecords: [],
    totalRecords: 0
  });

  this.get('/circulation/requests', {
    requests: [],
    totalRecords: 0
  });

  this.get('/service-points-users', {
    servicePointsUsers: [],
    totalRecords: 0
  });

  this.get('/staff-slips-storage/staff-slips', {});
  this.get('/groups', {});
  this.get('/addresstypes', {});
  this.get('/users/:id', {});
  this.get('/perms/users/:id/permissions', {});
}
