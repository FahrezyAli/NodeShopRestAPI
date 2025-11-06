import shopReducer from './shopReducer';
import * as shopActionTypes from '../actions/shopActionTypes';

describe('shopReducer', () => {
  const initialState = {
    products: [],
    currentPage: 1,
    loading: false,
    error: false,
    lastPage: 3,
  };

  // SHOP-001: Initial State
  it('should return the initial state', () => {
    expect(shopReducer(undefined, {})).toEqual(initialState);
  });

  // SHOP-002: Fetch Products Start
  it('should handle FETCH_PRODUCTS_START and set loading to true', () => {
    const action = {
      type: shopActionTypes.FETCH_PRODUCTS_START,
    };
    const expectedState = {
      ...initialState,
      loading: true,
    };
    expect(shopReducer(initialState, action)).toEqual(expectedState);
  });

  // SHOP-003: Fetch Products Success - First Page
  it('should handle FETCH_PRODUCTS_SUCCESS with first page', () => {
    const mockProducts = [
      { id: '1', name: 'Product 1', price: 10 },
      { id: '2', name: 'Product 2', price: 20 },
    ];
    const action = {
      type: shopActionTypes.FETCH_PRODUCTS_SUCCESS,
      products: mockProducts,
      pageNumber: 1,
    };
    const expectedState = {
      ...initialState,
      products: mockProducts,
      currentPage: 1,
      loading: false,
    };
    expect(shopReducer(initialState, action)).toEqual(expectedState);
  });

  // SHOP-004: Fetch Products Success - Next Page
  it('should handle FETCH_PRODUCTS_SUCCESS with next page', () => {
    const stateOnPage1 = {
      ...initialState,
      products: [
        { id: '1', name: 'Product 1', price: 10 },
      ],
      currentPage: 1,
    };
    const mockProductsPage2 = [
      { id: '3', name: 'Product 3', price: 30 },
      { id: '4', name: 'Product 4', price: 40 },
    ];
    const action = {
      type: shopActionTypes.FETCH_PRODUCTS_SUCCESS,
      products: mockProductsPage2,
      pageNumber: 2,
    };
    const result = shopReducer(stateOnPage1, action);
    
    expect(result.products).toEqual(mockProductsPage2);
    expect(result.currentPage).toBe(2);
    expect(result.loading).toBe(false);
  });

  // SHOP-005: Fetch Products Success - Previous Page
  it('should handle FETCH_PRODUCTS_SUCCESS with previous page', () => {
    const stateOnPage2 = {
      ...initialState,
      products: [
        { id: '3', name: 'Product 3', price: 30 },
      ],
      currentPage: 2,
    };
    const mockProductsPage1 = [
      { id: '1', name: 'Product 1', price: 10 },
      { id: '2', name: 'Product 2', price: 20 },
    ];
    const action = {
      type: shopActionTypes.FETCH_PRODUCTS_SUCCESS,
      products: mockProductsPage1,
      pageNumber: 1,
    };
    const result = shopReducer(stateOnPage2, action);
    
    expect(result.products).toEqual(mockProductsPage1);
    expect(result.currentPage).toBe(1);
    expect(result.loading).toBe(false);
  });

  // SHOP-006: Fetch Products Fail
  it('should handle FETCH_PRODUCTS_FAIL and set error', () => {
    const action = {
      type: shopActionTypes.FETCH_PRODUCTS_FAIL,
      error: 'Failed to fetch products',
    };
    const expectedState = {
      ...initialState,
      loading: false,
      error: 'Failed to fetch products',
    };
    expect(shopReducer(initialState, action)).toEqual(expectedState);
  });

  // Additional Test: Multiple Page Transitions
  it('should handle multiple page transitions correctly', () => {
    let state = initialState;

    // Fetch page 1
    state = shopReducer(state, { type: shopActionTypes.FETCH_PRODUCTS_START });
    expect(state.loading).toBe(true);

    state = shopReducer(state, {
      type: shopActionTypes.FETCH_PRODUCTS_SUCCESS,
      products: [{ id: '1' }],
      pageNumber: 1,
    });
    expect(state.currentPage).toBe(1);
    expect(state.loading).toBe(false);

    // Fetch page 2
    state = shopReducer(state, { type: shopActionTypes.FETCH_PRODUCTS_START });
    state = shopReducer(state, {
      type: shopActionTypes.FETCH_PRODUCTS_SUCCESS,
      products: [{ id: '2' }],
      pageNumber: 2,
    });
    expect(state.currentPage).toBe(2);

    // Go back to page 1
    state = shopReducer(state, { type: shopActionTypes.FETCH_PRODUCTS_START });
    state = shopReducer(state, {
      type: shopActionTypes.FETCH_PRODUCTS_SUCCESS,
      products: [{ id: '1' }],
      pageNumber: 1,
    });
    expect(state.currentPage).toBe(1);
  });

  // Additional Test: Error Recovery
  it('should handle error recovery correctly', () => {
    let state = initialState;

    // Fetch fails
    state = shopReducer(state, { type: shopActionTypes.FETCH_PRODUCTS_START });
    state = shopReducer(state, {
      type: shopActionTypes.FETCH_PRODUCTS_FAIL,
      error: 'Network error',
    });
    expect(state.error).toBe('Network error');

    // Retry and succeed
    state = shopReducer(state, { type: shopActionTypes.FETCH_PRODUCTS_START });
    state = shopReducer(state, {
      type: shopActionTypes.FETCH_PRODUCTS_SUCCESS,
      products: [{ id: '1' }],
      pageNumber: 1,
    });
    expect(state.products.length).toBe(1);
    expect(state.loading).toBe(false);
  });

  // Additional Test: Empty Products
  it('should handle empty products response', () => {
    const action = {
      type: shopActionTypes.FETCH_PRODUCTS_SUCCESS,
      products: [],
      pageNumber: 1,
    };
    const result = shopReducer(initialState, action);
    
    expect(result.products).toEqual([]);
    expect(result.currentPage).toBe(1);
    expect(result.loading).toBe(false);
  });
});
