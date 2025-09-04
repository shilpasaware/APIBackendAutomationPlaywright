# API Backend Automation using Playwright & Dynamic Data

🚀 **Practical Framework for Smarter API Testing**

This framework demonstrates how to build robust, maintainable API tests using Playwright with dynamic data generation for real-world testing scenarios.

## 🎯 What You'll Learn

- **Modern API Testing**: GET & POST operations with ES6 modules
- **Dynamic Data Generation**: Realistic test data with @faker-js/faker
- **API Chaining**: End-to-end workflow validation
- **Performance Testing**: Response time validation
- **CI/CD Integration**: Production-ready pipeline

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- VS Code (recommended)
- Internet connection (for JSONPlaceholder API)

## ⚡ Quick Start

```bash
# Clone and setup
git clone <your-repo-url>
cd api-automation-demo

# Quick setup
npm run setup     # Validates environment and creates directories

# Install dependencies
npm install       # Installs packages + Playwright browsers

# Run test suites
npm run test:users     # GET API examples
npm run test:posts     # POST API with dynamic data
npm run test:workflow  # API chaining examples

# Interactive demo mode
npm run test:demo      # Step-by-step presentation

# Development mode
npm run test:ui        # Playwright UI mode
npm run test:headed    # Visible browser mode
```

## 📁 Project Structure

```
api-automation-demo/
├── tests/
│   └── api/
│       ├── users.spec.js         ← GET examples
│       ├── posts.spec.js         ← POST with dynamic data
│       └── workflow.spec.js      ← API chaining
├── utils/
│   ├── data-generator.js         ← Dynamic test data
│   └── global-setup.js           ← Demo setup
├── demo-script.js                ← Interactive presenter mode
├── setup.js                      ← Environment validation
├── playwright.config.js          ← Playwright configuration
├── package.json                  ← Dependencies & scripts
└── .github/workflows/ci.yml      ← CI/CD pipeline
```

## 🧪 Test Examples

### 1. Basic GET Testing (`users.spec.js`)

```javascript
import { test, expect } from '@playwright/test';

test('should fetch all users successfully', async ({ request }) => {
  const response = await request.get('/users');
  expect(response.status()).toBe(200);

  const users = await response.json();
  expect(users.length).toBeGreaterThan(0);
  console.log(`✅ Fetched ${users.length} users successfully`);
});
```

### 2. Dynamic POST Testing (`posts.spec.js`)

```javascript
import { test, expect } from '@playwright/test';
import DataGenerator from '../../utils/data-generator.js';

test('should create new post with generated data', async ({ request }) => {
  const postData = DataGenerator.generatePost();
  
  const response = await request.post('/posts', {
    data: postData
  });
  
  expect(response.status()).toBe(201);
  console.log('✅ Post created with dynamic data');
});
```

### 3. API Chaining (`workflow.spec.js`)

```javascript
test('should complete user-post-comment workflow', async ({ request }) => {
  // Get user → Create post → Add comment → Verify workflow
  const usersResponse = await request.get('/users');
  const user = (await usersResponse.json())[0];
  
  const postResponse = await request.post('/posts', {
    data: DataGenerator.generatePost(user.id)
  });
  const post = await postResponse.json();
  
  const commentResponse = await request.post('/comments', {
    data: DataGenerator.generateComment(post.id)
  });
  
  expect(commentResponse.status()).toBe(201);
  console.log('✅ Complete workflow verified');
});
```

## 🔧 VS Code Integration

### Recommended Extensions

- **Playwright Test for VS Code**: Test runner integration
- **REST Client**: API testing directly in VS Code
- **Thunder Client**: Alternative API client

### Running Tests in VS Code

1. **Test Explorer**: View → Testing
2. **Debug Mode**: Set breakpoints and use F5
3. **Command Palette**: `Ctrl+Shift+P` → "Test: Run All Tests"
4. **Integrated Terminal**: Use npm scripts directly

```bash
# Quick commands in VS Code terminal
npm run test:users -- --debug     # Debug user tests
npm run test:posts -- --headed    # Visual POST tests
npm run test:workflow -- --ui      # Interactive workflow tests
```

## 🔄 Dynamic Data Generation

The framework includes intelligent data generation:

```javascript
import DataGenerator from './utils/data-generator.js';

// Realistic user data
const user = DataGenerator.generateUser();
// Output: { name: "John Doe", email: "john@example.com", ... }

// Post data for specific user
const post = DataGenerator.generatePost(userId);

// Edge cases for testing
const edgeCases = DataGenerator.generateEdgeCases('email');
// Output: ['', 'invalid-email', '@domain.com', ...]
```

## 🚀 CI/CD Integration

### GitHub Actions Pipeline

The included CI/CD pipeline provides:

- **Multi-version testing** (Node 18, 20)
- **Automated test execution** on push/PR
- **Performance validation** (response time checks)
- **Test report generation** with GitHub Pages
- **Daily scheduled runs**

### Pipeline Jobs

1. **API Tests**: Run all test suites across Node versions
2. **Performance Validation**: Check response times and API health
3. **Test Report**: Generate and deploy HTML reports
4. **Summary**: Comprehensive results overview

```yaml
# Trigger on push, PR, or daily schedule
on:
  push: [main, develop]
  pull_request: [main]
  schedule: ['0 2 * * *']  # Daily at 2 AM UTC
```

## 📊 Demo Flow for Presentations

### 1. Environment Setup (2 minutes)
```bash
npm run setup          # Show validation
npm install           # Install dependencies
```

### 2. Basic API Testing (3 minutes)
```bash
npm run test:users -- --headed    # Show GET operations
```

### 3. Dynamic Data Generation (3 minutes)
```bash
# Show generated data
node -e "import('./utils/data-generator.js').then(m => console.log(JSON.stringify(m.default.generatePost(), null, 2)))"

# Run POST tests
npm run test:posts -- --headed
```

### 4. API Chaining Workflows (5 minutes)
```bash
npm run test:workflow -- --headed
```

### 5. Interactive Demo Mode (5 minutes)
```bash
npm run test:demo      # Step-by-step presentation
```

### 6. CI/CD Pipeline (2 minutes)
```bash
# Show pipeline configuration
cat .github/workflows/ci.yml

# Demonstrate local CI simulation
npm test
npm run report
```

## 🎯 Key Demo Points

### For Testers
- **No Complex Setup**: Works out of the box with JSONPlaceholder
- **Real-world Examples**: Practical patterns you can use immediately
- **Dynamic Data**: Realistic test scenarios with faker.js
- **Visual Debugging**: Playwright UI for easy troubleshooting

### For Developers  
- **Modern ES6**: Clean, modern JavaScript syntax
- **VS Code Integration**: Full debugging and test runner support
- **Performance Focused**: Built-in response time validation
- **CI/CD Ready**: Production pipeline included

### For Managers
- **Faster Testing**: Dynamic data reduces manual test creation
- **Better Coverage**: Automated edge cases and workflows
- **Reliable Results**: Consistent, repeatable test execution
- **Measurable Quality**: Performance metrics and reporting

## 🔧 Customization

### Adapt for Your API

1. **Update Base URL**: Change in `playwright.config.js`
```javascript
use: {
  baseURL: 'https://your-api.com'
}
```

2. **Modify Data Models**: Update `data-generator.js`
```javascript
static generateYourModel() {
  return {
    customField: faker.lorem.word(),
    // ... your fields
  };
}
```

3. **Add Authentication**: Extend request headers
```javascript
use: {
  extraHTTPHeaders: {
    'Authorization': 'Bearer your-token',
    'Content-Type': 'application/json'
  }
}
```

4. **Custom Validations**: Add business logic checks
```javascript
test('should validate business rules', async ({ request }) => {
  // Your custom validation logic
});
```

## 📈 Performance Metrics

The framework tracks:
- **Response Times**: < 3 seconds expected
- **Success Rates**: All tests should pass
- **Data Validation**: Structure and type checking
- **Error Handling**: Graceful failure scenarios

### Example Performance Test
```javascript
test('should meet performance requirements', async ({ request }) => {
  const startTime = Date.now();
  const response = await request.get('/posts');
  const responseTime = Date.now() - startTime;
  
  expect(response.status()).toBe(200);
  expect(responseTime).toBeLessThan(3000);
  console.log(`⚡ Response time: ${responseTime}ms`);
});
```

## 🎉 Next Steps

1. **Clone and Setup**: `git clone <repo> && cd api-automation-demo && npm run setup`
2. **Run Demo**: `npm run test:demo` for interactive presentation
3. **Adapt for Your APIs**: Update base URL and data models
4. **Integrate CI/CD**: Push to GitHub for automatic pipeline setup
5. **Extend Framework**: Add authentication, custom validations, more endpoints

## 🤝 Contributing

This is a practical demo framework! Feel free to:
- Add more API examples
- Improve data generation patterns
- Enhance error handling
- Create additional utilities
- Share your adaptations

## 📚 Resources

- [Playwright API Testing Guide](https://playwright.dev/docs/api-testing)
- [JSONPlaceholder API Docs](https://jsonplaceholder.typicode.com/)
- [Faker.js Documentation](https://fakerjs.dev/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [ES6 Modules Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)

---

**Ready to Automate! 🚀**

*Built for practical API testing with modern tools and patterns*