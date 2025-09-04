// tests/api/workflow.spec.js - API Chaining & End-to-End Workflows
import { test, expect } from '@playwright/test';
import DataGenerator from '../../utils/data-generator.js';

test.describe('API Workflow - Chaining & End-to-End Scenarios', () => {
  
  test('complete user-post-comment workflow with data validation', async ({ request }) => {
    console.log('🔄 Starting complete user-post-comment workflow...');
    
    // Step 1: Get a user
    const usersResponse = await request.get('/users');
    expect(usersResponse.status()).toBe(200);
    const users = await usersResponse.json();
    const selectedUser = users[0];
    console.log(`👤 Selected user: ${selectedUser.name} (ID: ${selectedUser.id})`);
    
    // Step 2: Create a post for this user
    const postData = DataGenerator.generatePost(selectedUser.id);
    const postResponse = await request.post('/posts', {
      data: postData
    });
    expect(postResponse.status()).toBe(201);
    const createdPost = await postResponse.json();
    console.log(`📝 Created post: ${createdPost.title} (ID: ${createdPost.id})`);
    
    // Step 3: Verify the post was created correctly
    expect(createdPost.userId).toBe(selectedUser.id);
    expect(createdPost.title).toBe(postData.title);
    
    // Step 4: Create a comment for this post
    const commentData = DataGenerator.generateComment(createdPost.id);
    const commentResponse = await request.post('/comments', {
      data: commentData
    });
    expect(commentResponse.status()).toBe(201);
    const createdComment = await commentResponse.json();
    console.log(`💬 Created comment: ${createdComment.name} (ID: ${createdComment.id})`);
    
    // Step 5: Verify the comment was linked correctly
    expect(createdComment.postId).toBe(createdPost.id);
    
    // Step 6: Fetch and verify the complete workflow
    const finalPostResponse = await request.get(`/posts/${createdPost.id}`);
    
    // Note: JSONPlaceholder returns 404 for created posts since they're not actually stored
    // In a real API, this would return the created post
    if (finalPostResponse.status() === 404) {
      console.log('ℹ️ JSONPlaceholder behavior: Created posts are not stored for retrieval');
      console.log('✅ Complete workflow verified (creation successful, expected 404 on retrieval)');
    } else {
      const finalPost = await finalPostResponse.json();
      expect(finalPost.id).toBe(createdPost.id);
      console.log('✅ Complete workflow verified - post retrievable');
    }
    
    console.log('✅ Complete workflow verified:', {
      user: selectedUser.name,
      post: createdPost.title.substring(0, 30) + '...',
      comment: createdComment.name.substring(0, 30) + '...',
      note: 'JSONPlaceholder demo API behavior - posts not stored for retrieval'
    });
  });

  test('chain multiple API calls with data extraction and reuse', async ({ request }) => {
    console.log('🔗 Testing API chaining with data extraction...');
    
    const extractedData = {};
    
    // Chain 1: Get users and extract IDs
    const usersResponse = await request.get('/users');
    const users = await usersResponse.json();
    extractedData.userIds = users.map(u => u.id);
    extractedData.userEmails = users.map(u => u.email);
    console.log(`📊 Extracted ${extractedData.userIds.length} user IDs`);
    
    // Chain 2: Get posts and extract user associations
    const postsResponse = await request.get('/posts');
    const posts = await postsResponse.json();
    extractedData.postsByUser = {};
    posts.forEach(post => {
      if (!extractedData.postsByUser[post.userId]) {
        extractedData.postsByUser[post.userId] = [];
      }
      extractedData.postsByUser[post.userId].push(post.id);
    });
    console.log(`📊 Grouped posts by ${Object.keys(extractedData.postsByUser).length} users`);
    
    // Chain 3: Use extracted data to create targeted requests
    const randomUserId = extractedData.userIds[Math.floor(Math.random() * extractedData.userIds.length)];
    const userPostsResponse = await request.get(`/users/${randomUserId}/posts`);
    expect(userPostsResponse.status()).toBe(200);
    const userPosts = await userPostsResponse.json();
    console.log(`📝 Found ${userPosts.length} posts for user ${randomUserId}`);
    
    // Chain 4: Create new content based on extracted data
    const newPostData = DataGenerator.generatePost(randomUserId);
    const newPostResponse = await request.post('/posts', {
      data: newPostData
    });
    expect(newPostResponse.status()).toBe(201);
    const newPost = await newPostResponse.json();
    
    // Verify the chaining worked
    expect(newPost.userId).toBe(randomUserId);
    console.log('✅ API chaining completed successfully');
  });

  test('Handle error scenarios and implement fallback strategies', async ({ request }) => {
    console.log('🔧 Testing error handling in API workflows...');
    
    // Scenario 1: Try to create post for non-existent user
    const nonExistentUserId = 9999;
    const postData = DataGenerator.generatePost(nonExistentUserId);
    
    const postResponse = await request.post('/posts', {
      data: postData
    });
    
    // JSONPlaceholder allows this, but in real scenarios you'd expect an error
    expect(postResponse.status()).toBe(201);
    const createdPost = await postResponse.json();
    console.log('⚠️ Post created even with non-existent user ID (JSONPlaceholder behavior)');
    
    // Scenario 2: Try to get non-existent post
    const nonExistentPostResponse = await request.get('/posts/9999');
    expect(nonExistentPostResponse.status()).toBe(404);
    console.log('✅ 404 correctly returned for non-existent post');
    
    // Scenario 3: Chain with error recovery
    let userToUse;
    try {
      const specificUserResponse = await request.get('/users/999');
      if (specificUserResponse.status() === 404) {
        // Fallback: get first available user
        const usersResponse = await request.get('/users');
        const users = await usersResponse.json();
        userToUse = users[0];
        console.log('🔄 Fallback to available user:', userToUse.name);
      }
    } catch (error) {
      console.log('🔧 Error handled gracefully');
    }
    
    // Continue workflow with fallback data
    if (userToUse) {
      const fallbackPostData = DataGenerator.generatePost(userToUse.id);
      const fallbackResponse = await request.post('/posts', {
        data: fallbackPostData
      });
      expect(fallbackResponse.status()).toBe(201);
      console.log('✅ Workflow continued successfully with fallback data');
    }
  });

  test('Demonstrate complex workflow with validation', async ({ request }) => {
    console.log('🏗️ Running complex workflow with comprehensive validation...');
    
    const workflowResults = {
      users: [],
      posts: [],
      comments: [],
      relationships: {}
    };
    
    // Phase 1: Data Discovery
    console.log('📊 Phase 1: Data Discovery');
    const usersResponse = await request.get('/users');
    const allUsers = await usersResponse.json();
    workflowResults.users = allUsers.slice(0, 3); // Work with first 3 users
    
    // Phase 2: Content Creation
    console.log('📝 Phase 2: Content Creation');
    for (const user of workflowResults.users) {
      // Create 2 posts per user
      for (let i = 0; i < 2; i++) {
        const postData = DataGenerator.generatePost(user.id);
        const postResponse = await request.post('/posts', {
          data: postData
        });
        
        expect(postResponse.status()).toBe(201);
        const newPost = await postResponse.json();
        workflowResults.posts.push(newPost);
        
        // Track relationships
        if (!workflowResults.relationships[user.id]) {
          workflowResults.relationships[user.id] = [];
        }
        workflowResults.relationships[user.id].push(newPost.id);
      }
    }
    
    console.log(`📝 Created ${workflowResults.posts.length} posts across ${workflowResults.users.length} users`);
    
    // Phase 3: Interaction Creation
    console.log('💬 Phase 3: Interaction Creation');
    for (const post of workflowResults.posts) {
      const commentData = DataGenerator.generateComment(post.id);
      const commentResponse = await request.post('/comments', {
        data: commentData
      });
      
      expect(commentResponse.status()).toBe(201);
      const newComment = await commentResponse.json();
      workflowResults.comments.push(newComment);
    }
    
    // Phase 4: Comprehensive Validation
    console.log('✅ Phase 4: Validation');
    
    // Validate all posts were created correctly
    expect(workflowResults.posts.length).toBe(workflowResults.users.length * 2);
    
    // Validate all comments were created correctly
    expect(workflowResults.comments.length).toBe(workflowResults.posts.length);
    
    // Validate relationships
    for (const [userId, postIds] of Object.entries(workflowResults.relationships)) {
      expect(postIds.length).toBe(2);
      
      for (const postId of postIds) {
        const relatedComment = workflowResults.comments.find(c => c.postId == postId);
        expect(relatedComment).toBeTruthy();
      }
    }
    
    console.log('✅ Complex workflow completed with full validation:', {
      usersProcessed: workflowResults.users.length,
      postsCreated: workflowResults.posts.length,
      commentsCreated: workflowResults.comments.length,
      relationshipsValidated: Object.keys(workflowResults.relationships).length
    });
  });

  test('Demonstrate performance workflow with parallel requests', async ({ request }) => {
    console.log('⚡ Testing performance workflow with parallel requests...');
    
    const startTime = Date.now();
    
    // Parallel data fetching
    const [usersResponse, postsResponse, commentsResponse] = await Promise.all([
      request.get('/users'),
      request.get('/posts'),
      request.get('/comments')
    ]);
    
    const parallelFetchTime = Date.now() - startTime;
    console.log(`⚡ Parallel data fetch completed in ${parallelFetchTime}ms`);
    
    // Verify all requests succeeded
    expect(usersResponse.status()).toBe(200);
    expect(postsResponse.status()).toBe(200);
    expect(commentsResponse.status()).toBe(200);
    
    const users = await usersResponse.json();
    const posts = await postsResponse.json();
    const comments = await commentsResponse.json();
    
    // Parallel post creation
    const createStartTime = Date.now();
    const postCreationPromises = [];
    
    for (let i = 0; i < 5; i++) {
      const postData = DataGenerator.generatePost();
      postCreationPromises.push(
        request.post('/posts', { data: postData })
      );
    }
    
    const createdPostsResponses = await Promise.all(postCreationPromises);
    const parallelCreateTime = Date.now() - createStartTime;
    
    // Verify all posts were created
    createdPostsResponses.forEach(response => {
      expect(response.status()).toBe(201);
    });
    
    console.log('✅ Performance workflow completed:', {
      fetchTime: parallelFetchTime,
      createTime: parallelCreateTime,
      totalUsers: users.length,
      totalPosts: posts.length,
      totalComments: comments.length,
      newPostsCreated: createdPostsResponses.length
    });
  });
});