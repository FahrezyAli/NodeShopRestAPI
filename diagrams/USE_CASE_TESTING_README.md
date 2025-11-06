# Use Case Scenarios and Testing Documentation

This documentation describes the use case scenarios and comprehensive tests created from the PlantUML use case diagram (`usecase.puml`).

## Files Created

### 1. `use-case-scenarios.md`
Detailed use case scenarios describing the main success scenarios and extensions for each use case in the system.

**Contents:**
- **Guest Actor Use Cases** (UC-G001 to UC-G003)
  - Browse Products
  - View Product Details  
  - Login / Signup

- **Customer Actor Use Cases** (UC-C001 to UC-C007)
  - Browse Products
  - View Product Details
  - Add Product to Cart
  - Remove Product from Cart
  - View Cart
  - Checkout (includes Process Payment and Create Order)
  - View Orders

- **Admin Actor Use Cases** (UC-A001 to UC-A003)
  - Login / Signup (Admin)
  - Manage Products (Add, Edit, Delete)
  - View Orders (Admin)

- **Supporting Use Cases** (UC-S001 to UC-S003)
  - Authenticate User
  - Process Payment
  - Create Order

Each use case includes:
- Primary actor
- Goal
- Preconditions
- Postconditions
- Main success scenario (numbered steps)
- Extensions (alternative flows and error handling)

### 2. `src/tests/useCases.test.js`
Comprehensive integration tests covering all use case scenarios.

**Test Statistics:**
- **44 tests total** - All passing ✓
- Test suites organized by actor (Guest, Customer, Admin)
- Supporting use cases tested separately

**Test Coverage:**

#### Guest Actor Tests (11 tests)
- UC-G001: Browse Products (3 tests)
  - Main scenario: Display products
  - Extension 2a: No products available
  - Extension 2b: Network error

- UC-G002: View Product Details (3 tests)
  - Main scenario: Retrieve product details
  - Extension 2a: Product not found
  - Extension 2b: Out of stock indicator

- UC-G003: Login/Signup (5 tests)
  - Main scenario: Authenticate with valid credentials
  - Extension 3a: Signup with valid data
  - Extension 4a: Invalid credentials
  - Extension 4b: Email already exists
  - Extension 4c: Password strength validation

#### Customer Actor Tests (18 tests)
- UC-C003: Add Product to Cart (3 tests)
  - Main scenario: Add product successfully
  - Extension 2a: Product out of stock
  - Extension 2b: Increment quantity

- UC-C004: Remove Product from Cart (2 tests)
  - Main scenario: Remove product
  - Extension 2a: Empty cart after last item

- UC-C005: View Cart (2 tests)
  - Main scenario: View cart with items
  - Extension 2a: Empty cart

- UC-C006: Checkout (5 tests)
  - Main scenario: Complete checkout with payment and order
  - Extension 2a: Item no longer available
  - Extension 7a: Payment declined
  - Extension 7b: Network error preserves cart
  - Extension 8a: Order creation failure

- UC-C007: View Orders (3 tests)
  - Main scenario: Retrieve order history
  - Extension 2a: No orders found
  - Extension 2b: Network error

#### Admin Actor Tests (7 tests)
- UC-A001: Admin Login (2 tests)
  - Main scenario: Admin authentication
  - Extension 3b: Deny access to non-admin

- UC-A002: Manage Products (5 tests)
  - Main scenario: Create new product
  - Alternative: Update existing product
  - Alternative: Delete product
  - Extension 6a: Validate product data
  - Extension 7a: Database error

- UC-A003: View All Orders (3 tests)
  - Main scenario: Retrieve all orders
  - Main scenario: Update order status
  - Extension 2a: No orders in system

#### Supporting Use Cases Tests (8 tests)
- UC-S001: Authenticate User (2 tests)
  - Main scenario: Validate credentials and return JWT
  - Extension 3a: Invalid credentials

- UC-S002: Process Payment (3 tests)
  - Main scenario: Process payment via Stripe
  - Extension 3a: Insufficient funds
  - Extension 3b: Invalid card

- UC-S003: Create Order (3 tests)
  - Main scenario: Create order with all fields
  - Extension 4a: Database error
  - Extension 4b: Prevent duplicate orders

## Running the Tests

### Run all use case tests:
```bash
npm test -- src/tests/useCases.test.js --watchAll=false
```

### Run in watch mode:
```bash
npm test -- src/tests/useCases.test.js
```

### Run specific test suite:
```bash
npm test -- src/tests/useCases.test.js -t "UC-G001"
```

### Run with coverage:
```bash
npm test -- src/tests/useCases.test.js --coverage --watchAll=false
```

## Test Results Summary

```
Test Suites: 1 passed, 1 total
Tests:       44 passed, 44 total
Snapshots:   0 total
Time:        ~2.2s
```

All tests are passing, covering:
- Main success scenarios for each use case
- Extension scenarios (alternative flows)
- Error handling and validation
- Network error handling
- Authorization and authentication

## Test Architecture

The tests use:
- **Jest** as the test framework
- **axios mocks** for API calls
- **Async/await** for handling promises
- **Descriptive test names** matching use case IDs
- **Organized test suites** by actor and use case

## Integration with CI/CD

These tests can be integrated into your CI/CD pipeline:

```yaml
# Example GitHub Actions workflow
- name: Run Use Case Tests
  run: npm test -- src/tests/useCases.test.js --watchAll=false --coverage
```

## Mapping to Use Case Diagram

The tests directly map to the use case diagram in `usecase.puml`:

```
┌─────────────────────────────────────┐
│ usecase.puml (Use Case Diagram)     │
│ - Actors: Guest, Customer, Admin    │
│ - Use Cases: Browse, Cart, Checkout │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│ use-case-scenarios.md               │
│ - Detailed scenarios                │
│ - Preconditions/Postconditions      │
│ - Main flows + Extensions           │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│ useCases.test.js                    │
│ - 44 automated tests                │
│ - Validates main + extension flows  │
│ - All tests passing ✓               │
└─────────────────────────────────────┘
```

## Benefits

1. **Traceability**: Each test directly maps to a use case scenario
2. **Documentation**: Use case scenarios provide clear requirements
3. **Coverage**: Both happy paths and error cases are tested
4. **Maintainability**: Tests organized by actor and use case
5. **Quality Assurance**: Automated validation of system behavior
6. **Regression Prevention**: Tests catch breaking changes

## Next Steps

To extend this testing suite:

1. **Add E2E tests** using tools like Cypress or Playwright
2. **Add component tests** for UI components
3. **Add integration tests** with real backend APIs
4. **Add performance tests** for critical paths
5. **Add accessibility tests** using jest-axe
6. **Increase coverage** for edge cases

## Notes

- Tests are API-level integration tests (not full E2E)
- Mock data is used for isolation and speed
- Tests follow the Arrange-Act-Assert pattern
- Each test is independent and can run in any order
- Tests validate both successful and failure scenarios
