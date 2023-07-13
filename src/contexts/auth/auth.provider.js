import React, { useReducer } from 'react';
import { AuthContext } from './auth.context';

const getCurrentUser = () => {
  const accessData = localStorage.getItem('access_data');

  if (accessData) {
    return JSON.parse(accessData);
  }

  return null;
};

export const isAuthenticated = () => {
  const currentUser = getCurrentUser();
  if (!currentUser) return false;
  if (currentUser.token) {
    return true;
  }
  return false;
};

export const getToken = () => {
  const currentUser = getCurrentUser();
  if (!currentUser) return null;

  return currentUser.token;
};

const INITIAL_STATE = {
  isAuthenticated: false,
  token: null,
  currentForm: 'auth'
};

function reducer(state, action) {
  switch (action.type) {
    case 'SIGNIN':
      return {
        ...state,
        currentForm: 'auth',
      };
    case 'SIGNIN_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        token: action.token
      };
    case 'RESTORE_TOKEN':
      return {
        ...state,
        isAuthenticated: true,
        token: action.token
      };
    case 'SIGN_OUT':
      return {
        ...state,
        isAuthenticated: false,
        token: null
      };
    case 'SIGNUP':
      return {
        ...state,
        currentForm: 'signUp',
      };
    case 'FORGOTPASS':
      return {
        ...state,
        currentForm: 'forgotPass',
      };
    default:
      return state;
  }
}

export const AuthProvider = ({ children }) => {
  const [authState, authDispatch] = useReducer(reducer, INITIAL_STATE);
  return (
    <AuthContext.Provider value={{ authState, authDispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
