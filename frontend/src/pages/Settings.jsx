import { useState } from 'react';
import { HiOutlineCog, HiOutlineUser, HiOutlineOfficeBuilding, HiOutlineLockClosed } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';

export default function Settings() {
  const { user, updateUser } = useAuth();
  const isVendor = user?.role === 'vendor' || user?.role === 'super_admin';

  const [activeTab, setActiveTab] = useState('profile');
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [profile, setProfile] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
  });

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: HiOutlineUser },
    { id: 'password', label: 'Password', icon: HiOutlineLockClosed },
    ...(isVendor ? [{ id: 'business', label: 'Business', icon: HiOutlineOfficeBuilding }] : []),
  ];

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      const r = await authService.updateProfile(profile);
      toast.success('Profile updated!');
      if (updateUser) updateUser(profile);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setProfileLoading(false); }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) { toast.error('Passwords do not match'); return; }
    if (passwords.newPassword.length < 8) { toast.error('Password must be 8+ characters'); return; }

    setPasswordLoading(true);
    try {
      await authService.updatePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      toast.success('Password updated!');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setPasswordLoading(false); }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account and preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tabs */}
        <div className="lg:w-56 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
              <form onSubmit={handleProfileUpdate} className="space-y-4 max-w-lg">
                <div className="grid grid-cols-2 gap-4">
                  <Input label="First Name" value={profile.firstName} onChange={e => setProfile(p => ({ ...p, firstName: e.target.value }))} required />
                  <Input label="Last Name" value={profile.lastName} onChange={e => setProfile(p => ({ ...p, lastName: e.target.value }))} required />
                </div>
                <Input label="Email" value={user?.email} disabled helperText="Email cannot be changed" />
                <Input label="Phone" value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} placeholder="+91 98765 43210" />

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-500">Role:</span>
                  <span className="text-sm font-medium capitalize">{user?.role?.replace('_', ' ')}</span>
                </div>

                <Button type="submit" loading={profileLoading}>Save Changes</Button>
              </form>
            </div>
          )}

          {/* Password Tab */}
          {activeTab === 'password' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
              <form onSubmit={handlePasswordUpdate} className="space-y-4 max-w-lg">
                <Input label="Current Password" type="password" required
                  value={passwords.currentPassword}
                  onChange={e => setPasswords(p => ({ ...p, currentPassword: e.target.value }))}
                  placeholder="Enter current password" />
                <Input label="New Password" type="password" required
                  value={passwords.newPassword}
                  onChange={e => setPasswords(p => ({ ...p, newPassword: e.target.value }))}
                  placeholder="Min 8 characters" />
                <Input label="Confirm New Password" type="password" required
                  value={passwords.confirmPassword}
                  onChange={e => setPasswords(p => ({ ...p, confirmPassword: e.target.value }))}
                  placeholder="Confirm new password" />
                <Button type="submit" loading={passwordLoading}>Update Password</Button>
              </form>
            </div>
          )}

          {/* Business Tab */}
          {activeTab === 'business' && isVendor && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Information</h3>
              <div className="space-y-4 max-w-lg">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <strong>Tenant:</strong> {user?.tenant?.name || 'Not configured'}
                  </p>
                  <p className="text-xs text-blue-500 mt-1">
                    Plan: {user?.tenant?.subscription?.plan || 'Free'}
                  </p>
                </div>

                <p className="text-sm text-gray-500">
                  Business settings like branding, payment gateways, and custom domains will be available in the next update.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}