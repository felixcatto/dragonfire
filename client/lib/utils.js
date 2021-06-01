import React, { useState } from 'react';
import { NavLink as RouterNavLink, Route } from 'react-router-dom';
import { compile } from 'path-to-regexp';
import { isFunction, omit } from 'lodash';
import produce from 'immer';
import { useFormikContext, getIn } from 'formik';
import Select from 'react-select';
import { roles } from '../../lib/sharedUtils';

export * from '../../lib/sharedUtils';

export const ErrorMessage = ({ name }) => {
  const { status, touched, errors } = useFormikContext();
  const makeHtmlError = errorMsg => <div className="error">{errorMsg}</div>;
  const fieldTouched = getIn(touched, name);
  const frontendError = getIn(errors, name);
  const backendError = getIn(status, ['apiErrors', name]);
  if (frontendError && fieldTouched) {
    return makeHtmlError(frontendError);
  }

  if (backendError) {
    return makeHtmlError(backendError);
  }

  return null;
};

export const Field = props => {
  const { values, handleBlur: onBlur, handleChange, setStatus, status } = useFormikContext();
  const value = values[props.name];
  const { as, children, ...restProps } = props;
  const asElement = as || 'input';
  const onChange = e => {
    setStatus(omit(status, `apiErrors.${e.target.name}`));
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

export const userRolesToIcons = {
  [roles.admin]: 'fa fa-star',
  [roles.user]: 'fa fa-fire',
  [roles.guest]: 'fa fa-ghost',
};

export const makeUrlFor = rawRoutes => {
  const routes = Object.keys(rawRoutes).reduce(
    (acc, name) => ({ ...acc, [name]: compile(rawRoutes[name]) }),
    {}
  );

  return (name, args, opts) => {
    const toPath = routes[name];
    if (!toPath) {
      throw new Error(`Route with name ${name} is not registered`);
    }

    return toPath(args, opts);
  };
};

export const NavLink = ({ ...restProps }) => (
  <RouterNavLink
    className="app__nav-link"
    activeClassName="app__nav-link app__nav-link_active"
    {...restProps}
  />
);

export const useImmerState = initialState => {
  const [state, setState] = useState(initialState);

  const oldState = React.useRef();
  oldState.current = state;

  const setImmerState = React.useRef(fnOrObject => {
    if (isFunction(fnOrObject)) {
      const fn = fnOrObject;
      setState(produce(oldState.current, fn));
    } else {
      const newState = fnOrObject;
      setState({
        ...oldState.current,
        ...newState,
      });
    }
  });

  return [state, setImmerState.current];
};

export const emptyObject = new Proxy(
  {},
  {
    get() {
      return '';
    },
  }
);

export const ProtectedRoute = ({ canRender, ...restProps }) =>
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
