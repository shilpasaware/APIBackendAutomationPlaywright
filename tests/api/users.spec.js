// tests/api/users.spec.js - GET API Testing Examples
import { test, expect } from '@playwright/test';

test.describe('Users API - GET Operations', () => {
  
  test('fetch all users from JSONPlaceholder API', async ({ request }) => {
    // Basic GET request
    const response = await request.get('/users');
    
    // Verify response status
    expect(response.status()).toBe(200);
    
    // Parse and validate response data
    const users = await response.json();
    expect(Array.isArray(users)).toBeTruthy();
    expect(users.length).toBeGreaterThan(0);
    
    // Validate user structure
    const firstUser = users[0];
    expect(firstUser).toHaveProperty('id');
    expect(firstUser).toHaveProperty('name');
    expect(firstUser).toHaveProperty('username');
    expect(firstUser).toHaveProperty('email');
    expect(firstUser).toHaveProperty('address');
    expect(firstUser).toHaveProperty('phone');
    expect(firstUser).toHaveProperty('website');
    expect(firstUser).toHaveProperty('company');
    
    console.log(`✅ Fetched ${users.length} users successfully`);
  });

  test('retrieve user by ID with valid user ID', async ({ request }) => {
    const userId = 1;
    const response = await request.get(`/users/${userId}`);
    
    expect(response.status()).toBe(200);
    
    const user = await response.json();
    expect(user.id).toBe(userId);
    expect(user.name).toBeTruthy();
    expect(user.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    
    console.log(`✅ User ${userId}: ${user.name} (${user.email})`);
  });

  test('handle non-existent user ID gracefully', async ({ request }) => {
    const response = await request.get('/users/999');
    
    expect(response.status()).toBe(404);
    console.log('✅ 404 handled correctly for non-existent user');
  });

  test('validate user data types and structure compliance', async ({ request }) => {
    const response = await request.get('/users/1');
    expect(response.status()).toBe(200);
    
    const user = await response.json();
    
    // Type validations
    expect(typeof user.id).toBe('number');
    expect(typeof user.name).toBe('string');
    expect(typeof user.username).toBe('string');
    expect(typeof user.email).toBe('string');
    expect(typeof user.phone).toBe('string');
    expect(typeof user.website).toBe('string');
    
    // Nested object validations
    expect(user.address).toHaveProperty('street');
    expect(user.address).toHaveProperty('city');
    expect(user.address).toHaveProperty('zipcode');
    expect(user.address.geo).toHaveProperty('lat');
    expect(user.address.geo).toHaveProperty('lng');
    
    expect(user.company).toHaveProperty('name');
    expect(user.company).toHaveProperty('catchPhrase');
    expect(user.company).toHaveProperty('bs');
    
    console.log('✅ All data types and structures validated');
  });

  test('verify API response headers and performance metrics', async ({ request }) => {
    const startTime = Date.now();
    const response = await request.get('/users');
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    // Performance check (should be under 2 seconds)
    expect(responseTime).toBeLessThan(2000);
    
    // Header validations
    const headers = response.headers();
    expect(headers['content-type']).toContain('application/json');
    
    console.log(`✅ Response time: ${responseTime}ms`);
    console.log(`✅ Content-Type: ${headers['content-type']}`);
  });

  test('extract user data for API workflow chaining', async ({ request }) => {
    const response = await request.get('/users');
    const users = await response.json();
    
    // Extract data for potential chaining
    const userIds = users.map(user => user.id);
    const userEmails = users.map(user => user.email);
    
    // Store in test context for potential use in other tests
    test.info().annotations.push({
      type: 'extracted-data',
      description: `User IDs: ${userIds.join(', ')}`
    });
    
    expect(userIds.length).toBeGreaterThan(0);
    expect(userEmails.every(email => email.includes('@'))).toBeTruthy();
    
    console.log('✅ Extracted data for API chaining:', {
      userCount: userIds.length,
      firstUserId: userIds[0],
      sampleEmail: userEmails[0]
    });
  });
});