import { createContext } from 'react';

export const AlertContext = createContext({
  error: null,
  success: null,
});