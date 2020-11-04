const request = require('supertest');
const { startDatabase, destroyDatabase, app } = require('./mongo.config.js');

let mainUser;

beforeAll(async (done) => {
  await startDatabase();
  
  const newUser = {
    firstName: 'Baz',
    lastName: 'Qux',
    email: 'bazqux@email.com',
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


describe('Post API', () => {
  test('is able to create a post', (done) => {
    const newPost = {
      content: 'Hello world',
      author: mainUser,
      timestamp: new Date()
    }
    
    request(app)
      .post('/posts')
      .send(newPost)
      .expect(200)
      .end((err, post) => {
        if (err) throw err;
      
        expect(post.body.content).toBe('Hello world');
        done();
      })
  }, 20000);
  
  test('is not able to create a post with a non-existent user', (done) => {
    const newPost = {
      content: 'Hello world',
      author: '000000000000',
      timestamp: new Date()
    }
    
    request(app)
      .post('/posts')
      .send(newPost)
      .expect(400, done);
  }, 20000)
  
  test('is able to modify a post', (done) => {
    const newPost = {
      content: 'To be edited',
      author: mainUser,
      timestamp: new Date()
    }
    
    request(app)
      .post('/posts')
      .send(newPost)
      .end((err, response) => {
        request(app)
          .put('/posts/' + response.body._id)
          .send({content: 'Edited'})
          .expect(200)
          .end((err, updateResult) => {
            expect(updateResult.body.content).toBe('Edited');
            done();
          });
      });
  }, 20000)
  
  test('is able to delete a post', (done) => {
    const newPost = {
      content: 'To be deleted',
      author: mainUser,
      timestamp: new Date()
    }
    
    request(app)
      .post('/posts')
      .send(newPost)
      .end((err, response) => {
        request(app)
          .delete('/posts/' + response.body._id)
          .expect(200)
          .end((err, deleteResult) => {
            request(app)
            .get('/posts/' + response.body._id)
            .expect(404, done);
          });
      });
  }, 20000)
});