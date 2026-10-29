const Notification = require('../models/Notification');

describe('Notification Model Enum Tests (H2, F12)', () => {
  test('should include all required notification types in schema enum', () => {
    const typeEnum = Notification.schema.path('type').enumValues;

    const expectedTypes = [
      'session_request',
      'session_status_update',
      'session_reminder',
      'session_confirmed',
      'session_cancelled',
      'session_completed',
      'message_received',
      'payment_received',
      'payment_success',
      'review_received',
      'profile_approved',
      'system_update'
    ];

    expectedTypes.forEach(type => {
      expect(typeEnum).toContain(type);
    });
  });

  test('should reject invalid notification type', () => {
    const notification = new Notification({
      recipient: '507f1f77bcf86cd799439011',
      title: 'Invalid type test',
      message: 'This should fail validation',
      type: 'invalid_non_existent_type'
    });

    const error = notification.validateSync();
    expect(error).toBeDefined();
    expect(error.errors['type']).toBeDefined();
  });
});

