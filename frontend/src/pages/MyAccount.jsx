import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  User, MapPin, CreditCard, Edit2, Plus, 
  Trash2, Mail, Phone, Lock, Eye, 
  EyeOff, Shield, Building2, Palette 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '../services/authService';
import api from '../services/api';

const TextInput = ({ value, onChange, placeholder, disabled, type = 'text', ...rest }) => (
  <input
    type={type}
    value={value || ''}
    onChange={onChange}
    placeholder={placeholder}
    disabled={disabled}
    {...rest}
    className={`w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-zinc-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#DC2626] transition-colors ${
      disabled
        ? 'border-gray-100 dark:border-zinc-800 text-gray-400 cursor-not-allowed bg-gray-50 dark:bg-zinc-800'
        : 'border-gray-200 dark:border-zinc-700 hover:border-gray-300 dark:hover:border-zinc-600'
    }`}
  />
);

const SelectInput = ({ value, onChange, children }) => (
  <select
    value={value || ''}
    onChange={onChange}
    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#DC2626] transition-colors"
  >
    {children}
  </select>
);

const FIELD = ({ label, children, hint }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>
    {children}
    {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
  </div>
);

export default function MyAccount() {
  const { user, login } = useAuth(); // using login as setAuth
  const isVendor = user?.role === 'vendor' || user?.role === 'super_admin';
  const [activeTab, setActiveTab] = useState('profile');
  
  // Profile State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  // Address State
  const [addresses, setAddresses] = useState([]);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    isDefault: false
  });

  // Security State
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showPwd, setShowPwd] = useState({ current: false, new: false, confirm: false });
  const [savingPwd, setSavingPwd] = useState(false);

  // Business State (Vendor Only)
  const [business, setBusiness] = useState({
    name: '', description: '',
    businessInfo: { type: 'retailer', industry: 'general', gstin: '', description: '' },
    contactInfo: { email: '', phone: '', website: '', address: { street: '', city: '', state: '', zipCode: '', country: 'India' } },
    settings: { currency: 'INR', timezone: 'Asia/Kolkata', taxEnabled: true, defaultTaxRate: 18 },
    branding: { primaryColor: '#DC2626', secondaryColor: '#B91C1C', accentColor: '#F59E0B' },
  });
  const [savingBusiness, setSavingBusiness] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
      });
      setAddresses(user.addresses || []);
      
      // Load vendor specific data if needed
      if (isVendor) {
        api.get('/vendor/profile').then(r => {
          const t = r.data?.data;
          if (!t) return;
          setBusiness({
            name: t.name || '',
            description: t.description || '',
            businessInfo: { 
              type: t.businessInfo?.type || 'retailer', 
              industry: t.businessInfo?.industry || 'general', 
              gstin: t.businessInfo?.gstin || '', 
              description: t.businessInfo?.description || '' 
            },
            contactInfo: {
              email: t.contactInfo?.email || '',
              phone: t.contactInfo?.phone || '',
              website: t.contactInfo?.website || '',
              address: { 
                street: t.contactInfo?.address?.street || '', 
                city: t.contactInfo?.address?.city || '', 
                state: t.contactInfo?.address?.state || '', 
                zipCode: t.contactInfo?.address?.zipCode || '', 
                country: t.contactInfo?.address?.country || 'India' 
              },
            },
            settings: { 
              currency: t.settings?.currency || 'INR', 
              timezone: t.settings?.timezone || 'Asia/Kolkata', 
              taxEnabled: t.settings?.taxEnabled !== false, 
              defaultTaxRate: t.settings?.defaultTaxRate || 18 
            },
            branding: { 
              primaryColor: t.branding?.primaryColor || '#DC2626', 
              secondaryColor: t.branding?.secondaryColor || '#B91C1C', 
              accentColor: t.branding?.accentColor || '#F59E0B' 
            },
          });
        }).catch(() => {});
      }
    }
  }, [user, isVendor]);

  // Handlers
  const handleProfileSave = async () => {
    try {
      const updatedUser = await authService.updateProfile(profileData);
      if (updatedUser.success) {
           toast.success('Profile updated successfully');
           window.location.reload(); 
      }
      setIsEditingProfile(false);
    } catch (error) {
      console.error(error);
      toast.error('Failed to update profile');
    }
  };

  const handleAddAddress = async () => {
    try {
        if (!newAddress.street || !newAddress.city || !newAddress.state || !newAddress.postalCode) {
            toast.error('Please fill all required fields');
            return;
        }
        const updatedAddresses = [...addresses, newAddress];
        const res = await authService.updateProfile({ addresses: updatedAddresses });
        if (res.success) {
             toast.success('Address added successfully');
             setAddresses(res.data.addresses || []);
             setIsAddingAddress(false);
             setNewAddress({ street: '', city: '', state: '', postalCode: '', country: 'India', isDefault: false });
        }
    } catch (error) {
        toast.error('Failed to add address');
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    try {
        const updatedAddresses = addresses.filter(addr => addr._id !== addressId);
        const res = await authService.updateProfile({ addresses: updatedAddresses });
        if (res.success) {
            setAddresses(res.data.addresses || []);
            toast.success('Address deleted successfully');
        }
    } catch (error) {
        toast.error('Failed to delete address');
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) { toast.error('Passwords do not match'); return; }
    if (passwords.newPassword.length < 8) { toast.error('Password must be at least 8 characters'); return; }
    setSavingPwd(true);
    try {
      await authService.updatePassword({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword });
      toast.success('Password updated!');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to update password'); }
    finally { setSavingPwd(false); }
  };

  const handleBusinessSave = async (e) => {
    e.preventDefault();
    setSavingBusiness(true);
    try {
      await api.put('/vendor/profile', business);
      toast.success('Business settings saved!');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save settings'); }
    finally { setSavingBusiness(false); }
  };


  const tabs = [
    { id: 'profile', label: 'Profile Settings', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'addresses', label: 'Saved Addresses', icon: MapPin },
    { id: 'payment', label: 'Payment Methods', icon: CreditCard },
    ...(isVendor ? [
      { id: 'business', label: 'Business Settings', icon: Building2 },
      { id: 'branding', label: 'Store Branding', icon: Palette },
    ] : []),
  ];

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Account</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your personal information and preferences</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 shrink-0 space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#DC2626]/10 text-[#DC2626] dark:bg-[#DC2626]/20 dark:text-[#DC2626] shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800'
                }`}
              >
                <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-[#DC2626] dark:text-[#DC2626]' : 'text-gray-400'}`} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 lg:p-8">
              
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Personal Information</h2>
                    {!isEditingProfile ? (
                      <button 
                        onClick={() => setIsEditingProfile(true)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#DC2626] bg-[#DC2626]/10 rounded-lg hover:bg-[#DC2626]/20 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" /> Edit Profile
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setIsEditingProfile(false)}
                          className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={handleProfileSave}
                          className="px-4 py-2 text-sm font-medium text-white bg-[#DC2626] rounded-lg hover:bg-[#B91C1C]"
                        >
                          Save Changes
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">First Name</label>
                      <TextInput
                        disabled={!isEditingProfile}
                        value={profileData.firstName}
                        onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Last Name</label>
                      <TextInput
                        disabled={!isEditingProfile}
                        value={profileData.lastName}
                        onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="email"
                          disabled
                          value={profileData.email}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                        />
                      </div>
                      <p className="text-xs text-gray-500">Email cannot be changed securely.</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
                      <div className="relative">
                         <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="tel"
                          disabled={!isEditingProfile}
                          value={profileData.phone}
                          onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <form onSubmit={handlePasswordSave} className="space-y-6">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Change Password</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Update your password to keep your account secure.</p>
                    </div>
                    <div className="max-w-md space-y-4">
                        {[
                          { key: 'currentPassword', label: 'Current Password', placeholder: 'Enter current password' },
                          { key: 'newPassword', label: 'New Password', placeholder: 'New password (min 8 chars)' },
                          { key: 'confirmPassword', label: 'Confirm New Password', placeholder: 'Repeat new password' },
                        ].map(field => (
                          <div key={field.key}>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{field.label}</label>
                              <div className="relative">
                                  <input
                                      type={showPwd[field.key] ? 'text' : 'password'}
                                      value={passwords[field.key]}
                                      onChange={e => setPasswords({...passwords, [field.key]: e.target.value})}
                                      placeholder={field.placeholder}
                                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-[#DC2626] focus:border-[#DC2626] dark:text-white"
                                  />
                                  <button
                                      type="button"
                                      onClick={() => setShowPwd({...showPwd, [field.key]: !showPwd[field.key]})}
                                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                  >
                                      {showPwd[field.key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                  </button>
                              </div>
                          </div>
                        ))}
                        <button type="submit" disabled={savingPwd} className="mt-4 px-6 py-2.5 bg-[#DC2626] text-white font-medium rounded-xl hover:bg-[#B91C1C] transition-colors disabled:opacity-70 flex items-center gap-2">
                             <Shield className="w-4 h-4" />
                             {savingPwd ? 'Updating...' : 'Update Password'}
                        </button>
                    </div>
                </form>
              )}

              {/* Addresses Tab */}
              {activeTab === 'addresses' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Saved Addresses</h2>
                    {!isAddingAddress && (
                        <button onClick={() => setIsAddingAddress(true)} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#DC2626] bg-[#DC2626]/10 rounded-lg hover:bg-[#DC2626]/20 transition-colors">
                            <Plus className="w-4 h-4" /> Add Address
                        </button>
                    )}
                  </div>

                  {isAddingAddress ? (
                      <div className="bg-gray-50 dark:bg-gray-900/30 p-6 rounded-xl border border-gray-200 dark:border-gray-700 mb-6">
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">New Address</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <input placeholder="Street Address" value={newAddress.street} onChange={e => setNewAddress({...newAddress, street: e.target.value})} className="col-span-2 w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white" />
                              <input placeholder="City" value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white" />
                              <input placeholder="State" value={newAddress.state} onChange={e => setNewAddress({...newAddress, state: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white" />
                              <input placeholder="Postal Code" value={newAddress.postalCode} onChange={e => setNewAddress({...newAddress, postalCode: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white" />
                          </div>
                          <div className="flex justify-end gap-3">
                              <button onClick={() => setIsAddingAddress(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg dark:text-gray-300 dark:hover:bg-gray-700">Cancel</button>
                              <button onClick={handleAddAddress} className="px-4 py-2 text-sm text-white bg-[#DC2626] hover:bg-[#B91C1C] rounded-lg">Save Address</button>
                          </div>
                      </div>
                  ) : null}

                  {addresses.length === 0 && !isAddingAddress ? (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MapPin className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">No Saved Addresses</h3>
                        <p className="text-gray-500 max-w-sm mx-auto mt-2">Add your delivery addresses to checkout faster.</p>
                    </div>
                  ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {addresses.map((addr, idx) => (
                              <div key={addr._id || idx} className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-[#DC2626] hover:shadow-sm transition-all relative group">
                                  <div className="flex items-start justify-between">
                                      <div className="flex items-start gap-3">
                                          <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                                          <div>
                                              <p className="font-medium text-gray-900 dark:text-white">{addr.street}</p>
                                              <p className="text-sm text-gray-500">{addr.city}, {addr.state} {addr.postalCode}</p>
                                              <p className="text-sm text-gray-500">{addr.country}</p>
                                          </div>
                                      </div>
                                      <button onClick={() => handleDeleteAddress(addr._id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                          <Trash2 className="w-4 h-4" />
                                      </button>
                                  </div>
                              </div>
                          ))}
                      </div>
                  )}
                </div>
              )}

              {/* Payment Tab */}
              {activeTab === 'payment' && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CreditCard className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">No Payment Methods</h3>
                  <p className="text-gray-500 max-w-sm mx-auto mt-2">Manage your saved cards and payment options here.</p>
                  <button className="mt-4 px-4 py-2 bg-[#DC2626] text-white font-medium rounded-lg hover:bg-[#B91C1C] transition-colors">
                    Add Payment Method
                  </button>
                </div>
              )}

              {/* Vendor: Business Settings Tab */}
              {activeTab === 'business' && isVendor && (
                  <form onSubmit={handleBusinessSave} className="space-y-6">
                    <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 space-y-5">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">General Information</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <FIELD label="Business Name">
                                <TextInput value={business.name} onChange={e => setBusiness({...business, name: e.target.value})} />
                            </FIELD>
                             <FIELD label="Business Type">
                                <SelectInput value={business.businessInfo.type} onChange={e => setBusiness({...business, businessInfo: {...business.businessInfo, type: e.target.value}})}>
                                    <option value="retailer">Retailer</option>
                                    <option value="wholesaler">Wholesaler</option>
                                    <option value="manufacturer">Manufacturer</option>
                                </SelectInput>
                            </FIELD>
                             <FIELD label="Description">
                                <textarea 
                                    value={business.businessInfo.description} 
                                    onChange={e => setBusiness({...business, businessInfo: {...business.businessInfo, description: e.target.value}})}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white"
                                    rows={3}
                                />
                            </FIELD>
                        </div>
                    </div>
                     <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 space-y-5">
                       <h3 className="text-lg font-bold text-gray-900 dark:text-white">Contact Info</h3>
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                           <FIELD label="Business Email"><TextInput value={business.contactInfo.email} onChange={e => setBusiness({...business, contactInfo: {...business.contactInfo, email: e.target.value}})} /></FIELD>
                           <FIELD label="Phone"><TextInput value={business.contactInfo.phone} onChange={e => setBusiness({...business, contactInfo: {...business.contactInfo, phone: e.target.value}})} /></FIELD>
                       </div>
                    </div>
                     <button type="submit" disabled={savingBusiness} className="px-6 py-2.5 bg-[#DC2626] text-white font-bold rounded-xl hover:bg-[#B91C1C]">Save Business Settings</button>
                  </form>
              )}
                
              {/* Vendor: Branding Tab */}
              {activeTab === 'branding' && isVendor && (
                  <form onSubmit={handleBusinessSave} className="space-y-6">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">Brand Colors</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                          {[
                            { key: 'primaryColor', label: 'Primary Color' },
                            { key: 'secondaryColor', label: 'Secondary Color' },
                            { key: 'accentColor', label: 'Accent Color' },
                          ].map(c => (
                              <FIELD key={c.key} label={c.label}>
                                  <div className="flex items-center gap-3">
                                      <input type="color" value={business.branding[c.key]} onChange={e => setBusiness({...business, branding: {...business.branding, [c.key]: e.target.value}})} className="h-10 w-16 cursor-pointer" />
                                      <TextInput value={business.branding[c.key]} onChange={e => setBusiness({...business, branding: {...business.branding, [c.key]: e.target.value}})} />
                                  </div>
                              </FIELD>
                          ))}
                      </div>
                      <button type="submit" disabled={savingBusiness} className="px-6 py-2.5 bg-[#DC2626] text-white font-bold rounded-xl hover:bg-[#B91C1C]">Save Branding</button>
                  </form>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
