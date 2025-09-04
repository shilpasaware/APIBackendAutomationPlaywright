// tests/api/posts.spec.js - POST API Testing with Dynamic Data
import { test, expect } from '@playwright/test';
import DataGenerator from '../../utils/data-generator.js';

test.describe('Posts API - POST Operations with Dynamic Data', () => {
  
  test('create new post with dynamically generated content', async ({ request }) => {
    // Generate dynamic test data
    const postData = DataGenerator.generatePost();
    
    console.log('📝 Creating post with data:', postData);
    
    const response = await request.post('/posts', {
      data: postData
    });
    
    expect(response.status()).toBe(201);
    
    const createdPost = await response.json();
    
    // Verify the created post contains our data
    expect(createdPost.title).toBe(postData.title);
    expect(createdPost.body).toBe(postData.body);
    expect(createdPost.userId).toBe(postData.userId);
    expect(createdPost.id).toBeTruthy(); // Should be assigned by API
    
    console.log('✅ Post created successfully:', {
      id: createdPost.id,
      title: createdPost.title.substring(0, 50) + '...',
      userId: createdPost.userId
    });
  });

  test('create multiple posts with unique dynamic data', async ({ request }) => {
    const postsToCreate = 3;
    const createdPosts = [];
    
    for (let i = 0; i < postsToCreate; i++) {
      const postData = DataGenerator.generatePost();
      
      const response = await request.post('/posts', {
        data: postData
      });
      
      expect(response.status()).toBe(201);
      const createdPost = await response.json();
      createdPosts.push(createdPost);
      
      console.log(`📝 Post ${i + 1} created: ID ${createdPost.id}`);
    }
    
    // Verify all posts were created with unique data
    expect(createdPosts).toHaveLength(postsToCreate);
    
    const titles = createdPosts.map(post => post.title);
    const uniqueTitles = [...new Set(titles)];
    expect(uniqueTitles).toHaveLength(postsToCreate); // All titles should be unique
    
    console.log('✅ All posts created with unique dynamic data');
  });

  test('create post linked to specific existing user', async ({ request }) => {
    // First, get a real user ID
    const usersResponse = await request.get('/users');
    const users = await usersResponse.json();
    const randomUser = users[Math.floor(Math.random() * users.length)];
    
    // Generate post data for this specific user
    const postData = DataGenerator.generatePost(randomUser.id);
    
    console.log(`📝 Creating post for user: ${randomUser.name} (ID: ${randomUser.id})`);
    
    const response = await request.post('/posts', {
      data: postData
    });
    
    expect(response.status()).toBe(201);
    const createdPost = await response.json();
    
    expect(createdPost.userId).toBe(randomUser.id);
    console.log('✅ Post created and linked to correct user');
  });

  test('validate post creation with edge case scenarios', async ({ request }) => {
    const edgeCases = [
      {
        name: 'Minimum data',
        data: { title: 'a', body: 'b', userId: 1 }
      },
      {
        name: 'Special characters',
        data: {
          title: 'Test with 特殊字符 and émojis 🚀',
          body: 'Body with special chars: àáâãäå & symbols: @#$%^&*()',
          userId: 1
        }
      },
      {
        name: 'Long content',
        data: {
          title: 'a'.repeat(100),
          body: 'This is a very long body content. '.repeat(20),
          userId: 1
        }
      }
    ];
    
    for (const testCase of edgeCases) {
      console.log(`🧪 Testing ${testCase.name}...`);
      
      const response = await request.post('/posts', {
        data: testCase.data
      });
      
      expect(response.status()).toBe(201);
      const createdPost = await response.json();
      
      expect(createdPost.title).toBe(testCase.data.title);
      expect(createdPost.body).toBe(testCase.data.body);
      
      console.log(`✅ ${testCase.name} handled correctly`);
    }
  });

  test('handle invalid post data with graceful responses', async ({ request }) => {
    const invalidDataCases = [
      {
        name: 'Empty object',
        data: {},
        expectedStatus: 201 // JSONPlaceholder is lenient
      },
      {
        name: 'Missing required fields',
        data: { title: 'Only title' },
        expectedStatus: 201
      },
      {
        name: 'Invalid user ID',
        data: {
          title: 'Test',
          body: 'Test body',
          userId: 'invalid'
        },
        expectedStatus: 201
      }
    ];
    
    for (const testCase of invalidDataCases) {
      console.log(`🔍 Testing ${testCase.name}...`);
      
      const response = await request.post('/posts', {
        data: testCase.data
      });
      
      expect(response.status()).toBe(testCase.expectedStatus);
      console.log(`✅ ${testCase.name}: Status ${response.status()}`);
    }
  });

  test('measure POST operation performance and validate response times', async ({ request }) => {
    const postData = DataGenerator.generatePost();
    
    const startTime = Date.now();
    const response = await request.post('/posts', {
      data: postData
    });
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    expect(response.status()).toBe(201);
    expect(responseTime).toBeLessThan(3000); // Should be under 3 seconds
    
    const createdPost = await response.json();
    expect(createdPost.id).toBeTruthy();
    
    console.log(`⚡ POST operation completed in ${responseTime}ms`);
  });

  test('create post and prepare data for workflow chaining', async ({ request }) => {
    const postData = DataGenerator.generatePost();
    
    const response = await request.post('/posts', {
      data: postData
    });
    
    expect(response.status()).toBe(201);
    const createdPost = await response.json();
    
    // Store data for potential API chaining
    test.info().annotations.push({
      type: 'created-post-data',
      description: JSON.stringify({
        postId: createdPost.id,
        userId: createdPost.userId,
        title: createdPost.title
      })
    });
    
    console.log('✅ Post created and data stored for API chaining:', {
      postId: createdPost.id,
      userId: createdPost.userId
    });
  });
});