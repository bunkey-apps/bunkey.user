/* eslint no-undef:0 */
import sinon from 'sinon';
import sinonchai from 'sinon-chai';
import chai, { expect } from 'chai';
import assertArrays from 'chai-arrays';
import app from '../../../server';
import mocks from '../../fixtures/mocks';

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

describe('AuthPolicies', () => {
    describe('localAuth', () => {
      it('should be rejected with RequestError when missingCredentials is true', async () => {
        const ctx = mocks.createContext();
        sandbox
          .stub(cano.passport, 'authenticate')
          .withArgs('local', sinon.match.any)
          .callsFake((strategy, cb) => {
            cb(null, null, true) // err, accessToken, missingCredentials
              .catch((err) => {
                expect(err).to.be.an.instanceof(RequestError);
                expect(err.content.code).to.be.equals('MissingFields');
            });
            return () => {};
        });
        await AuthPolicies.localAuth(ctx, sinon.spy());
      });
      it('should be rejected with Error when error is unknown', async () => {
        const ctx = mocks.createContext();
        sandbox
          .stub(cano.passport, 'authenticate')
          .withArgs('local', sinon.match.any)
          .callsFake((strategy, cb) => {
            cb(new Error('Unknown'), null, null) // err, accessToken, missingCredentials
              .catch((err) => {
                expect(err).to.be.an.instanceof(Error);
                expect(err.message).to.be.equals('Unknown');
            });
            return () => {};
        });
        await AuthPolicies.localAuth(ctx, sinon.spy());
      });
      it('should set 200 to status and set accessToken to state.data property', async () => {
        const ctx = mocks.createContext();
        const token = 'Q7i8r0C4VpK2HEauDit0';
        sandbox
          .stub(cano.passport, 'authenticate')
          .withArgs('local', sinon.match.any)
          .yields(null, token, null)
          .returns(() => {});

        await AuthPolicies.localAuth(ctx, sinon.spy());
        expect(ctx.status).to.be.equals(200);
        expect(ctx.state.data).to.be.equals(token);
      });
    });
});
