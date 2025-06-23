import { create } from 'zustand';

const useNotifications = create((set) => ({
  unread: 0,
  setUnread: (n) => set({ unread: n })
}));

export default useNotifications;
