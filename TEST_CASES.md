# NodeShopRestAPI - Test Cases Documentation

## Overview
This document outlines comprehensive test cases for all state transitions in the NodeShopRestAPI application.

---

## 1. Authentication Module Test Cases

### 1.1 Initial State
**Test Case ID:** AUTH-001  
**Description:** Verify initial authentication state  
**Preconditions:** Application starts  
**Expected Result:**
- token: 'dummy'
- userId: null
- email: null
- loading: false
- error: null

### 1.2 Auth Start Transition
**Test Case ID:** AUTH-002  
**Description:** Verify AUTH_START action sets loading state  
**Action:** Dispatch AUTH_START  
**Expected Result:**
- loading: true
- error: null
- Other fields unchanged

### 1.3 Auth Success Transition
**Test Case ID:** AUTH-003  
**Description:** Verify successful authentication updates state  
**Action:** Dispatch AUTH_SUCCESS with token, userId, email  
**Expected Result:**
- token: provided token
- userId: provided userId
- email: provided email
- loading: false
- error: null

### 1.4 Auth Fail Transition
**Test Case ID:** AUTH-004  
**Description:** Verify authentication failure sets error  
**Action:** Dispatch AUTH_FAIL with error message  
**Expected Result:**
- error: provided error message
- loading: false
- token, userId, email unchanged

### 1.5 Auth Logout Transition
**Test Case ID:** AUTH-005  
**Description:** Verify logout clears authentication data  
**Action:** Dispatch AUTH_LOGOUT  
**Expected Result:**
- token: null
- userId: null
- email: null
- Other fields unchanged

### 1.6 Auto Login on App Init
**Test Case ID:** AUTH-006  
**Description:** Verify auto-login with valid stored token  
**Preconditions:** Valid token in localStorage, not expired  
**Expected Result:**
- User automatically authenticated
- Token restored from localStorage

### 1.7 Auto Login Failure - Expired Token
**Test Case ID:** AUTH-007  
**Description:** Verify expired token triggers logout  
**Preconditions:** Expired token in localStorage  
**Expected Result:**
- User logged out
- localStorage cleared

---

## 2. Cart Module Test Cases

### 2.1 Initial State
**Test Case ID:** CART-001  
**Description:** Verify initial cart state  
**Preconditions:** Application starts  
**Expected Result:**
- products: []
- totalPrice: 0
- loading: false
- error: false

### 2.2 Fetch Cart Start
**Test Case ID:** CART-002  
**Description:** Verify FETCH_CART_START sets loading  
**Action:** Dispatch FETCH_CART_START  
**Expected Result:**
- loading: true

### 2.3 Fetch Cart Success - Empty Cart
**Test Case ID:** CART-003  
**Description:** Verify fetching empty cart  
**Action:** Dispatch FETCH_CART_SUCCESS with empty products  
**Expected Result:**
- products: []
- totalPrice: 0
- loading: false

### 2.4 Fetch Cart Success - With Items
**Test Case ID:** CART-004  
**Description:** Verify fetching cart with items  
**Action:** Dispatch FETCH_CART_SUCCESS with products and totalPrice  
**Expected Result:**
- products: provided products array
- totalPrice: provided totalPrice
- loading: false

### 2.5 Fetch Cart Fail
**Test Case ID:** CART-005  
**Description:** Verify cart fetch failure  
**Action:** Dispatch FETCH_CART_FAIL with error  
**Expected Result:**
- error: provided error
- loading: false

### 2.6 Add Product to Cart Start
**Test Case ID:** CART-006  
**Description:** Verify adding product sets loading  
**Action:** Dispatch ADD_PRODUCT_TO_CART_START  
**Expected Result:**
- loading: true

### 2.7 Add Product to Cart Success
**Test Case ID:** CART-007  
**Description:** Verify successful product addition  
**Action:** Dispatch ADD_PRODUCT_TO_CART_SUCCESS with products  
**Expected Result:**
- products: updated products array
- loading: false

### 2.8 Add Product to Cart Fail
**Test Case ID:** CART-008  
**Description:** Verify product addition failure  
**Action:** Dispatch ADD_PRODUCT_TO_CART_FAIL with error  
**Expected Result:**
- error: provided error
- loading: false

### 2.9 Remove Product from Cart Start
**Test Case ID:** CART-009  
**Description:** Verify removing product sets loading  
**Action:** Dispatch REMOVE_PRODUCT_FROM_CART_START  
**Expected Result:**
- loading: true

### 2.10 Remove Product from Cart Success - Items Remain
**Test Case ID:** CART-010  
**Description:** Verify product removal with remaining items  
**Preconditions:** Cart has multiple items  
**Action:** Dispatch REMOVE_PRODUCT_FROM_CART_SUCCESS with productId  
**Expected Result:**
- products: array without removed product
- totalPrice: adjusted (original - removed product price)
- loading: false

### 2.11 Remove Product from Cart Success - Last Item
**Test Case ID:** CART-011  
**Description:** Verify removing last product empties cart  
**Preconditions:** Cart has one item  
**Action:** Dispatch REMOVE_PRODUCT_FROM_CART_SUCCESS with productId  
**Expected Result:**
- products: []
- totalPrice: 0
- loading: false

### 2.12 Remove Product from Cart Fail
**Test Case ID:** CART-012  
**Description:** Verify product removal failure  
**Action:** Dispatch REMOVE_PRODUCT_FROM_CART_FAIL with error  
**Expected Result:**
- error: provided error
- loading: false

---

## 3. Shop Module Test Cases

### 3.1 Initial State
**Test Case ID:** SHOP-001  
**Description:** Verify initial shop state  
**Preconditions:** Application starts  
**Expected Result:**
- products: []
- loading: false
- error: null
- pageNumber: undefined initially

### 3.2 Fetch Products Start
**Test Case ID:** SHOP-002  
**Description:** Verify FETCH_PRODUCTS_START sets loading  
**Action:** Dispatch FETCH_PRODUCTS_START  
**Expected Result:**
- loading: true

### 3.3 Fetch Products Success - First Page
**Test Case ID:** SHOP-003  
**Description:** Verify successful products fetch  
**Action:** Dispatch FETCH_PRODUCTS_SUCCESS with products and pageNumber  
**Expected Result:**
- products: provided products array
- pageNumber: provided pageNumber
- loading: false

### 3.4 Fetch Products Success - Next Page
**Test Case ID:** SHOP-004  
**Description:** Verify pagination to next page  
**Preconditions:** On page 1  
**Action:** Navigate to next page  
**Expected Result:**
- products: new page products
- pageNumber: incremented
- loading: false

### 3.5 Fetch Products Success - Previous Page
**Test Case ID:** SHOP-005  
**Description:** Verify pagination to previous page  
**Preconditions:** On page 2 or higher  
**Action:** Navigate to previous page  
**Expected Result:**
- products: previous page products
- pageNumber: decremented
- loading: false

### 3.6 Fetch Products Fail
**Test Case ID:** SHOP-006  
**Description:** Verify products fetch failure  
**Action:** Dispatch FETCH_PRODUCTS_FAIL with error  
**Expected Result:**
- error: provided error
- loading: false

---

## 4. Orders Module Test Cases

### 4.1 Initial State
**Test Case ID:** ORDER-001  
**Description:** Verify initial orders state  
**Preconditions:** Application starts  
**Expected Result:**
- orders: []
- loading: false
- error: false

### 4.2 Fetch Orders Start
**Test Case ID:** ORDER-002  
**Description:** Verify FETCH_ORDERS_START sets loading  
**Action:** Dispatch FETCH_ORDERS_START  
**Expected Result:**
- loading: true

### 4.3 Fetch Orders Success - No Orders
**Test Case ID:** ORDER-003  
**Description:** Verify fetching empty orders list  
**Action:** Dispatch FETCH_ORDERS_SUCCESS with empty array  
**Expected Result:**
- orders: []
- loading: false

### 4.4 Fetch Orders Success - With Orders
**Test Case ID:** ORDER-004  
**Description:** Verify fetching orders list  
**Action:** Dispatch FETCH_ORDERS_SUCCESS with orders  
**Expected Result:**
- orders: provided orders array
- loading: false

### 4.5 Fetch Orders Fail
**Test Case ID:** ORDER-005  
**Description:** Verify orders fetch failure  
**Action:** Dispatch FETCH_ORDERS_FAIL with error  
**Expected Result:**
- error: provided error
- loading: false

---

## 5. Integration Test Cases

### 5.1 Complete User Journey - Sign Up to Purchase
**Test Case ID:** INT-001  
**Description:** Complete e-commerce flow  
**Steps:**
1. User signs up (AUTH_START → AUTH_SUCCESS)
2. Browse products (FETCH_PRODUCTS_START → FETCH_PRODUCTS_SUCCESS)
3. Add product to cart (ADD_PRODUCT_TO_CART_START → SUCCESS)
4. View cart (FETCH_CART_START → FETCH_CART_SUCCESS)
5. Checkout
6. View orders (FETCH_ORDERS_START → FETCH_ORDERS_SUCCESS)
**Expected Result:** All state transitions work correctly in sequence

### 5.2 Session Persistence
**Test Case ID:** INT-002  
**Description:** Verify session persistence across page refresh  
**Steps:**
1. User logs in
2. Token stored in localStorage
3. Page refreshed
4. Auto-login triggered
**Expected Result:** User remains authenticated

### 5.3 Session Expiry
**Test Case ID:** INT-003  
**Description:** Verify automatic logout on token expiry  
**Steps:**
1. User logs in
2. Wait for token expiry (3600s)
3. Auth timeout triggers
**Expected Result:** User automatically logged out, redirected to public routes

### 5.4 Unauthorized Cart Access
**Test Case ID:** INT-004  
**Description:** Verify cart operations require authentication  
**Preconditions:** User not authenticated  
**Action:** Attempt cart operations  
**Expected Result:** Operations fail or redirect to auth

### 5.5 Route Protection
**Test Case ID:** INT-005  
**Description:** Verify protected routes redirect unauthenticated users  
**Preconditions:** User not authenticated  
**Action:** Navigate to /cart, /checkout, /orders  
**Expected Result:** Redirected to / or /auth

---

## 6. Error Handling Test Cases

### 6.1 Network Failure - Auth
**Test Case ID:** ERR-001  
**Description:** Handle network failure during authentication  
**Action:** Simulate network error during login  
**Expected Result:** AUTH_FAIL dispatched with error

### 6.2 Network Failure - Cart Operations
**Test Case ID:** ERR-002  
**Description:** Handle network failure during cart operations  
**Action:** Simulate network error during cart fetch/add/remove  
**Expected Result:** Appropriate FAIL action dispatched

### 6.3 Invalid Token
**Test Case ID:** ERR-003  
**Description:** Handle invalid or corrupted token  
**Preconditions:** Invalid token in localStorage  
**Expected Result:** Auto-logout triggered

### 6.4 Server Error Response
**Test Case ID:** ERR-004  
**Description:** Handle 500 server errors  
**Action:** Server returns 500 error  
**Expected Result:** Error state set, user notified

---

## 7. Performance Test Cases

### 7.1 Loading State Management
**Test Case ID:** PERF-001  
**Description:** Verify loading states prevent duplicate requests  
**Action:** Rapidly trigger same action  
**Expected Result:** Only one request processed at a time

### 7.2 Pagination Performance
**Test Case ID:** PERF-002  
**Description:** Verify smooth pagination transitions  
**Action:** Navigate between pages quickly  
**Expected Result:** No race conditions, correct page displayed

---

## Test Execution Summary

### Priority Levels
- **P0 (Critical):** AUTH-001 to AUTH-007, CART-001 to CART-012, INT-001
- **P1 (High):** SHOP-001 to SHOP-006, ORDER-001 to ORDER-005, INT-002 to INT-005
- **P2 (Medium):** ERR-001 to ERR-004
- **P3 (Low):** PERF-001 to PERF-002

### Test Environment
- Framework: Jest + React Testing Library
- Test Runner: react-scripts test
- Coverage Target: >80% for reducers and actions

### Success Criteria
- All P0 and P1 tests must pass
- No state inconsistencies
- Proper error handling for all failure cases
- Loading states correctly managed
