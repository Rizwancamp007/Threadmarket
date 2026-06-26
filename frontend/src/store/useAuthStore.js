import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,

      login: async (email, password) => {
        try {
          const { data } = await axios.post(import.meta.env.VITE_API_URL + '/auth/login', { email, password }, {
            withCredentials: true
          });
          set({ user: data, token: data.token });
          return data;
        } catch (error) {
          throw new Error(error.response?.data?.message || 'Login failed');
        }
      },

      logout: async () => {
        try {
          await axios.post(import.meta.env.VITE_API_URL + '/auth/logout', {}, { withCredentials: true });
        } catch (error) {
          console.error('Logout error', error);
        }
        set({ user: null, token: null });
      },
    }),
    {
      name: 'threadmarket-auth',
    }
  )
);

export default useAuthStore;
