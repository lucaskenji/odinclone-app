const request = require('supertest');
const { startDatabase, destroyDatabase, app } = require('./mongo.config.js');

let mainUser;
let mainPost;

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
  
  const responseUser = await request(app).post('/users').send(newUser);
  mainUser = responseUser.body._id;
  
  const newPost = {
    author: mainUser,
    content: 'Hello world',
    timestamp: new Date()
  };
  
  const responsePost = await request(app).post('/posts').send(newPost);
  mainPost = responsePost.body._id;
  
  done();
}, 20000);


afterAll(async (done) => {
  await destroyDatabase();
  done();
}, 20000);


describe('Comment API', () => {
  test('is able to create a comment', (done) => {
    const newComment = {
      content: 'First comment',
      author: mainUser
    }
    
    request(app)
      .post(`/posts/${mainPost}/comments`)
      .send(newComment)
      .expect(200)
      .end((err, comment) => {
        if (err) throw err;
      
        expect(comment.body.content).toBe('First comment');
        done();
      })
  }, 20000);
  
  test('is not able to create a comment with a non-existent user', (done) => {
    const newComment = {
      content: 'Hello world',
      author: mainUser
    }
    
    request(app)
      .post('/posts/000000000000/comments')
      .send(newComment)
      .expect(400, done);
  }, 20000)
  
  test('is not able to create a comment in a non-existent post', (done) => {
    const newComment = {
      content: 'Hello world',
      author: '000000000000'
    }
    
    request(app)
      .post('/posts/' + mainPost + '/comments')
      .send(newComment)
      .expect(400, done);
  }, 20000)
  
  test('is able to modify a comment', (done) => {
    const newComment = {
      content: 'To be edited',
      author: mainUser
    }
    
    request(app)
      .post(`/posts/${mainPost}/comments`)
      .send(newComment)
      .end((err, response) => {
        request(app)
          .put(`/posts/${mainPost}/comments/${response.body._id}`)
          .send({content: 'Edited'})
          .expect(200)
          .end((err, updateResult) => {
            expect(updateResult.body.content).toBe('Edited');
            done();
          });
      });
  }, 20000)
  
  test('is able to delete a comment', (done) => {
    const newComment = {
      content: 'To be deleted',
      author: mainUser
    }
    
    request(app)
      .post(`/posts/${mainPost}/comments`)
      .send(newComment)
      .end((err, response) => {
        request(app)
          .delete(`/posts/${mainPost}/comments/${response.body._id}`)
          .expect(200)
          .end((err, deleteResult) => {
            request(app)
            .get(`/posts/${mainPost}/comments/${response.body._id}`)
            .expect(404, done);
          });
      });
  }, 20000)
});