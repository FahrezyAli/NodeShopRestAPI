import orderReducer from './orderReducer';
import * as orderActionTypes from '../actions/orderActionTypes';

describe('orderReducer', () => {
  const initialState = {
    orders: [],
    loading: false,
    error: false,
  };

  // ORDER-001: Initial State
  it('should return the initial state', () => {
    expect(orderReducer(undefined, {})).toEqual(initialState);
  });

  // ORDER-002: Fetch Orders Start
  it('should handle FETCH_ORDERS_START and set loading to true', () => {
    const action = {
      type: orderActionTypes.FETCH_ORDERS_START,
    };
    const expectedState = {
      ...initialState,
      loading: true,
    };
    expect(orderReducer(initialState, action)).toEqual(expectedState);
  });

  // ORDER-003: Fetch Orders Success - No Orders
  it('should handle FETCH_ORDERS_SUCCESS with empty orders', () => {
    const action = {
      type: orderActionTypes.FETCH_ORDERS_SUCCESS,
      orders: [],
    };
    const expectedState = {
      ...initialState,
      orders: [],
      loading: false,
    };
    expect(orderReducer(initialState, action)).toEqual(expectedState);
  });

  // ORDER-004: Fetch Orders Success - With Orders
  it('should handle FETCH_ORDERS_SUCCESS with orders', () => {
    const mockOrders = [
      {
        id: '1',
        products: [{ id: 'p1', name: 'Product 1' }],
        totalPrice: 100,
        date: '2025-01-01',
      },
      {
        id: '2',
        products: [{ id: 'p2', name: 'Product 2' }],
        totalPrice: 200,
        date: '2025-01-02',
      },
    ];
    const action = {
      type: orderActionTypes.FETCH_ORDERS_SUCCESS,
      orders: mockOrders,
    };
    const expectedState = {
      ...initialState,
      orders: mockOrders,
      loading: false,
    };
    expect(orderReducer(initialState, action)).toEqual(expectedState);
  });

  // ORDER-005: Fetch Orders Fail
  it('should handle FETCH_ORDERS_FAIL and set error', () => {
    const action = {
      type: orderActionTypes.FETCH_ORDERS_FAIL,
      error: 'Failed to fetch orders',
    };
    const expectedState = {
      ...initialState,
      loading: false,
      error: 'Failed to fetch orders',
    };
    expect(orderReducer(initialState, action)).toEqual(expectedState);
  });

  // Additional Test: Multiple Fetch Cycles
  it('should handle multiple fetch cycles correctly', () => {
    let state = initialState;

    // First fetch - success
    state = orderReducer(state, { type: orderActionTypes.FETCH_ORDERS_START });
    expect(state.loading).toBe(true);

    state = orderReducer(state, {
      type: orderActionTypes.FETCH_ORDERS_SUCCESS,
      orders: [{ id: '1', totalPrice: 100 }],
    });
    expect(state.orders.length).toBe(1);
    expect(state.loading).toBe(false);

    // Second fetch - new orders
    state = orderReducer(state, { type: orderActionTypes.FETCH_ORDERS_START });
    state = orderReducer(state, {
      type: orderActionTypes.FETCH_ORDERS_SUCCESS,
      orders: [
        { id: '1', totalPrice: 100 },
        { id: '2', totalPrice: 200 },
      ],
    });
    expect(state.orders.length).toBe(2);
  });

  // Additional Test: Error Recovery
  it('should handle error recovery correctly', () => {
    let state = initialState;

    // Fetch fails
    state = orderReducer(state, { type: orderActionTypes.FETCH_ORDERS_START });
    state = orderReducer(state, {
      type: orderActionTypes.FETCH_ORDERS_FAIL,
      error: 'Network error',
    });
    expect(state.error).toBe('Network error');
    expect(state.loading).toBe(false);

    // Retry and succeed
    state = orderReducer(state, { type: orderActionTypes.FETCH_ORDERS_START });
    expect(state.loading).toBe(true);
    
    state = orderReducer(state, {
      type: orderActionTypes.FETCH_ORDERS_SUCCESS,
      orders: [{ id: '1', totalPrice: 150 }],
    });
    expect(state.orders.length).toBe(1);
    expect(state.loading).toBe(false);
  });

  // Additional Test: Loading State During Fetch
  it('should maintain loading state until fetch completes', () => {
    let state = initialState;

    state = orderReducer(state, { type: orderActionTypes.FETCH_ORDERS_START });
    expect(state.loading).toBe(true);
    expect(state.orders).toEqual([]);

    // Loading should remain true until success or fail
    expect(state.loading).toBe(true);
  });

  // Additional Test: Orders Replacement
  it('should replace orders on new fetch success', () => {
    const stateWithOrders = {
      ...initialState,
      orders: [{ id: '1', totalPrice: 100 }],
    };

    const newOrders = [
      { id: '2', totalPrice: 200 },
      { id: '3', totalPrice: 300 },
    ];

    const action = {
      type: orderActionTypes.FETCH_ORDERS_SUCCESS,
      orders: newOrders,
    };

    const result = orderReducer(stateWithOrders, action);
    expect(result.orders).toEqual(newOrders);
    expect(result.orders.length).toBe(2);
  });
});
