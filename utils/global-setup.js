// utils/global-setup.js - Global Setup for Demo
export default async function globalSetup(config) {
  console.log('🚀 Setting up API Automation Demo Environment');
  console.log('==========================================');
  
  // Test API connectivity
  console.log('🔗 Testing API connectivity...');
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
    if (response.ok) {
      console.log('✅ JSONPlaceholder API is accessible');
    } else {
      console.warn('⚠️ JSONPlaceholder API returned:', response.status);
    }
  } catch (error) {
    console.error('❌ API connectivity test failed:', error.message);
  }
  
  // Verify test data structure
  console.log('📊 Verifying test data structure...');
  try {
    const endpoints = [
      { path: '/users', name: 'Users' },
      { path: '/posts', name: 'Posts' },
      { path: '/comments', name: 'Comments' }
    ];
    
    for (const endpoint of endpoints) {
      const response = await fetch(`https://jsonplaceholder.typicode.com${endpoint.path}`);
      const data = await response.json();
      console.log(`✅ ${endpoint.name}: ${Array.isArray(data) ? data.length : 1} records available`);
    }
  } catch (error) {
    console.warn('⚠️ Data structure verification failed:', error.message);
  }
  
  console.log('🎭 Demo environment ready');
  console.log('📋 Available test commands:');
  console.log('  npm run test:users     - Run user API tests');
  console.log('  npm run test:posts     - Run post API tests');
  console.log('  npm run test:workflow  - Run workflow tests');
  console.log('==========================================');
}