/* eslint no-undef:0 */
import sinon from 'sinon';
import sinonchai from 'sinon-chai';
import chai, { expect } from 'chai';
import assertArrays from 'chai-arrays';
import app from '../../../server';
import mocks from '../../fixtures/mocks';
import user from '../../fixtures/user.json';

chai.use(sinonchai);
chai.use(assertArrays);

let server;
before(async () => {
  try {
    server = await app;
  } catch (e) {
    cano.log.error(e);
  }
});

after(() => {
    server.close();
});

let sandbox;
beforeEach(() => {
    sandbox = sinon.createSandbox();
});

afterEach(() => {
    sandbox.restore();
});

describe('UserController', () => {
  describe('create', () => {
    it('should set 201 to status and set User.create success response to body', async () => {
        const ctx = mocks.createContext();
        sandbox.stub(User, 'create').resolves(user);
        await UserController.create(ctx);
        expect(User.create).to.be.have.been.calledOnce;
        expect(ctx.status).to.be.equals(201);
        expect(ctx.body).to.deep.equal(user);
    });
  });
  describe('getById', () => {
    it('should set 200 to status and set User.getById success response to body', async () => {
        const ctx = mocks.createContext();
        ctx.params.id = '5b305152d9317d33e87c2620';
        sandbox.stub(User, 'getById').resolves(user);
        await UserController.getById(ctx);
        expect(User.getById).to.be.have.been.calledOnce;
        expect(User.getById).to.have.been.calledWith(ctx.params.id);
        expect(ctx.status).to.be.equals(200);
        expect(ctx.body).to.deep.equal(user);
    });
  });
  describe('get', () => {
    it('should set 200 to status and set User.get collection property to body', async () => {
        const ctx = mocks.createContext();
        ctx.request.query = {};
        const searchResponse = mocks.getSearchResponse();
        sandbox.stub(User, 'get').resolves(searchResponse);
        sandbox.spy(ctx, 'set');
        await UserController.get(ctx);
        expect(User.get).to.be.have.been.calledOnce;
        expect(User.get).to.have.been.calledWith(ctx.request.query);
        expect(ctx.set).to.have.been.calledTwice;
        expect(ctx.set.firstCall).to.have.been.calledWith(
            'X-Pagination-Total-Count',
             searchResponse.pagination['X-Pagination-Total-Count']
        );
        expect(ctx.set.secondCall).to.have.been.calledWith(
            'X-Pagination-Limit',
             searchResponse.pagination['X-Pagination-Limit']
        );
        expect(ctx.status).to.be.equals(200);
        expect(ctx.body).to.be.equalTo(searchResponse.collection);
    });
  });
  describe('updateById', () => {
    it('should set 204 to status', async () => {
        const ctx = mocks.createContext();
        ctx.request.query = {};
        sandbox.stub(UserService, 'update').resolves(true);
        await UserController.updateById(ctx);
        expect(UserService.update).to.be.have.been.calledOnce;

        expect(ctx.status).to.be.equals(204);
    });
  });
  describe('deleteById', () => {
    it('should set 204 to status', async () => {
        const ctx = mocks.createContext();
        ctx.params.id = '5b305152d9317d33e87c2620';
        sandbox.stub(User, 'deleteById').resolves(true);
        await UserController.deleteById(ctx);
        expect(User.deleteById.calledOnce).to.be.true;
        expect(User.deleteById).to.have.been.calledWith(ctx.params.id);
        expect(ctx.status).to.be.equals(204);
    });
  });
});
