import authReducer from './authReducer';
import * as authActionTypes from '../actions/authActionTypes';

describe('authReducer', () => {
  const initialState = {
    token: 'dummy',
    userId: null,
    error: null,
    loading: false,
    email: null,
  };

  // AUTH-001: Initial State
  it('should return the initial state', () => {
    expect(authReducer(undefined, {})).toEqual(initialState);
  });

  // AUTH-002: Auth Start Transition
  it('should handle AUTH_START and set loading to true', () => {
    const action = {
      type: authActionTypes.AUTH_START,
    };
    const expectedState = {
      ...initialState,
      loading: true,
      error: null,
    };
    expect(authReducer(initialState, action)).toEqual(expectedState);
  });

  // AUTH-003: Auth Success Transition
  it('should handle AUTH_SUCCESS and store auth data', () => {
    const action = {
      type: authActionTypes.AUTH_SUCCESS,
      token: 'test-token-123',
      userId: 'user-123',
      email: 'test@example.com',
    };
    const expectedState = {
      ...initialState,
      token: 'test-token-123',
      userId: 'user-123',
      email: 'test@example.com',
      loading: false,
      error: null,
    };
    expect(authReducer(initialState, action)).toEqual(expectedState);
  });

  // AUTH-004: Auth Fail Transition
  it('should handle AUTH_FAIL and set error', () => {
    const action = {
      type: authActionTypes.AUTH_FAIL,
      error: 'Invalid credentials',
    };
    const expectedState = {
      ...initialState,
      error: 'Invalid credentials',
      loading: false,
    };
    expect(authReducer(initialState, action)).toEqual(expectedState);
  });

  // AUTH-005: Auth Logout Transition
  it('should handle AUTH_LOGOUT and clear auth data', () => {
    const authenticatedState = {
      token: 'test-token-123',
      userId: 'user-123',
      email: 'test@example.com',
      loading: false,
      error: null,
    };
    const action = {
      type: authActionTypes.AUTH_LOGOUT,
    };
    const expectedState = {
      ...authenticatedState,
      token: null,
      userId: null,
      email: null,
    };
    expect(authReducer(authenticatedState, action)).toEqual(expectedState);
  });

  // Additional Test: Auth Start from Error State
  it('should handle AUTH_START from error state and clear error', () => {
    const errorState = {
      ...initialState,
      error: 'Previous error',
    };
    const action = {
      type: authActionTypes.AUTH_START,
    };
    const expectedState = {
      ...errorState,
      loading: true,
      error: null,
    };
    expect(authReducer(errorState, action)).toEqual(expectedState);
  });

  // Additional Test: Multiple Auth Cycles
  it('should handle multiple auth cycles correctly', () => {
    let state = initialState;

    // Start auth
    state = authReducer(state, { type: authActionTypes.AUTH_START });
    expect(state.loading).toBe(true);

    // Auth success
    state = authReducer(state, {
      type: authActionTypes.AUTH_SUCCESS,
      token: 'token1',
      userId: 'user1',
      email: 'user1@test.com',
    });
    expect(state.token).toBe('token1');
    expect(state.loading).toBe(false);

    // Logout
    state = authReducer(state, { type: authActionTypes.AUTH_LOGOUT });
    expect(state.token).toBe(null);

    // Start auth again
    state = authReducer(state, { type: authActionTypes.AUTH_START });
    expect(state.loading).toBe(true);

    // Auth fail
    state = authReducer(state, {
      type: authActionTypes.AUTH_FAIL,
      error: 'Network error',
    });
    expect(state.error).toBe('Network error');
    expect(state.loading).toBe(false);
  });
});
