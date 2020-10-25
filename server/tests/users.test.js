const mongoose = require('mongoose');
const express = require('express');
const app = express();
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');
const userApi = require('../routes/api.js');

let mongoServer;

app.use('/', userApi);


beforeAll(async (done) => {
  mongoServer = new MongoMemoryServer();

  const connectionString = await mongoServer.getUri();
  
  try {
    await mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
  } catch (err) {
    console.log('Mongo connection error:', err);
  } finally {
    done();
  }
});


afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});


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
  });
  
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
        newUser.password = '54321';
        const modifiedUser = {...newUser};
        
        request(app)
          .put('/users/' + postResult.body._id)
          .send(modifiedUser)
          .expect(200)
          .end((err, updateResult) => {
            expect(updateResult.body.password).toBe('54321');
            done();
          })
      })
  })
  
  test('is able to delete an user', (done) => {
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
  })
});