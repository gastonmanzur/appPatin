import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';

const useAuth = create((set) => ({
  token: localStorage.getItem('token'),
  user: localStorage.getItem('token') ? jwtDecode(localStorage.getItem('token')) : null,

  login: (token) => {
    localStorage.setItem('token', token);
    set({ token, user: jwtDecode(token) });
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, user: null });
  }
}));

export default useAuth;
