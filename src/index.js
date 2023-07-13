import React, { useContext, useEffect } from 'react';
import ReactDOM from 'react-dom';
import 'assets/css/App.css';
import {
  HashRouter, Route, Switch, Redirect, useHistory, BrowserRouter
} from 'react-router-dom';
import AuthLayout from 'layouts/auth';
import AdminLayout from 'layouts/admin';
import { ChakraProvider } from '@chakra-ui/react';
import theme from 'theme/theme';
import { ThemeEditorProvider } from '@hypertheme-editor/chakra-ui';
import { AuthProvider } from 'contexts/auth/auth.provider';
import { AuthContext } from 'contexts/auth/auth.context';
import 'react-toastify/dist/ReactToastify.css';
import './i18n';
import routes from 'routes';
// const checkAccess = () => (true);
// const accessRole = roleModule.map((item) => (routes.filter((r) => r.typeofNumber == item.moduleId)));
// if (accessRole && accessRole.length) {
//   return true;
// }
// return true;
// tani qitu e bana kushtin nese qiky module eshte aktive me id-ne e qeti rou
// Get RoleId from localStorage
function PrivateRoute({ children, ...rest }) {
  const {
    authState: { isAuthenticated },
  } = useContext(AuthContext);

  const { location } = { ...rest };
  const modulesActive = JSON.parse(localStorage.getItem('access_role'))[0].modules;
  // const [modulesActive, setModulesAccess] = useState([]);
  // const getUserFromLocalStoragee = () => {
  //   const item = JSON.parse(localStorage.getItem('access_role'));
  //   if (item) {
  //     setModulesAccess(item[0].modules);
  //     console.log(item[0].modules, 'aaaaasss');
  //   }
  // };
  // useEffect(async () => {
  //   await getUserFromLocalStoragee();
  // }, []);

  // const checkAccess = async () => {
  //   const accessRole = await modulesActive.map((item) => (routes.filter((r) => r.typeofNumber === item.moduleId)));

  //   const filteredAccessRole = accessRole.filter((ar) => ar.length > 0);

  //   console.log(filteredAccessRole, 'ssssssaaa');
  //   if (filteredAccessRole && filteredAccessRole.length) {
  //     return filteredAccessRole[0][0].path;
  //   }
  //   return false;
  // };

  const checkAccess = () => {
    if (location.pathname === '/admin' && isAuthenticated) {
      return true;
    }

    let pathName = location.pathname;
    if (location.pathname.includes('/admin')) {
      pathName = location.pathname.replace('/admin', '');
    }

    const accessRole = modulesActive.map((item) => routes.filter((r) => r.typeofNumber === item.moduleId));
    const filteredAccessRole = accessRole.filter((ar) => ar.length > 0);

    if (filteredAccessRole.length) {
      const pathArray = filteredAccessRole.map((ar) => ar[0].path);
      if (pathArray.includes(pathName)) {
        return true;
      }
    }

    return false;
  };

  if (!checkAccess()) {
    return (
      <Redirect
        to={{
          pathname: '/admin/default',
          state: { from: location },
        }}
      />
    );
  }
  return (
    <Route
      {...rest}
      render={({ location }) => (isAuthenticated ? (
        children
      ) : (
        <Redirect
          to={{
            pathname: '/auth',
            state: { from: location },
          }}
        />
      ))}
    />

  );
}

const App = () => {
  const {
    authDispatch,
  } = useContext(AuthContext);
  const history = useHistory();

  useEffect(() => {
    if (!history || !authDispatch) return;
    const restoreToken = () => {
      const token = localStorage.getItem('access_token');

      if (token) {
        authDispatch({ type: 'RESTORE_TOKEN', token });
        history.push('/admin/default');
      }
    };
    restoreToken();
  }, [authDispatch, history]);

  return (
    <Switch>
      <PrivateRoute path="/admin">
        <AdminLayout />
      </PrivateRoute>
      <Route path="/auth" component={AuthLayout} />
      <Redirect from="/" to="/auth" />
    </Switch>
  );
};

ReactDOM.render(
  <ChakraProvider theme={theme}>
    <React.StrictMode>
      <AuthProvider>
        <ThemeEditorProvider>
          <BrowserRouter basename="/index.html">
            <HashRouter>
              <App />
            </HashRouter>
          </BrowserRouter>
        </ThemeEditorProvider>
      </AuthProvider>
    </React.StrictMode>
  </ChakraProvider>,
  document.getElementById('root')
);
