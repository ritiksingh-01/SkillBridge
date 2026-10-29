const express = require('express');
const Notification = require('../models/Notification');
const Session = require('../models/Session');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/notifications/unread-count
// @desc    Get count of unread notifications (F6)
// @access  Private
router.get('/unread-count', auth, async (req, res) => {
  try {
    const unreadCount = await Notification.countDocuments({
      recipient: req.user.id,
      isRead: false
    });
    res.json({ unreadCount });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/notifications
// @desc    Get user notifications
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20, isRead, type } = req.query;

    const safeLimit = Math.min(Math.max(1, parseInt(limit) || 20), 100);
    const safePage = Math.max(1, parseInt(page) || 1);

    const query = { recipient: req.user.id };

    if (isRead !== undefined) {
      query.isRead = isRead === 'true';
    }

    if (type) {
      query.type = type;
    }

    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find(query)
        .populate('sender', 'firstName lastName profileImage')
        .limit(safeLimit)
        .skip((safePage - 1) * safeLimit)
        .sort({ createdAt: -1 })
        .lean(),
      Notification.countDocuments(query),
      Notification.countDocuments({
        recipient: req.user.id,
        isRead: false
      })
    ]);

    res.json({
      notifications,
      unreadCount,
      pagination: {
        current: safePage,
        pages: Math.ceil(total / safeLimit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/notifications/:id/read
// @desc    Mark notification as read
// @access  Private
router.put('/:id/read', auth, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    if (notification.recipient.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    notification.isRead = true;
    notification.readAt = new Date();
    await notification.save();

    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/notifications/mark-all-read
// @desc    Mark all notifications as read
// @access  Private
router.put('/mark-all-read', auth, async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user.id, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/notifications/:id
// @desc    Delete notification
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    if (notification.recipient.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await Notification.findByIdAndDelete(req.params.id);
    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/notifications
// @desc    Create a new notification (restricted to shared session or self - H10)
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { recipient, type, title, message, data = {} } = req.body;

    if (!recipient || !type || !title || !message) {
      return res.status(400).json({
        message: 'Recipient, type, title, and message are required'
      });
    }

    // Verify authorized relation between sender and recipient (prevent spoofing/phishing H10)
    if (recipient.toString() !== req.user.id) {
      // Must share a session
      const sharedSession = await Session.findOne({
        $or: [
          { mentee: req.user.id },
          { mentee: recipient }
        ]
      });
      if (!sharedSession && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to send notifications to this user' });
      }
    }

    const notification = new Notification({
      recipient,
      sender: req.user.id,
      type,
      title,
      message,
      data
    });

    await notification.save();

    const populatedNotification = await Notification.findById(notification._id)
      .populate('sender', 'firstName lastName profileImage');

    const io = req.app.get('io');
    if (io) {
      io.to(recipient.toString()).emit('new-notification', populatedNotification);
    }

    res.status(201).json({
      message: 'Notification created successfully',
      notification: populatedNotification
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error creating notification' });
  }
});

// Helper function to create notifications from other server routes
const createNotification = async (recipient, sender, type, title, message, data = {}) => {
  try {
    const notification = new Notification({
      recipient,
      sender,
      type,
      title,
      message,
      data
    });

    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error.message);
    return null;
  }
};

module.exports = { router, createNotification };
