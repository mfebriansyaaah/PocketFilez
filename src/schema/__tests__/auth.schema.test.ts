import { LoginSchema, RegisterSchema } from '../auth.schema';

describe('auth.schema', () => {
  describe('LoginSchema', () => {
    test('should validate correct login data', () => {
      const data = {
        email: 'test@example.com',
        password: 'password123',
      };
      const result = LoginSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    test('should reject invalid email', () => {
      const data = {
        email: 'invalid-email',
        password: 'password123',
      };
      const result = LoginSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Email tidak valid');
      }
    });

    test('should reject empty email', () => {
      const data = {
        email: '',
        password: 'password123',
      };
      const result = LoginSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Email wajib diisi');
      }
    });

    test('should reject short password', () => {
      const data = {
        email: 'test@example.com',
        password: '123',
      };
      const result = LoginSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Password minimal 6 karakter');
      }
    });
  });

  describe('RegisterSchema', () => {
    test('should validate correct registration data', () => {
      const data = {
        name: 'John Doe',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      };
      const result = RegisterSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    test('should reject short name', () => {
      const data = {
        name: 'J',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      };
      const result = RegisterSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Nama minimal 2 karakter');
      }
    });

    test('should reject mismatched passwords', () => {
      const data = {
        name: 'John Doe',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'differentPassword',
      };
      const result = RegisterSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        const passwordError = result.error.issues.find(i => i.path.includes('confirmPassword'));
        expect(passwordError?.message).toBe('Password tidak cocok');
      }
    });
  });
});
