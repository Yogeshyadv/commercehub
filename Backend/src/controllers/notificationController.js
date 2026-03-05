const Notification = require('../models/Notification');

exports.getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20);
    
    const unreadCount = await Notification.countDocuments({ 
      recipient: req.user._id, 
      read: false 
    });

    res.status(200).json({ 
      success: true, 
      data: notifications, 
      unreadCount 
    });
  } catch (error) {
    console.error('Get Notifications Error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOne({ 
      _id: req.params.id, 
      recipient: req.user._id 
    });

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    notification.read = true;
    await notification.save();

    res.status(200).json({ success: true, data: notification });
  } catch (error) {
    console.error('Mark Read Error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.markAllRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, read: false },
      { $set: { read: true } }
    );
    res.status(200).json({ success: true, message: 'All marked as read' });
  } catch (error) {
    console.error('Mark All Read Error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.clearAll = async (req, res) => {
  try {
    await Notification.deleteMany({ recipient: req.user._id });
    res.status(200).json({ success: true, message: 'All notifications cleared' });
  } catch (error) {
    console.error('Clear All Error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Internal helper for usage in other controllers
exports.createNotificationInternal = async ({ recipient, title, message, type, relatedId, sender }) => {
  try {
    await Notification.create({
      recipient,
      sender,
      title,
      message,
      type,
      relatedId
    });
    return true;
  } catch (error) {
    console.error('Create Notification Error:', error);
    return false;
  }
};
