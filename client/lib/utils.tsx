import { useFormikContext } from 'formik';
import produce from 'immer';
import { isFunction, omit } from 'lodash';
import { compile } from 'path-to-regexp';
import React, { useState } from 'react';
import { NavLink as RouterNavLink, Route } from 'react-router-dom';
import Select from 'react-select';
import useSWROriginal from 'swr';
import { roles } from '../../lib/sharedUtils';
import Context from './context';

export * from '../../lib/sharedUtils';
export { Context };

export const useContext: any = () => React.useContext(Context);

export const FormContext: any = React.createContext(null);

export const FormWrapper = ({ apiErrors, setApiErrors, children }) => (
  <FormContext.Provider value={{ apiErrors, setApiErrors }}>{children}</FormContext.Provider>
);

export const ErrorMessage = ({ name }) => {
  const { apiErrors } = React.useContext(FormContext);
  const error = apiErrors[name];
  return error ? <div className="error">{error}</div> : null;
};

export const Field = props => {
  const { apiErrors, setApiErrors } = React.useContext(FormContext);
  const { values, handleBlur: onBlur, handleChange }: any = useFormikContext();
  const value = values[props.name];
  const { as, children, ...restProps } = props;
  const asElement = as || 'input';
  const onChange = e => {
    setApiErrors(omit(apiErrors, e.target.name));
    handleChange(e);
  };

  return React.createElement(asElement, { ...restProps, onChange, onBlur, value }, children);
};

export const MultiSelect = ({ name, defaultValue, options }) => {
  const { setFieldValue } = useFormikContext();
  return (
    <Select
      defaultValue={defaultValue}
      onChange={values => setFieldValue(name, values?.map(option => option.value) || [], false)}
      options={options}
      isMulti
    />
  );
};

export const SubmitBtn = ({ children, ...props }) => {
  const { isSubmitting } = useFormikContext();
  return (
    <button type="submit" disabled={isSubmitting} {...props}>
      {children}
    </button>
  );
};

export const userRolesToIcons = {
  [roles.admin]: 'fa fa-star',
  [roles.user]: 'fa fa-fire',
  [roles.guest]: 'fa fa-ghost',
};

export function makeUrlFor<T>(rawRoutes: T) {
  const routes = Object.keys(rawRoutes).reduce(
    (acc, name) => ({ ...acc, [name]: compile(rawRoutes[name]) }),
    {} as any
  );

  return (name: keyof T, args = {}, opts = {}) => {
    const toPath = routes[name];
    return toPath(args, opts);
  };
}

export const NavLink = ({ ...restProps }) => (
  <RouterNavLink
    className="app__nav-link"
    activeClassName="app__nav-link app__nav-link_active"
    {...restProps}
  />
);

export const useImmerState = initialState => {
  const [state, setState] = useState(initialState);

  const setImmerState = React.useRef(fnOrObject => {
    if (isFunction(fnOrObject)) {
      const fn = fnOrObject;
      setState(curState => produce(curState, fn));
    } else {
      const newState = fnOrObject;
      setState(curState => ({ ...curState, ...newState }));
    }
  });

  return [state, setImmerState.current];
};

export const emptyObject: any = new Proxy(
  {},
  {
    get() {
      return '';
    },
  }
);

export const ProtectedRoute: any = ({ canRender, ...restProps }) =>
  canRender || canRender === 'maybe' ? <Route {...restProps} /> : '403 forbidden';

export const qb = mainRow => ({
  rowToMany(joinTable, targetTable, joinClause) {
    const [mainRowId, joinTableMainId, joinTableTargetId, targetTableId] = joinClause
      .replace(/\s/, '')
      .split(/,|=/);
    return joinTable
      .filter(row => row[joinTableMainId] === mainRow[mainRowId])
      .flatMap(row =>
        targetTable.filter(targetRow => targetRow[targetTableId] === row[joinTableTargetId])
      );
  },
  rowToOne(targetTable, joinClause) {
    const [mainRowId, targetTableId] = joinClause.replace(/\s/, '').split('=');
    return targetTable.find(targetRow => targetRow[targetTableId] === mainRow[mainRowId]);
  },
});

export const usePageSwitch = ({ pages, components, state }) => {
  const [pageState, setPageState] = useImmerState(state);
  const { page, ...restProps } = pageState;

  return {
    ...pageState,
    setPageState,
    renderPage: () => React.createElement(components[page], { ...restProps, pages, setPageState }),
  };
};

export const useSWR = (url, config = {} as any) => {
  const { isFirstRender } = useContext();
  const revalidateOnMount = !config.initialData || (config.initialData && !isFirstRender.current);
  return useSWROriginal(url, { ...config, revalidateOnMount });
};

export const dedup = fn => {
  let isRunning = false;
  return async () => {
    if (isRunning) return;
    isRunning = true;
    try {
      return await fn();
    } finally {
      isRunning = false;
    }
  };
};
