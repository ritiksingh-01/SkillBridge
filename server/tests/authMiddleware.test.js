const jwt = require('jsonwebtoken');
const { auth, authorize } = require('../middleware/auth');
const User = require('../models/User');

jest.mock('../models/User', () => ({
  findById: jest.fn()
}));

describe('Auth Middleware Security Tests (C2, C8)', () => {
  const secret = 'test_jwt_secret_key_1234567890';
  let originalSecret;

  beforeAll(() => {
    originalSecret = process.env.JWT_SECRET;
    process.env.JWT_SECRET = secret;
  });

  afterAll(() => {
    process.env.JWT_SECRET = originalSecret;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  test('should reject request without Authorization header with 401', async () => {
    const req = { header: jest.fn().mockReturnValue(null) };
    const res = mockResponse();
    const next = jest.fn();

    await auth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringMatching(/No authentication token|authorization denied/i)
      })
    );
    expect(next).not.toHaveBeenCalled();
  });

  test('should reject forged simple_token prefix with 401 (C2 fix)', async () => {
    const req = {
      header: jest.fn().mockReturnValue('Bearer simple_token_fake_admin_12345')
    };
    const res = mockResponse();
    const next = jest.fn();

    await auth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringMatching(/invalid token/i)
      })
    );
    expect(next).not.toHaveBeenCalled();
  });

  test('should reject token signed with wrong secret with 401', async () => {
    const fakeToken = jwt.sign({ id: 'user123', role: 'mentee' }, 'wrong_secret');
    const req = {
      header: jest.fn().mockReturnValue(`Bearer ${fakeToken}`)
    };
    const res = mockResponse();
    const next = jest.fn();

    await auth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('should accept valid JWT signed with JWT_SECRET and set req.user', async () => {
    const mockUser = {
      _id: '507f1f77bcf86cd799439011',
      id: '507f1f77bcf86cd799439011',
      email: 'test@example.com',
      role: 'mentee'
    };

    User.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue(mockUser)
    });

    const validToken = jwt.sign({ id: '507f1f77bcf86cd799439011' }, secret);
    const req = {
      header: jest.fn().mockReturnValue(`Bearer ${validToken}`)
    };
    const res = mockResponse();
    const next = jest.fn();

    await auth(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toBeDefined();
    expect(req.user.id).toBe('507f1f77bcf86cd799439011');
    expect(req.user.role).toBe('mentee');
  });

  test('authorize middleware should enforce role restrictions', () => {
    const req = { user: { role: 'mentee' } };
    const res = mockResponse();
    const next = jest.fn();

    const mentorOnly = authorize('mentor');
    mentorOnly(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();

    const menteeAllowed = authorize('mentee', 'admin');
    menteeAllowed(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
