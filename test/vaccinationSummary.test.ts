import * as chai from 'chai';
import chaiHttp = require('chai-http');
import app from '../index';
import ErrorCodes  from "../common/helpers/errorCodes";
import { generalUtility } from "../common/helpers/general";
// var should = chai.should();

chai.use(chaiHttp);
describe('GET /vaccination-summary', () => {
  const BadRequest:{'code': number, 'messages': {[key: string]: string}} = ErrorCodes['BadRequest'];
  describe(BadRequest['messages']['missing'], () => {
    it('request should throw bad request error', (done) => {
      chai.request(app)
        .get('/vaccine-summary')
        .end((err, res) => {
          chai.expect(res.status).to.eql(BadRequest['code']);
          chai.expect(Object.keys(res.body).length).to.eql(2);
          chai.expect(res['body']['info']).to.eql(BadRequest['messages']['missing']);
          done();
        });
    });
  });
  describe(BadRequest['messages']['case1'], () => {
    it('request should throw bad request error with case1 error', (done) => {
      chai.request(app)
        .get('/vaccine-summary?c=AT&dateFrom=2021-W01&dateTo=2020-W11&range=1')
        .end((err, res) => {
          chai.expect(Object.keys(res.body).length).to.eql(2);
          chai.expect(res.status).to.eql(BadRequest['code']);
          chai.expect(res['body']['info']).to.eql(BadRequest['messages']['case1']);
          done();
        });
    });
  });
  describe(BadRequest['messages']['case2'], () => {
    it('request should throw bad request error with case2 error', (done) => {
      chai.request(app)
        .get('/vaccine-summary?c=AT&dateFrom=2019-W01&dateTo=2019-W20&range=1')
        .end((err, res) => {
          chai.expect(Object.keys(res.body).length).to.eql(2);
          chai.expect(res.status).to.eql(BadRequest['code']);
          chai.expect(res['body']['info']).to.contains(BadRequest['messages']['case2']);
          done();
        });
    });
  });
  describe(BadRequest['messages']['case3'], () => {
    it('request should throw bad request error with case3 error', (done) => {
      let currentYear:number = new Date().getFullYear();
      chai.request(app)
        .get(`/vaccine-summary?c=AT&dateFrom=${currentYear+1}-W01&dateTo=${currentYear+1}-W11&range=1`)
        .end((err, res) => {
          chai.expect(Object.keys(res.body).length).to.eql(2);
          chai.expect(res.status).to.eql(BadRequest['code']);
          chai.expect(res['body']['info']).to.contains(BadRequest['messages']['case3']);
          done();
        });
    });
  });
  describe(BadRequest['messages']['case4'], () => {
    it('request should throw bad request error with case4 error', (done) => {
      chai.request(app)
        .get('/vaccine-summary?c=AT&dateFrom=2020-W56&dateTo=2021-W11&range=1')
        .end((err, res) => {
          chai.expect(Object.keys(res.body).length).to.eql(2);
          chai.expect(res.status).to.eql(BadRequest['code']);
          chai.expect(res['body']['info']).to.eql(BadRequest['messages']['case4']);
          done();
        });
    });
  });
  describe(BadRequest['messages']['case5'], () => {
    it('request should throw bad request error with case5 error', (done) => {
      let today:Date = new Date();
      let currentYear:number = today.getFullYear();
      let startDate:Date = new Date(currentYear, 0, 1);
      let currentWeek:number = generalUtility.getCurrentWeek(today.getTime(), startDate.getTime());
      let testWeek:number = currentWeek + 10;
      chai.request(app)
        .get(`/vaccine-summary?c=AT&dateFrom=${currentYear}-W${testWeek < 10 ? '0'+ testWeek : testWeek}&dateTo=${currentYear}-W01&range=1`)
        .end((err, res) => {
          chai.expect(Object.keys(res.body).length).to.eql(2);
          chai.expect(res.status).to.eql(BadRequest['code']);
          chai.expect(res['body']['info']).to.eql(BadRequest['messages']['case5']);
          done();
        });
    });
  });
  describe('with params', () => {
    it('request should be successful and should have only summary key when request is successful', (done) => {
      chai.request(app)
        .get('/vaccine-summary?c=AT&dateFrom=2020-W01&dateTo=2021-W01&range=1')
        .end((err, res) => {
          chai.expect(res.status).to.eql(200);
          chai.expect(Object.keys(res.body).length).to.eql(1);
          done();
        });
    });
  });
});
