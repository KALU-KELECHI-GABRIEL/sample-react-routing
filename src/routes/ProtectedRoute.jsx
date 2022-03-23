import React from 'react';
import { Route, Redirect as Navigate } from 'react-router-dom';
import Auth from './Auth';
import Protected from '../layouts/Protected';
import { clearStore } from './Store';

export const ProtectedRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props => {
        if (Auth.isAuthenticated()) {
          console.log('The auth route location', props.location.pathname);
          if (props.location.pathname === '/logout') {
            console.log('Hi..... Logout function is called.....');
            clearStore();
            return (
              <Navigate
                to={{
                  pathname: '/',
                  state: {
                    from: props.location,
                  },
                }}
              />
            );
          }
          return (
            <Protected>
              <Component {...props} />
            </Protected>
          );
        } else {
          return (
            <Navigate
              to={{
                pathname: '/login',
                state: {
                  from: props.location,
                },
              }}
            />
          );
        }
      }}
    />
  );
};
