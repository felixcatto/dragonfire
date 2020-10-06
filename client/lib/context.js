import React from 'react';

const Context = React.createContext(null);

export const useContext = () => React.useContext(Context);
export default Context;
