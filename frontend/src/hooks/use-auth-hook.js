import { useContext } from 'react';
import { AuthContext } from '../context/authentication';

function useAuthContext() {
  return useContext(AuthContext);
}

export default useAuthContext;
