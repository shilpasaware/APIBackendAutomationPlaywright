// utils/data-generator.js
import { faker } from '@faker-js/faker';

class DataGenerator {
  // Generate user data
  static generateUser() {
    return {
      name: faker.name.fullName(),
      username: faker.internet.userName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      website: faker.internet.url(),
      address: {
        street: faker.address.streetAddress(),
        suite: faker.address.secondaryAddress(),
        city: faker.address.city(),
        zipcode: faker.address.zipCode(),
        geo: {
          lat: faker.address.latitude(),
          lng: faker.address.longitude()
        }
      },
      company: {
        name: faker.company.name(),
        catchPhrase: faker.company.catchPhrase(),
        bs: faker.company.bs()
      }
    };
  }

  // Generate post data
  static generatePost(userId = null) {
    return {
      title: faker.lorem.sentence(3, 7),
      body: faker.lorem.paragraphs(2, '\n\n'),
      userId: userId || faker.number.int({ min: 1, max: 10 })
    };
  }

  // Generate comment data
  static generateComment(postId = null) {
    return {
      name: faker.lorem.sentence(2, 4),
      email: faker.internet.email(),
      body: faker.lorem.paragraph(),
      postId: postId || faker.number.int({ min: 1, max: 100 })
    };
  }

  // Generate todo data
  static generateTodo(userId = null) {
    return {
      title: faker.lorem.sentence(3, 6),
      completed: faker.datatype.boolean(),
      userId: userId || faker.number.int({ min: 1, max: 10 })
    };
  }

  // Generate test scenarios for Claude
  static generateTestScenarios(apiEndpoint) {
    const scenarios = {
      '/posts': [
        { method: 'GET', description: 'Fetch all posts' },
        { method: 'GET', path: '/1', description: 'Fetch specific post' },
        { method: 'POST', data: this.generatePost(), description: 'Create new post' },
        { method: 'PUT', path: '/1', data: this.generatePost(1), description: 'Update post' },
        { method: 'DELETE', path: '/1', description: 'Delete post' }
      ],
      '/users': [
        { method: 'GET', description: 'Fetch all users' },
        { method: 'GET', path: '/1', description: 'Fetch specific user' },
        { method: 'POST', data: this.generateUser(), description: 'Create new user' }
      ],
      '/comments': [
        { method: 'GET', description: 'Fetch all comments' },
        { method: 'GET', path: '/1', description: 'Fetch specific comment' },
        { method: 'POST', data: this.generateComment(), description: 'Create new comment' }
      ]
    };
    
    return scenarios[apiEndpoint] || [];
  }

  // Generate API test data based on endpoint
  static generateApiTestData(endpoint, method = 'POST') {
    const dataMap = {
      '/posts': () => this.generatePost(),
      '/users': () => this.generateUser(),
      '/comments': () => this.generateComment(),
      '/todos': () => this.generateTodo()
    };

    return dataMap[endpoint] ? dataMap[endpoint]() : {};
  }

  // Generate realistic test edge cases
  static generateEdgeCases(dataType) {
    const edgeCases = {
      string: ['', ' ', 'a'.repeat(1000), '特殊字符测试', '🚀💫✨'],
      number: [0, -1, 999999999, -999999999, 1.5, -1.5],
      email: ['invalid-email', '@domain.com', 'user@', 'user@domain'],
      boolean: [true, false, 'true', 'false', 1, 0]
    };

    return edgeCases[dataType] || [];
  }
}

export default DataGenerator;