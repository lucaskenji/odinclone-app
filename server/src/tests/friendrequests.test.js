const request = require('supertest');
const { startDatabase, destroyDatabase, app } = require('./mongo.config.js');

let mainUser;

beforeAll(async (done) => {
  await startDatabase();
  
  const newUser = {
    firstName: 'Spam',
    lastName: 'Bacon',
    email: 'spam@email.com',
    password: '12345',
    birthDate: new Date(),
    gender: 'male'
  };
  
  const postResult = await request(app).post('/users').send(newUser);
  mainUser = postResult.body._id;
  done();
}, 20000);


afterAll(async (done) => {
  await destroyDatabase();
  done();
}, 20000);


describe('Friend request API', () => {
  test('fails if sender does not exist', (done) => {
    const newRequest = {
      sender: '000000000000',
      receiver: mainUser
    }
    
    request(app)
      .post('/friendrequests')
      .send(newRequest)
      .expect(400, done);
  }, 20000);
  
  test('fails if receiver does not exist', (done) => {
    const newRequest = {
      sender: mainUser,
      receiver: '000000000000'
    }
    
    request(app)
      .post('/friendrequests')
      .send(newRequest)
      .expect(400, done);
  });
})