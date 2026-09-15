import { useAppStore } from '../useStore';

describe('useAppStore', () => {
  test('should have initial state', () => {
    const state = useAppStore.getState();
    expect(state.isLoggedIn).toBe(false);
    expect(state.user).toBe(null);
  });

  test('should set login status', () => {
    useAppStore.getState().setLoggedIn(true);
    expect(useAppStore.getState().isLoggedIn).toBe(true);
    
    useAppStore.getState().setLoggedIn(false);
    expect(useAppStore.getState().isLoggedIn).toBe(false);
  });

  test('should set user data', () => {
    const mockUser = { name: 'John Doe', email: 'john@example.com' };
    useAppStore.getState().setUser(mockUser);
    expect(useAppStore.getState().user).toEqual(mockUser);
    
    useAppStore.getState().setUser(null);
    expect(useAppStore.getState().user).toBe(null);
  });
});
