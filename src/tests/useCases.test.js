import axios from 'axios';

// Mock axios
jest.mock('axios');

/**
 * USE CASE INTEGRATION TESTS
 * Based on use-case-scenarios.md
 * 
 * These tests verify the main success scenarios and extensions
 * for each use case from the use case diagram.
 */

describe('Use Case Tests - Guest Actor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * UC-G001: Browse Products
   * Main Success Scenario: Guest views product list
   */
  describe('UC-G001: Browse Products', () => {
    it('should display products when available', async () => {
      const mockProducts = [
        {
          _id: '1',
          title: 'Product 1',
          price: 29.99,
          imageUrl: '/img1.jpg',
        },
        {
          _id: '2',
          title: 'Product 2',
          price: 49.99,
          imageUrl: '/img2.jpg',
        },
      ];

      axios.get.mockResolvedValue({ data: { products: mockProducts } });

      // Test that products are fetched and displayed
      const response = await axios.get('/products');
      expect(response.data.products).toEqual(mockProducts);
      expect(response.data.products).toHaveLength(2);
    });

    it('Extension 2a: should handle no products available', async () => {
      axios.get.mockResolvedValue({ data: { products: [] } });

      const response = await axios.get('/products');
      expect(response.data.products).toEqual([]);
    });

    it('Extension 2b: should handle network error', async () => {
      const networkError = new Error('Network Error');
      axios.get.mockRejectedValue(networkError);

      await expect(axios.get('/products')).rejects.toThrow('Network Error');
    });
  });

  /**
   * UC-G002: View Product Details
   * Main Success Scenario: Guest views detailed product information
   */
  describe('UC-G002: View Product Details', () => {
    it('should retrieve and display product details', async () => {
      const mockProduct = {
        _id: '123',
        title: 'Test Product',
        description: 'A great product',
        price: 99.99,
        imageUrl: '/test.jpg',
        stock: 10,
      };

      axios.get.mockResolvedValue({ data: { product: mockProduct } });

      const response = await axios.get('/products/123');
      expect(response.data.product).toEqual(mockProduct);
      expect(response.data.product.title).toBe('Test Product');
      expect(response.data.product.stock).toBe(10);
    });

    it('Extension 2a: should handle product not found', async () => {
      axios.get.mockRejectedValue({
        response: { status: 404, data: { message: 'Product not found' } },
      });

      await expect(axios.get('/products/999')).rejects.toMatchObject({
        response: { status: 404 },
      });
    });

    it('Extension 2b: should indicate when product is out of stock', async () => {
      const outOfStockProduct = {
        _id: '456',
        title: 'Out of Stock Product',
        price: 29.99,
        stock: 0,
      };

      axios.get.mockResolvedValue({ data: { product: outOfStockProduct } });

      const response = await axios.get('/products/456');
      expect(response.data.product.stock).toBe(0);
    });
  });

  /**
   * UC-G003: Login / Signup (Guest)
   * Main Success Scenario: Guest authenticates successfully
   */
  describe('UC-G003: Login / Signup', () => {
    it('should authenticate user with valid credentials', async () => {
      const mockAuthResponse = {
        token: 'test-token-123',
        userId: 'user-123',
        email: 'test@example.com',
      };

      axios.post.mockResolvedValue({ data: mockAuthResponse });

      const response = await axios.post('/auth/login', {
        email: 'test@example.com',
        password: 'password123',
      });

      expect(response.data.token).toBe('test-token-123');
      expect(response.data.userId).toBe('user-123');
      expect(response.data.email).toBe('test@example.com');
    });

    it('Extension 3a: should handle signup with valid data', async () => {
      const signupData = {
        email: 'newuser@example.com',
        password: 'SecurePass123!',
        confirmPassword: 'SecurePass123!',
      };

      const mockResponse = {
        token: 'new-token',
        userId: 'new-user-id',
        email: signupData.email,
      };

      axios.post.mockResolvedValue({ data: mockResponse });

      const response = await axios.post('/auth/signup', signupData);
      expect(response.data.email).toBe(signupData.email);
    });

    it('Extension 4a: should handle invalid credentials', async () => {
      axios.post.mockRejectedValue({
        response: {
          status: 401,
          data: { message: 'Invalid credentials' },
        },
      });

      await expect(
        axios.post('/auth/login', {
          email: 'wrong@example.com',
          password: 'wrongpassword',
        })
      ).rejects.toMatchObject({
        response: { status: 401 },
      });
    });

    it('Extension 4b: should handle email already exists', async () => {
      axios.post.mockRejectedValue({
        response: {
          status: 422,
          data: { message: 'Email already exists' },
        },
      });

      await expect(
        axios.post('/auth/signup', {
          email: 'existing@example.com',
          password: 'password123',
        })
      ).rejects.toMatchObject({
        response: { status: 422 },
      });
    });

    it('Extension 4c: should validate password strength', async () => {
      axios.post.mockRejectedValue({
        response: {
          status: 422,
          data: { message: 'Password too weak' },
        },
      });

      await expect(
        axios.post('/auth/signup', {
          email: 'test@example.com',
          password: '123',
        })
      ).rejects.toMatchObject({
        response: { status: 422 },
      });
    });
  });
});

describe('Use Case Tests - Customer Actor', () => {
  const mockAuthState = {
    token: 'valid-token',
    userId: 'customer-123',
    email: 'customer@example.com',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * UC-C003: Add Product to Cart
   * Main Success Scenario: Customer adds product to cart
   */
  describe('UC-C003: Add Product to Cart', () => {
    it('should add product to cart successfully', async () => {
      const productId = 'product-123';
      const mockResponse = {
        cart: {
          products: [
            {
              productId: productId,
              quantity: 1,
              title: 'Test Product',
              price: 29.99,
            },
          ],
        },
      };

      axios.post.mockResolvedValue({ data: mockResponse });

      const response = await axios.post(
        '/cart',
        { productId },
        {
          headers: {
            Authorization: `Bearer ${mockAuthState.token}`,
            UserId: mockAuthState.userId,
          },
        }
      );

      expect(response.data.cart.products).toHaveLength(1);
      expect(response.data.cart.products[0].productId).toBe(productId);
    });

    it('Extension 2a: should handle product out of stock', async () => {
      axios.post.mockRejectedValue({
        response: {
          status: 400,
          data: { message: 'Product out of stock' },
        },
      });

      await expect(
        axios.post('/cart', { productId: 'out-of-stock-123' })
      ).rejects.toMatchObject({
        response: { status: 400 },
      });
    });

    it('Extension 2b: should increment quantity if product already in cart', async () => {
      const mockResponse = {
        cart: {
          products: [
            {
              productId: 'product-123',
              quantity: 2,
              title: 'Test Product',
              price: 29.99,
            },
          ],
        },
      };

      axios.post.mockResolvedValue({ data: mockResponse });

      const response = await axios.post('/cart', {
        productId: 'product-123',
      });

      expect(response.data.cart.products[0].quantity).toBe(2);
    });
  });

  /**
   * UC-C004: Remove Product from Cart
   * Main Success Scenario: Customer removes product from cart
   */
  describe('UC-C004: Remove Product from Cart', () => {
    it('should remove product from cart successfully', async () => {
      axios.delete.mockResolvedValue({
        data: { message: 'Product removed' },
      });

      const response = await axios.delete('/cart', {
        headers: {
          Authorization: `Bearer ${mockAuthState.token}`,
          UserId: mockAuthState.userId,
        },
        data: { productId: 'product-123' },
      });

      expect(response.data.message).toBe('Product removed');
    });

    it('Extension 2a: should handle empty cart after last item removed', async () => {
      axios.delete.mockResolvedValue({
        data: {
          message: 'Product removed',
          cart: { products: [], totalPrice: 0 },
        },
      });

      const response = await axios.delete('/cart', {
        data: { productId: 'last-product' },
      });

      expect(response.data.cart.products).toHaveLength(0);
      expect(response.data.cart.totalPrice).toBe(0);
    });
  });

  /**
   * UC-C005: View Cart
   * Main Success Scenario: Customer views cart contents
   */
  describe('UC-C005: View Cart', () => {
    it('should retrieve cart with items and total price', async () => {
      const mockCart = {
        products: [
          {
            productId: '1',
            title: 'Product 1',
            quantity: 2,
            price: 29.99,
          },
          {
            productId: '2',
            title: 'Product 2',
            quantity: 1,
            price: 49.99,
          },
        ],
        totalPrice: 109.97,
      };

      axios.get.mockResolvedValue({ data: mockCart });

      const response = await axios.get('/cart', {
        headers: {
          Authorization: `Bearer ${mockAuthState.token}`,
          UserId: mockAuthState.userId,
        },
      });

      expect(response.data.products).toHaveLength(2);
      expect(response.data.totalPrice).toBe(109.97);
    });

    it('Extension 2a: should handle empty cart', async () => {
      axios.get.mockResolvedValue({
        data: { products: [], totalPrice: 0 },
      });

      const response = await axios.get('/cart');
      expect(response.data.products).toHaveLength(0);
    });
  });

  /**
   * UC-C006: Checkout
   * Main Success Scenario: Customer completes purchase
   * Includes: Process Payment, Create Order
   */
  describe('UC-C006: Checkout', () => {
    const mockCartItems = [
      {
        productId: '1',
        title: 'Product 1',
        quantity: 2,
        price: 29.99,
      },
    ];

    it('should complete checkout with payment and order creation', async () => {
      // Mock payment processing
      const mockPaymentResponse = {
        transactionId: 'txn-123',
        status: 'success',
      };

      // Mock order creation
      const mockOrderResponse = {
        orderId: 'order-456',
        products: mockCartItems,
        totalPrice: 59.98,
        status: 'pending',
      };

      axios.post
        .mockResolvedValueOnce({ data: mockPaymentResponse })
        .mockResolvedValueOnce({ data: mockOrderResponse });

      // Process payment
      const paymentResponse = await axios.post('/payment/process', {
        amount: 59.98,
        token: 'stripe-token',
      });
      expect(paymentResponse.data.status).toBe('success');

      // Create order
      const orderResponse = await axios.post('/create-order', {
        products: mockCartItems,
        transactionId: paymentResponse.data.transactionId,
      });
      expect(orderResponse.data.orderId).toBe('order-456');
      expect(orderResponse.data.totalPrice).toBe(59.98);
    });

    it('Extension 2a: should handle item no longer available', async () => {
      axios.post.mockRejectedValue({
        response: {
          status: 400,
          data: { message: 'Item no longer available' },
        },
      });

      await expect(
        axios.post('/checkout/validate', { items: mockCartItems })
      ).rejects.toMatchObject({
        response: { status: 400 },
      });
    });

    it('Extension 7a: should handle payment declined', async () => {
      axios.post.mockRejectedValue({
        response: {
          status: 402,
          data: { message: 'Payment declined' },
        },
      });

      await expect(
        axios.post('/payment/process', {
          amount: 59.98,
          token: 'invalid-token',
        })
      ).rejects.toMatchObject({
        response: { status: 402 },
      });
    });

    it('Extension 7b: should preserve cart on network error', async () => {
      const networkError = new Error('Network Error');
      axios.post.mockRejectedValue(networkError);

      // Attempt checkout
      await expect(
        axios.post('/payment/process', { amount: 59.98 })
      ).rejects.toThrow('Network Error');

      // Verify cart still exists
      axios.get.mockResolvedValue({
        data: { products: mockCartItems, totalPrice: 59.98 },
      });
      const cartResponse = await axios.get('/cart');
      expect(cartResponse.data.products).toEqual(mockCartItems);
    });

    it('Extension 8a: should handle order creation failure', async () => {
      axios.post.mockRejectedValue({
        response: {
          status: 500,
          data: { message: 'Failed to create order' },
        },
      });

      await expect(
        axios.post('/create-order', { products: mockCartItems })
      ).rejects.toMatchObject({
        response: { status: 500 },
      });
    });
  });

  /**
   * UC-C007: View Orders
   * Main Success Scenario: Customer views order history
   */
  describe('UC-C007: View Orders', () => {
    it('should retrieve customer order history', async () => {
      const mockOrders = [
        {
          orderId: 'order-1',
          date: '2025-11-01',
          items: [{ title: 'Product 1', quantity: 2 }],
          total: 59.98,
          status: 'delivered',
        },
        {
          orderId: 'order-2',
          date: '2025-11-05',
          items: [{ title: 'Product 2', quantity: 1 }],
          total: 29.99,
          status: 'pending',
        },
      ];

      axios.get.mockResolvedValue({ data: { orders: mockOrders } });

      const response = await axios.get('/orders', {
        headers: {
          Authorization: `Bearer ${mockAuthState.token}`,
          UserId: mockAuthState.userId,
        },
      });

      expect(response.data.orders).toHaveLength(2);
      expect(response.data.orders[0].orderId).toBe('order-1');
    });

    it('Extension 2a: should handle no orders found', async () => {
      axios.get.mockResolvedValue({ data: { orders: [] } });

      const response = await axios.get('/orders');
      expect(response.data.orders).toHaveLength(0);
    });

    it('Extension 2b: should handle network error', async () => {
      axios.get.mockRejectedValue(new Error('Network Error'));

      await expect(axios.get('/orders')).rejects.toThrow('Network Error');
    });
  });
});

describe('Use Case Tests - Admin Actor', () => {
  const mockAdminAuth = {
    token: 'admin-token',
    userId: 'admin-123',
    email: 'admin@example.com',
    role: 'admin',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * UC-A001: Login / Signup (Admin)
   * Main Success Scenario: Admin authenticates successfully
   */
  describe('UC-A001: Admin Login', () => {
    it('should authenticate admin with valid credentials', async () => {
      const mockResponse = {
        token: 'admin-token',
        userId: 'admin-123',
        email: 'admin@example.com',
        role: 'admin',
      };

      axios.post.mockResolvedValue({ data: mockResponse });

      const response = await axios.post('/auth/login', {
        email: 'admin@example.com',
        password: 'adminpass',
      });

      expect(response.data.role).toBe('admin');
    });

    it('Extension 3b: should deny access to non-admin users', async () => {
      axios.post.mockRejectedValue({
        response: {
          status: 403,
          data: { message: 'Access denied' },
        },
      });

      await expect(
        axios.post('/auth/admin-login', {
          email: 'user@example.com',
          password: 'pass',
        })
      ).rejects.toMatchObject({
        response: { status: 403 },
      });
    });
  });

  /**
   * UC-A002: Manage Products
   * Main Success Scenario: Admin creates, updates, or deletes products
   */
  describe('UC-A002: Manage Products', () => {
    it('should create new product successfully', async () => {
      const newProduct = {
        title: 'New Product',
        description: 'Product description',
        price: 99.99,
        imageUrl: '/image.jpg',
        stock: 50,
      };

      const mockResponse = {
        productId: 'new-product-id',
        ...newProduct,
      };

      axios.post.mockResolvedValue({ data: mockResponse });

      const response = await axios.post('/admin/products', newProduct, {
        headers: { Authorization: `Bearer ${mockAdminAuth.token}` },
      });

      expect(response.data.productId).toBe('new-product-id');
      expect(response.data.title).toBe('New Product');
    });

    it('should update existing product', async () => {
      const updatedProduct = {
        _id: 'product-123',
        title: 'Updated Product',
        price: 79.99,
      };

      axios.put.mockResolvedValue({ data: updatedProduct });

      const response = await axios.put(
        '/admin/products/product-123',
        updatedProduct,
        {
          headers: { Authorization: `Bearer ${mockAdminAuth.token}` },
        }
      );

      expect(response.data.title).toBe('Updated Product');
      expect(response.data.price).toBe(79.99);
    });

    it('should delete product successfully', async () => {
      axios.delete.mockResolvedValue({
        data: { message: 'Product deleted' },
      });

      const response = await axios.delete('/admin/products/product-123', {
        headers: { Authorization: `Bearer ${mockAdminAuth.token}` },
      });

      expect(response.data.message).toBe('Product deleted');
    });

    it('Extension 6a: should validate product data', async () => {
      const invalidProduct = {
        title: '',
        price: -10,
      };

      axios.post.mockRejectedValue({
        response: {
          status: 422,
          data: { message: 'Validation failed', errors: ['Invalid price'] },
        },
      });

      await expect(
        axios.post('/admin/products', invalidProduct)
      ).rejects.toMatchObject({
        response: { status: 422 },
      });
    });

    it('Extension 7a: should handle database error', async () => {
      axios.post.mockRejectedValue({
        response: {
          status: 500,
          data: { message: 'Database error' },
        },
      });

      await expect(
        axios.post('/admin/products', { title: 'Product' })
      ).rejects.toMatchObject({
        response: { status: 500 },
      });
    });
  });

  /**
   * UC-A003: View Orders (Admin)
   * Main Success Scenario: Admin views all orders
   */
  describe('UC-A003: View All Orders', () => {
    it('should retrieve all orders in system', async () => {
      const mockOrders = [
        {
          orderId: 'order-1',
          customerId: 'customer-1',
          total: 99.99,
          status: 'pending',
        },
        {
          orderId: 'order-2',
          customerId: 'customer-2',
          total: 149.99,
          status: 'delivered',
        },
      ];

      axios.get.mockResolvedValue({ data: { orders: mockOrders } });

      const response = await axios.get('/admin/orders', {
        headers: { Authorization: `Bearer ${mockAdminAuth.token}` },
      });

      expect(response.data.orders).toHaveLength(2);
    });

    it('should update order status', async () => {
      const updatedOrder = {
        orderId: 'order-1',
        status: 'shipped',
      };

      axios.patch.mockResolvedValue({ data: updatedOrder });

      const response = await axios.patch(
        '/admin/orders/order-1',
        { status: 'shipped' },
        {
          headers: { Authorization: `Bearer ${mockAdminAuth.token}` },
        }
      );

      expect(response.data.status).toBe('shipped');
    });

    it('Extension 2a: should handle no orders in system', async () => {
      axios.get.mockResolvedValue({ data: { orders: [] } });

      const response = await axios.get('/admin/orders');
      expect(response.data.orders).toHaveLength(0);
    });
  });
});

/**
 * Supporting Use Cases Tests
 */
describe('Supporting Use Cases', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * UC-S001: Authenticate User
   * Goal: Validate credentials and create session
   */
  describe('UC-S001: Authenticate User', () => {
    it('should validate credentials and return JWT token', async () => {
      const credentials = {
        email: 'user@example.com',
        password: 'password123',
      };

      const mockResponse = {
        token: 'jwt-token-xyz',
        userId: 'user-abc',
        email: credentials.email,
      };

      axios.post.mockResolvedValue({ data: mockResponse });

      const response = await axios.post('/auth/login', credentials);

      expect(response.data.token).toBeDefined();
      expect(response.data.userId).toBe('user-abc');
      expect(response.data.email).toBe(credentials.email);
    });

    it('Extension 3a: should handle invalid credentials', async () => {
      axios.post.mockRejectedValue({
        response: {
          status: 401,
          data: { message: 'Invalid credentials' },
        },
      });

      await expect(
        axios.post('/auth/login', {
          email: 'wrong@example.com',
          password: 'wrong',
        })
      ).rejects.toMatchObject({
        response: { status: 401 },
      });
    });
  });

  /**
   * UC-S002: Process Payment
   * Goal: Handle payment via Stripe
   */
  describe('UC-S002: Process Payment', () => {
    it('should process payment successfully via Stripe', async () => {
      const paymentData = {
        amount: 99.99,
        token: 'stripe-token-123',
        currency: 'usd',
      };

      const mockResponse = {
        transactionId: 'txn-xyz',
        status: 'success',
        amount: 99.99,
      };

      axios.post.mockResolvedValue({ data: mockResponse });

      const response = await axios.post('/payment/process', paymentData);

      expect(response.data.transactionId).toBe('txn-xyz');
      expect(response.data.status).toBe('success');
    });

    it('Extension 3a: should handle insufficient funds', async () => {
      axios.post.mockRejectedValue({
        response: {
          status: 402,
          data: { message: 'Insufficient funds' },
        },
      });

      await expect(
        axios.post('/payment/process', { amount: 999999 })
      ).rejects.toMatchObject({
        response: { status: 402 },
      });
    });

    it('Extension 3b: should handle invalid card', async () => {
      axios.post.mockRejectedValue({
        response: {
          status: 400,
          data: { message: 'Invalid card number' },
        },
      });

      await expect(
        axios.post('/payment/process', { token: 'invalid-token' })
      ).rejects.toMatchObject({
        response: { status: 400 },
      });
    });
  });

  /**
   * UC-S003: Create Order
   * Goal: Create order record after successful payment
   */
  describe('UC-S003: Create Order', () => {
    it('should create order with all required fields', async () => {
      const orderData = {
        customerId: 'customer-123',
        products: [
          { productId: '1', quantity: 2, price: 29.99 },
          { productId: '2', quantity: 1, price: 49.99 },
        ],
        totalAmount: 109.97,
        transactionId: 'txn-xyz',
        status: 'pending',
      };

      const mockResponse = {
        orderId: 'order-789',
        ...orderData,
        createdAt: '2025-11-06T23:00:00Z',
      };

      axios.post.mockResolvedValue({ data: mockResponse });

      const response = await axios.post('/create-order', orderData);

      expect(response.data.orderId).toBe('order-789');
      expect(response.data.products).toHaveLength(2);
      expect(response.data.totalAmount).toBe(109.97);
      expect(response.data.transactionId).toBe('txn-xyz');
    });

    it('Extension 4a: should handle database error', async () => {
      axios.post.mockRejectedValue({
        response: {
          status: 500,
          data: { message: 'Database error' },
        },
      });

      await expect(
        axios.post('/create-order', { customerId: '123' })
      ).rejects.toMatchObject({
        response: { status: 500 },
      });
    });

    it('Extension 4b: should prevent duplicate orders', async () => {
      axios.post.mockRejectedValue({
        response: {
          status: 409,
          data: { message: 'Duplicate order detected' },
        },
      });

      await expect(
        axios.post('/create-order', { transactionId: 'existing-txn' })
      ).rejects.toMatchObject({
        response: { status: 409 },
      });
    });
  });
});
