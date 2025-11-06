import cartReducer from './cartReducer';
import * as cartActionTypes from '../actions/cartActionTypes';

describe('cartReducer', () => {
  const initialState = {
    error: false,
    products: [],
    totalPrice: 0,
    loading: false,
  };

  // CART-001: Initial State
  it('should return the initial state', () => {
    expect(cartReducer(undefined, {})).toEqual(initialState);
  });

  // CART-002: Fetch Cart Start
  it('should handle FETCH_CART_START and set loading to true', () => {
    const action = {
      type: cartActionTypes.FETCH_CART_START,
    };
    const expectedState = {
      ...initialState,
      loading: true,
      toCart: false,
    };
    expect(cartReducer(initialState, action)).toEqual(expectedState);
  });

  // CART-003: Fetch Cart Success - Empty Cart
  it('should handle FETCH_CART_SUCCESS with empty cart', () => {
    const action = {
      type: cartActionTypes.FETCH_CART_SUCCESS,
      cart: {
        products: [],
        totalPrice: 0,
      },
    };
    const expectedState = {
      ...initialState,
      products: [],
      totalPrice: 0,
      loading: false,
    };
    expect(cartReducer(initialState, action)).toEqual(expectedState);
  });

  // CART-004: Fetch Cart Success - With Items
  it('should handle FETCH_CART_SUCCESS with items', () => {
    const mockProducts = [
      { productId: { _id: '1' }, price: 10, quantity: 2 },
      { productId: { _id: '2' }, price: 20, quantity: 1 },
    ];
    const action = {
      type: cartActionTypes.FETCH_CART_SUCCESS,
      cart: {
        products: mockProducts,
        totalPrice: 40,
      },
    };
    const expectedState = {
      ...initialState,
      products: mockProducts,
      totalPrice: 40,
      loading: false,
    };
    expect(cartReducer(initialState, action)).toEqual(expectedState);
  });

  // CART-005: Fetch Cart Fail
  it('should handle FETCH_CART_FAIL and set error', () => {
    const action = {
      type: cartActionTypes.FETCH_CART_FAIL,
      error: 'Network error',
    };
    const expectedState = {
      ...initialState,
      loading: false,
      error: 'Network error',
    };
    expect(cartReducer(initialState, action)).toEqual(expectedState);
  });

  // CART-006: Add Product to Cart Start
  it('should handle ADD_PRODUCT_TO_CART_START and set loading to true', () => {
    const action = {
      type: cartActionTypes.ADD_PRODUCT_TO_CART_START,
    };
    const expectedState = {
      ...initialState,
      loading: true,
    };
    expect(cartReducer(initialState, action)).toEqual(expectedState);
  });

  // CART-007: Add Product to Cart Success
  it('should handle ADD_PRODUCT_TO_CART_SUCCESS', () => {
    const mockProducts = [
      { productId: { _id: '1' }, price: 10, quantity: 1 },
    ];
    const action = {
      type: cartActionTypes.ADD_PRODUCT_TO_CART_SUCCESS,
      products: mockProducts,
    };
    const expectedState = {
      ...initialState,
      products: mockProducts,
      loading: false,
    };
    expect(cartReducer(initialState, action)).toEqual(expectedState);
  });

  // CART-008: Add Product to Cart Fail
  it('should handle ADD_PRODUCT_TO_CART_FAIL and set error', () => {
    const action = {
      type: cartActionTypes.ADD_PRODUCT_TO_CART_FAIL,
      error: 'Failed to add product',
    };
    const expectedState = {
      ...initialState,
      loading: false,
      error: 'Failed to add product',
    };
    expect(cartReducer(initialState, action)).toEqual(expectedState);
  });

  // CART-009: Remove Product from Cart Start
  it('should handle REMOVE_PRODUCT_FROM_CART_START and set loading to true', () => {
    const action = {
      type: cartActionTypes.REMOVE_PRODUCT_FROM_CART_START,
    };
    const expectedState = {
      ...initialState,
      loading: true,
    };
    expect(cartReducer(initialState, action)).toEqual(expectedState);
  });

  // CART-010: Remove Product from Cart Success - Items Remain
  it('should handle REMOVE_PRODUCT_FROM_CART_SUCCESS with remaining items', () => {
    const stateWithMultipleItems = {
      ...initialState,
      products: [
        { productId: { _id: '1' }, price: 10, quantity: 2 },
        { productId: { _id: '2' }, price: 20, quantity: 1 },
      ],
      totalPrice: 40,
    };
    const action = {
      type: cartActionTypes.REMOVE_PRODUCT_FROM_CART_SUCCESS,
      productId: '1',
    };
    const result = cartReducer(stateWithMultipleItems, action);
    
    expect(result.products.length).toBe(1);
    expect(result.products[0].productId._id).toBe('2');
    expect(result.totalPrice).toBe(20); // 40 - (10 * 2)
    expect(result.loading).toBe(false);
  });

  // CART-011: Remove Product from Cart Success - Last Item
  it('should handle REMOVE_PRODUCT_FROM_CART_SUCCESS removing last item', () => {
    const stateWithOneItem = {
      ...initialState,
      products: [
        { productId: { _id: '1' }, price: 10, quantity: 1 },
      ],
      totalPrice: 10,
    };
    const action = {
      type: cartActionTypes.REMOVE_PRODUCT_FROM_CART_SUCCESS,
      productId: '1',
    };
    const result = cartReducer(stateWithOneItem, action);
    
    expect(result.products.length).toBe(0);
    expect(result.totalPrice).toBe(0);
    expect(result.loading).toBe(false);
  });

  // CART-012: Remove Product from Cart Fail
  it('should handle REMOVE_PRODUCT_FROM_CART_FAIL and set error', () => {
    const action = {
      type: cartActionTypes.REMOVE_PRODUCT_FROM_CART_FAIL,
      error: 'Failed to remove product',
    };
    const expectedState = {
      ...initialState,
      loading: false,
      error: 'Failed to remove product',
    };
    expect(cartReducer(initialState, action)).toEqual(expectedState);
  });

  // Additional Test: Complete Cart Flow
  it('should handle complete cart lifecycle', () => {
    let state = initialState;

    // Start fetching cart
    state = cartReducer(state, { type: cartActionTypes.FETCH_CART_START });
    expect(state.loading).toBe(true);

    // Fetch success with empty cart
    state = cartReducer(state, {
      type: cartActionTypes.FETCH_CART_SUCCESS,
      cart: { products: [], totalPrice: 0 },
    });
    expect(state.products.length).toBe(0);

    // Add product
    state = cartReducer(state, { type: cartActionTypes.ADD_PRODUCT_TO_CART_START });
    state = cartReducer(state, {
      type: cartActionTypes.ADD_PRODUCT_TO_CART_SUCCESS,
      products: [{ productId: { _id: '1' }, price: 50, quantity: 1 }],
    });
    expect(state.products.length).toBe(1);

    // Remove product
    state = cartReducer(state, { type: cartActionTypes.REMOVE_PRODUCT_FROM_CART_START });
    state = cartReducer(state, {
      type: cartActionTypes.REMOVE_PRODUCT_FROM_CART_SUCCESS,
      productId: '1',
    });
    expect(state.products.length).toBe(0);
  });
});
