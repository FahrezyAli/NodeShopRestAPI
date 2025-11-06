# Use Case Scenarios

Based on the use case diagram in `usecase.puml`, this document describes detailed scenarios for each use case.

## Actor: Guest

### UC-G001: Browse Products
**Primary Actor:** Guest  
**Goal:** View available products in the shop  
**Preconditions:** None  
**Postconditions:** Guest sees list of products  

**Main Success Scenario:**
1. Guest navigates to the shop page
2. System retrieves all available products from the database
3. System displays products in a grid/list format with images, names, and prices
4. Guest can scroll through the product list

**Extensions:**
- 2a. No products available: System displays "No products available" message
- 2b. Network error: System displays error message and retry option

---

### UC-G002: View Product Details
**Primary Actor:** Guest  
**Goal:** View detailed information about a specific product  
**Preconditions:** Products are available  
**Postconditions:** Guest sees product details  

**Main Success Scenario:**
1. Guest clicks on a product from the product list
2. System retrieves product details (name, description, price, image, stock)
3. System displays product detail page
4. Guest views product information

**Extensions:**
- 2a. Product not found: System redirects to shop page with error message
- 2b. Product out of stock: System displays "Out of Stock" indicator

---

### UC-G003: Login / Signup (Guest)
**Primary Actor:** Guest  
**Goal:** Create account or login to access customer features  
**Preconditions:** Guest is not authenticated  
**Postconditions:** User is authenticated as Customer  
**Includes:** Authenticate User  

**Main Success Scenario:**
1. Guest clicks "Login/Signup" button
2. System displays authentication form
3. Guest enters email and password
4. System validates credentials via Authentication System
5. System creates session token
6. System redirects to shop page as authenticated Customer

**Extensions:**
- 3a. Guest chooses signup: System requires email, password, password confirmation
- 4a. Invalid credentials: System displays error message
- 4b. Email already exists (signup): System displays error and suggests login
- 4c. Weak password: System displays password requirements

---

## Actor: Customer

### UC-C001: Browse Products
**Primary Actor:** Customer  
**Goal:** View available products as authenticated user  
**Preconditions:** Customer is logged in  
**Postconditions:** Customer sees list of products with cart functionality  

**Main Success Scenario:**
1. Customer navigates to shop page
2. System retrieves all available products
3. System displays products with "Add to Cart" buttons
4. Customer can interact with products

---

### UC-C002: View Product Details
**Primary Actor:** Customer  
**Goal:** View detailed product information with purchase options  
**Preconditions:** Customer is logged in  
**Postconditions:** Customer sees product details with cart actions  

**Main Success Scenario:**
1. Customer clicks on a product
2. System retrieves and displays product details
3. System displays "Add to Cart" button
4. Customer views product information

---

### UC-C003: Add Product to Cart
**Primary Actor:** Customer  
**Goal:** Add a product to shopping cart  
**Preconditions:** Customer is logged in, product is available  
**Postconditions:** Product is added to cart, cart count updates  

**Main Success Scenario:**
1. Customer clicks "Add to Cart" button on product
2. System validates product availability
3. System adds product to customer's cart (Redux store)
4. System updates cart count in UI
5. System displays success notification

**Extensions:**
- 2a. Product out of stock: System displays error message
- 2b. Product already in cart: System increments quantity
- 2c. Maximum quantity reached: System displays limit message

---

### UC-C004: Remove Product from Cart
**Primary Actor:** Customer  
**Goal:** Remove a product from shopping cart  
**Preconditions:** Customer is logged in, cart has items  
**Postconditions:** Product is removed from cart  

**Main Success Scenario:**
1. Customer views cart
2. Customer clicks "Remove" button for a product
3. System removes product from cart (Redux store)
4. System updates cart total and count
5. System displays updated cart

**Extensions:**
- 2a. Last item removed: System displays "Your cart is empty" message

---

### UC-C005: View Cart
**Primary Actor:** Customer  
**Goal:** View all items in shopping cart  
**Preconditions:** Customer is logged in  
**Postconditions:** Customer sees cart contents  

**Main Success Scenario:**
1. Customer clicks cart icon/button
2. System retrieves cart items from Redux store
3. System calculates total price
4. System displays cart items with quantities and prices
5. Customer can proceed to checkout or continue shopping

**Extensions:**
- 2a. Cart is empty: System displays empty cart message

---

### UC-C006: Checkout
**Primary Actor:** Customer  
**Goal:** Complete purchase of cart items  
**Preconditions:** Customer is logged in, cart has items  
**Postconditions:** Order is created, payment is processed  
**Includes:** Process Payment, Create Order  

**Main Success Scenario:**
1. Customer clicks "Checkout" button from cart
2. System validates cart items availability
3. System displays checkout page with order summary
4. Customer enters/confirms shipping information
5. System displays Stripe payment form
6. Customer enters payment information
7. System processes payment via Payment Gateway (Stripe)
8. System creates order record via POST /create-order
9. System clears cart
10. System displays order confirmation with order ID
11. Customer is redirected to orders page

**Extensions:**
- 2a. Item no longer available: System removes item and notifies customer
- 7a. Payment declined: System displays error and allows retry
- 7b. Network error during payment: System displays error and preserves cart
- 8a. Order creation fails: System notifies customer and support

---

### UC-C007: View Orders
**Primary Actor:** Customer  
**Goal:** View order history  
**Preconditions:** Customer is logged in  
**Postconditions:** Customer sees list of past orders  

**Main Success Scenario:**
1. Customer navigates to "My Orders" page
2. System retrieves customer's orders from database
3. System displays orders with details (order ID, date, items, total, status)
4. Customer can view individual order details

**Extensions:**
- 2a. No orders found: System displays "No orders yet" message
- 2b. Network error: System displays error and retry option

---

## Actor: Admin

### UC-A001: Login / Signup (Admin)
**Primary Actor:** Admin  
**Goal:** Authenticate as administrator  
**Preconditions:** User has admin credentials  
**Postconditions:** User is authenticated with admin privileges  
**Includes:** Authenticate User  

**Main Success Scenario:**
1. Admin navigates to login page
2. Admin enters admin credentials
3. System validates credentials and admin role
4. System creates admin session
5. System redirects to admin dashboard

**Extensions:**
- 3a. Invalid credentials: System displays error
- 3b. User not admin: System denies access

---

### UC-A002: Manage Products
**Primary Actor:** Admin  
**Goal:** Create, update, or delete products  
**Preconditions:** Admin is logged in  
**Postconditions:** Product catalog is updated  

**Main Success Scenario (Add Product):**
1. Admin navigates to product management page
2. Admin clicks "Add Product" button
3. System displays product form
4. Admin enters product details (name, description, price, image, stock)
5. Admin clicks "Save"
6. System validates product data
7. System creates product in database
8. System displays success message and updated product list

**Alternative Flow (Edit Product):**
1. Admin selects existing product
2. System displays product form with current data
3. Admin modifies product details
4. Admin clicks "Update"
5. System validates and updates product
6. System displays success message

**Alternative Flow (Delete Product):**
1. Admin selects product to delete
2. System displays confirmation dialog
3. Admin confirms deletion
4. System removes product from database
5. System displays success message

**Extensions:**
- 6a. Invalid data (missing fields, negative price): System displays validation errors
- 6b. Image upload fails: System displays error
- 7a. Database error: System displays error and logs issue

---

### UC-A003: View Orders (Admin)
**Primary Actor:** Admin  
**Goal:** View all customer orders  
**Preconditions:** Admin is logged in  
**Postconditions:** Admin sees all orders in system  

**Main Success Scenario:**
1. Admin navigates to orders management page
2. System retrieves all orders from database
3. System displays orders with filters (status, date, customer)
4. Admin can view order details
5. Admin can update order status

**Extensions:**
- 2a. No orders found: System displays "No orders in system"
- 5a. Status update fails: System displays error

---

## Supporting Use Cases

### UC-S001: Authenticate User
**Goal:** Validate user credentials and create session  
**Triggered by:** Login/Signup use cases  

**Main Success Scenario:**
1. System receives credentials (email, password)
2. System validates email format
3. System checks credentials against Authentication System
4. System generates JWT token
5. System stores token in client
6. System returns user data (userId, email, role)

**Extensions:**
- 3a. Invalid credentials: Return error
- 3b. Account locked: Return error
- 4a. Token generation fails: Return error

---

### UC-S002: Process Payment
**Goal:** Handle payment transaction via Stripe  
**Triggered by:** Checkout use case  

**Main Success Scenario:**
1. System receives payment information from Stripe form
2. System validates payment data
3. System sends payment request to Payment Gateway (Stripe)
4. Payment Gateway processes payment
5. Payment Gateway returns success response
6. System stores transaction ID

**Extensions:**
- 3a. Insufficient funds: Return payment declined error
- 3b. Invalid card: Return validation error
- 3c. Network timeout: Retry and return error if fails

---

### UC-S003: Create Order
**Goal:** Create order record after successful payment  
**Triggered by:** Checkout use case (after Process Payment)  

**Main Success Scenario:**
1. System receives cart items and payment confirmation
2. System calculates order total
3. System creates order record with:
   - Customer ID
   - Order items (products, quantities, prices)
   - Total amount
   - Payment transaction ID
   - Order status (pending/completed)
   - Timestamp
4. System saves order to database
5. System returns order ID

**Extensions:**
- 4a. Database error: Rollback and return error
- 4b. Duplicate order: Check and prevent duplication
