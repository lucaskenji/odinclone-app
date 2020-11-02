const request = require('supertest');
const { startDatabase, destroyDatabase, app } = require('./mongo.config.js');


beforeAll(async (done) => {
  await startDatabase();
  done();
}, 20000);

afterAll(async (done) => {
  await destroyDatabase();
  done();
}, 20000);

describe('User API', () => {
  test('creates user and access it', (done) => {
    const newUser = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@email.com',
      password: '12345',
      birthDate: new Date(),
      gender: 'male'
    };
    
    request(app)
      .post('/users')
      .send(newUser)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, postResult) => {
        if (err) throw err;
        
        const userId = postResult.body._id;
        
        request(app)
          .get('/users/' + userId)
          .expect(200)
          .end((err, user) => {
            if (err) throw err;
            
            expect(user.body.firstName).toBe('John');
            expect(user.body.gender).toBe('male');
            done();
          })          
      });
  }, 20000);
  
  test('is able to modify an user', (done) => {
    const newUser = {
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'janedoe@email.com',
      password: '12345',
      birthDate: new Date(),
      gender: 'female'
    };
    
    request(app)
      .post('/users')
      .send(newUser)
      .end((err, postResult) => {
        if (err) throw err;
        
        const modifiedUser = { email: 'janedoe@otherdomain.com' };
        
        request(app)
          .put('/users/' + postResult.body._id)
          .send(modifiedUser)
          .expect(200)
          .end((err, updateResult) => {
            expect(updateResult.body.email).toBe('janedoe@otherdomain.com');
            done();
          })
      })
  }, 20000)
  
  
  test('is not able to use an already existing email', (done) => {
    const userOne = {
      firstName: 'Foo',
      lastName: 'Baz',
      email: 'foobaz@email.com',
      password: '12345',
      birthDate: new Date(),
      gender: 'male'
    };
    
    const userTwo = {
      firstName: 'Baz',
      lastName: 'Foo',
      email: 'foobaz@email.com',
      password: '12345',
      birthDate: new Date(),
      gender: 'male'
    }
    
    request(app)
      .post('/users')
      .send(userOne)
      .end((err, postResult) => {
        if (err) throw err;

        request(app)
          .post('/users')
          .send(userTwo)
          .expect(400)
          .end((err) => {
            if (err) throw err;
            done();
          })
      })
  }, 20000)
  
  test('is able to delete an user', (done) => {
    const newUser = {
      firstName: 'Foo',
      lastName: 'Bar',
      email: 'foobar@email.com',
      password: '12345',
      birthDate: new Date(),
      gender: 'male'
    };
    
    request(app)
      .post('/users')
      .send(newUser)
      .end((err, postResult) => {
        if (err) throw err;
        
        request(app)
          .delete('/users/' + postResult.body._id)
          .expect(200)
          .end((err, deleteResult) => {
            if (err) throw err;
            
            request(app)
            .get('/users/' + postResult.body._id)
            .expect(404, done)
          })
      });
  }, 20000)
  
  test('fails to friend an user that does not exist', async (done) => {
    const friender = {
      firstName: 'Friend',
      lastName: 'Request',
      email: 'friend@email.com',
      password: '12345',
      birthDate: new Date(),
      gender: 'male'
    }
    
    const { body : {_id}} = await request(app).post('/users').send(friender);
    await request(app).put(`/users/${_id}/friend`).send({ _id: '000000000000'}).expect(400);
    done();
  }, 20000)
  
  test('fails to friend an already friended user', async (done) => {
    const friender = {
      firstName: 'Friend',
      lastName: 'Request',
      email: 'friend1@email.com',
      password: '12345',
      birthDate: new Date(),
      gender: 'male'
    }
    
    const friended = {
      firstName: 'Requested',
      lastName: 'User',
      email: 'friend2@email.com',
      password: '12345',
      birthDate: new Date(),
      gender: 'male'
    }
    
    const postOne = await request(app).post('/users').send(friender);
    const postTwo = await request(app).post('/users').send(friended);
    const frienderId = postOne.body._id;
    const friendedId = postTwo.body._id;
    
    await request(app).put(`/users/${friendedId}/friend`).send({ _id: frienderId}).expect(200);
    await request(app).put(`/users/${friendedId}/friend`).send({ _id: frienderId}).expect(400);
    done();
  }, 20000)
});