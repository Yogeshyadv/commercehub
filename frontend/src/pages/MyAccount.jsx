import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  User, MapPin, CreditCard, Edit2, Plus, 
  Trash2, Mail, Phone, Lock, Eye, 
  EyeOff, Shield, Building2, Palette, Star,
  Globe, Clock, Trash, Key, Camera
} from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '../services/authService';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

/* -- Design tokens -------------------------------------------- */
const CARD = 'bg-white dark:bg-[#0d0d0d] rounded-2xl shadow-sm border border-gray-100 dark:border-white/[0.07]';
const DIV  = 'border-gray-100 dark:border-white/[0.07]';
const SUB  = 'text-gray-400 dark:text-[#5a5a7a]';

const TextInput = ({ value, onChange, placeholder, disabled, type = 'text', ...rest }) => (
  <input
    type={type}
    value={value || ''}
    onChange={onChange}
    placeholder={placeholder}
    disabled={disabled}
    {...rest}
    className={`w-full px-4 py-2.5 rounded-xl border font-medium text-sm transition-all focus:outline-none focus:ring-4 focus:ring-[#dc2626]/10 ${
      disabled
        ? 'bg-gray-50/50 dark:bg-white/[0.02] border-gray-100 dark:border-white/[0.05] text-gray-400 dark:text-[#4a4a6e] cursor-not-allowed'
        : 'bg-white dark:bg-white/[0.03] border-gray-200 dark:border-white/[0.1] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-[#3a3a5a] hover:border-gray-300 dark:hover:border-white/20'
    }`}
  />
);

const SelectInput = ({ value, onChange, children }) => (
  <select
    value={value || ''}
    onChange={onChange}
    className={`w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/[0.1] bg-white dark:bg-white/[0.03] text-sm font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-[#DC2626]/10 transition-all appearance-none cursor-pointer`}
  >
    {children}
  </select>
);

const FIELD = ({ label, children, hint }) => (
  <div className="space-y-1.5">
    <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-[#5a5a7a]">{label}</label>
    {children}
    {hint && <p className="text-[10px] font-bold text-gray-400 dark:text-[#4a4a6e] tracking-tight">{hint}</p>}
  </div>
);

export default function MyAccount() {
  const { user, login } = useAuth();
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
    street: '', city: '', state: '', postalCode: '', country: 'India', isDefault: false
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

  const handleProfileSave = async () => {
    try {
      const updatedUser = await authService.updateProfile(profileData);
      if (updatedUser.success) {
           toast.success('Identity profile synchronized');
           window.location.reload(); 
      }
      setIsEditingProfile(false);
    } catch (error) {
      toast.error('Identity synchronization failure');
    }
  };

  const handleAddAddress = async () => {
    try {
        if (!newAddress.street || !newAddress.city || !newAddress.state || !newAddress.postalCode) {
            toast.error('Required coordinate fields missing');
            return;
        }
        const updatedAddresses = [...addresses, newAddress];
        const res = await authService.updateProfile({ addresses: updatedAddresses });
        if (res.success) {
             toast.success('Logistic node added');
             setAddresses(res.data.addresses || []);
             setIsAddingAddress(false);
             setNewAddress({ street: '', city: '', state: '', postalCode: '', country: 'India', isDefault: false });
        }
    } catch (error) {
        toast.error('Failed to map new node');
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!confirm('Are you certain you wish to expunge this entry?')) return;
    try {
        const updatedAddresses = addresses.filter(addr => addr._id !== addressId);
        const res = await authService.updateProfile({ addresses: updatedAddresses });
        if (res.success) {
            setAddresses(res.data.addresses || []);
            toast.success('Logistic node expunged');
        }
    } catch (error) {
        toast.error('Purge protocol failure');
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) { toast.error('Credential mismatch'); return; }
    if (passwords.newPassword.length < 8) { toast.error('Security threshold not met (8+ chars)'); return; }
    setSavingPwd(true);
    try {
      await authService.updatePassword({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword });
      toast.success('Security credentials updated');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) { toast.error(err.response?.data?.message || 'Access modification failure'); }
    finally { setSavingPwd(false); }
  };

  const handleBusinessSave = async (e) => {
    e.preventDefault();
    setSavingBusiness(true);
    try {
      await api.put('/vendor/profile', business);
      toast.success('Business intelligence saved');
    } catch (err) { toast.error(err.response?.data?.message || 'Protocol failure'); }
    finally { setSavingBusiness(false); }
  };

  const tabs = [
    { id: 'profile', label: 'Identity Settings', icon: User },
    { id: 'security', label: 'Access Control', icon: Lock },
    { id: 'addresses', label: 'Logistic Nodes', icon: MapPin },
    { id: 'payment', label: 'Asset Management', icon: CreditCard },
    ...(isVendor ? [
      { id: 'business', label: 'Global Settings', icon: Building2 },
      { id: 'branding', label: 'Visual Interface', icon: Palette },
    ] : []),
  ];

  return (
    <div className="max-w-[1200px] mx-auto space-y-8 pb-12 animate-in fade-in duration-500 pt-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-[13px] font-bold uppercase tracking-widest text-[#dc2626] mb-1">Nexus</p>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Account Intelligence</h1>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:w-64 shrink-0 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3.5 px-5 py-3.5 rounded-2xl text-[13px] font-black uppercase tracking-wider transition-all active:scale-[0.98] ${
                activeTab === tab.id
                  ? 'bg-[#DC2626] text-white shadow-lg shadow-red-500/20'
                  : 'text-gray-400 dark:text-[#5a5a7a] hover:bg-gray-100 dark:hover:bg-white/[0.04] hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <tab.icon className={`w-4.5 h-4.5 ${activeTab === tab.id ? 'text-white' : 'text-gray-400 dark:text-[#3a3a5a]'}`} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Interface */}
        <div className="flex-1">
          <div className={`${CARD} p-8 lg:p-10 min-h-[500px] overflow-hidden`}>
            
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    {/* Profile Tab */}
                    {activeTab === 'profile' && (
                        <div className="space-y-8">
                        <div className="flex items-center justify-between mb-2">
                            <div>
                                <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Identity Profile</h2>
                                <p className={`text-xs font-bold ${SUB} mt-1`}>Synchronize your persona metrics across the network.</p>
                            </div>
                            {!isEditingProfile ? (
                            <button 
                                onClick={() => setIsEditingProfile(true)}
                                className="flex items-center gap-2 px-5 py-2.5 text-xs font-black uppercase tracking-widest text-[#DC2626] bg-[#DC2626]/[0.05] rounded-xl hover:bg-[#DC2626]/10 transition-all active:scale-95"
                            >
                                <Edit2 className="w-3.5 h-3.5" /> Modify Profile
                            </button>
                            ) : (
                            <div className="flex gap-3">
                                <button 
                                onClick={() => setIsEditingProfile(false)}
                                className="px-5 py-2.5 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-all"
                                >
                                Cancel
                                </button>
                                <button 
                                onClick={handleProfileSave}
                                className="px-5 py-2.5 text-xs font-black uppercase tracking-widest text-white bg-[#DC2626] rounded-xl hover:bg-[#B91C1C] shadow-md active:scale-95"
                                >
                                Sync Changes
                                </button>
                            </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                            <FIELD label="Assigned First Name">
                                <TextInput
                                    disabled={!isEditingProfile}
                                    value={profileData.firstName}
                                    onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                                />
                            </FIELD>
                            <FIELD label="Assigned Last Name">
                                <TextInput
                                    disabled={!isEditingProfile}
                                    value={profileData.lastName}
                                    onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                                />
                            </FIELD>
                            <FIELD label="Primary Email Node" hint="Email identifiers are immutable for security integrity.">
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-[#3a3a5a]" />
                                    <input
                                        type="email"
                                        disabled
                                        value={profileData.email}
                                        className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-100 dark:border-white/[0.05] bg-gray-50/50 dark:bg-white/[0.02] text-gray-400 dark:text-[#4a4a6e] text-sm font-medium cursor-not-allowed"
                                    />
                                </div>
                            </FIELD>
                            <FIELD label="Communication Frequency">
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-[#3a3a5a]" />
                                    <input
                                        type="tel"
                                        disabled={!isEditingProfile}
                                        value={profileData.phone}
                                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                                        className={`w-full pl-11 pr-4 py-2.5 rounded-xl border font-medium text-sm transition-all focus:outline-none focus:ring-4 focus:ring-[#dc2626]/10 ${
                                            !isEditingProfile
                                                ? 'bg-gray-50/50 dark:bg-white/[0.02] border-gray-100 dark:border-white/[0.05] text-gray-400 dark:text-[#4a4a6e] cursor-not-allowed'
                                                : 'bg-white dark:bg-white/[0.03] border-gray-200 dark:border-white/[0.1] text-gray-900 dark:text-white hover:border-gray-300 dark:hover:border-white/20'
                                        }`}
                                    />
                                </div>
                            </FIELD>
                        </div>

                        {/* Loyalty Interface */}
                        {user?.role === 'customer' && (
                            <div className="mt-10 p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#1a1a1a] dark:to-[#0a0a0a] border border-gray-100 dark:border-white/[0.05] flex items-center justify-between shadow-inner">
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 rounded-2xl bg-white dark:bg-white/[0.03] flex items-center justify-center shadow-sm border border-gray-100 dark:border-white/10">
                                        <Star className="w-7 h-7 text-amber-500" fill="currentColor" />
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-500">Loyalty Coefficient</p>
                                        <p className={`text-xs font-bold ${SUB} mt-1`}>Earn points on every acquisition cycle.</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-3xl font-black text-gray-900 dark:text-white">{(user?.loyaltyPoints || 0).toLocaleString()}</p>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[#dc2626]">Nexus Points</p>
                                </div>
                            </div>
                        )}
                        </div>
                    )}

                    {/* Security Tab */}
                    {activeTab === 'security' && (
                        <form onSubmit={handlePasswordSave} className="space-y-8">
                            <div>
                                <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Access Control</h2>
                                <p className={`text-xs font-bold ${SUB} mt-1`}>Rotate security credentials to maintain account integrity.</p>
                            </div>
                            <div className="max-w-md space-y-6 pt-2">
                                {[
                                { key: 'currentPassword', label: 'Legacy Credential', placeholder: 'Current access key' },
                                { key: 'newPassword', label: 'New Credential', placeholder: 'Minimum 8-bit complexity' },
                                { key: 'confirmPassword', label: 'Verify Credential', placeholder: 'Bit-perfect repetition' },
                                ].map(field => (
                                <FIELD key={field.key} label={field.label}>
                                    <div className="relative">
                                        <input
                                            type={showPwd[field.key] ? 'text' : 'password'}
                                            value={passwords[field.key]}
                                            onChange={e => setPasswords({...passwords, [field.key]: e.target.value})}
                                            placeholder={field.placeholder}
                                            className="w-full pl-4 pr-11 py-3 text-sm font-medium border border-gray-200 dark:border-white/[0.1] bg-white dark:bg-white/[0.03] text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-4 focus:ring-[#DC2626]/10 transition-all"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPwd({...showPwd, [field.key]: !showPwd[field.key]})}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                        >
                                            {showPwd[field.key] ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                                        </button>
                                    </div>
                                </FIELD>
                                ))}
                                <button type="submit" disabled={savingPwd} className="mt-4 px-8 py-3.5 bg-gray-900 dark:bg-white text-white dark:text-black font-black text-xs uppercase tracking-widest rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3 w-full shadow-lg">
                                    <Key className="w-4 h-4" />
                                    {savingPwd ? 'Updating Access...' : 'Modify Credentials'}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Addresses Tab */}
                    {activeTab === 'addresses' && (
                        <div className="space-y-8">
                        <div className="flex items-center justify-between mb-2">
                            <div>
                                <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Logistic Nodes</h2>
                                <p className={`text-xs font-bold ${SUB} mt-1`}>Manage delivery coordinates for rapid fulfillment.</p>
                            </div>
                            {!isAddingAddress && (
                                <button onClick={() => setIsAddingAddress(true)} className="flex items-center gap-2 px-5 py-2.5 text-xs font-black uppercase tracking-widest text-[#DC2626] bg-[#DC2626]/[0.05] rounded-xl hover:bg-[#DC2626]/10 transition-all active:scale-95">
                                    <Plus className="w-4 h-4" /> Add Coordinates
                                </button>
                            )}
                        </div>

                        {isAddingAddress && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-gray-50/50 dark:bg-white/[0.02] p-8 rounded-2xl border border-gray-100 dark:border-white/10 mb-8"
                            >
                                <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest mb-6">New Node Mapping</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                    <div className="md:col-span-2">
                                        <FIELD label="Street Address">
                                            <TextInput placeholder="Primary location data..." value={newAddress.street} onChange={e => setNewAddress({...newAddress, street: e.target.value})} />
                                        </FIELD>
                                    </div>
                                    <FIELD label="City Center">
                                        <TextInput placeholder="City identifier..." value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} />
                                    </FIELD>
                                    <FIELD label="State Region">
                                        <TextInput placeholder="Province/State..." value={newAddress.state} onChange={e => setNewAddress({...newAddress, state: e.target.value})} />
                                    </FIELD>
                                    <FIELD label="Postal Index">
                                        <TextInput placeholder="Logistics code..." value={newAddress.postalCode} onChange={e => setNewAddress({...newAddress, postalCode: e.target.value})} />
                                    </FIELD>
                                    <FIELD label="Geofence">
                                        <TextInput placeholder="Country..." value={newAddress.country} onChange={e => setNewAddress({...newAddress, country: e.target.value})} />
                                    </FIELD>
                                </div>
                                <div className="flex justify-end gap-4">
                                    <button onClick={() => setIsAddingAddress(false)} className="px-6 py-2.5 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all">Abort</button>
                                    <button onClick={handleAddAddress} className="px-7 py-2.5 text-xs font-black uppercase tracking-widest text-white bg-[#dc2626] rounded-xl shadow-lg active:scale-95 transition-all">Finalize Mapping</button>
                                </div>
                            </motion.div>
                        )}

                        {addresses.length === 0 && !isAddingAddress ? (
                            <div className="text-center py-20 flex flex-col items-center">
                                <MapPin className="w-12 h-12 text-gray-100 dark:text-[#1a1a1a] mb-5" />
                                <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">No Active Nodes</h3>
                                <p className={`text-xs font-bold ${SUB} mt-2 max-w-[240px] mx-auto`}>Coordinate mapping required for automated logistics.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                                {addresses.map((addr, idx) => (
                                    <div key={addr._id || idx} className="p-6 rounded-2xl border border-gray-100 dark:border-white/[0.08] bg-white dark:bg-white/[0.01] hover:border-[#DC2626]/30 hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/20 transition-all relative group flex items-start justify-between">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-white/[0.04] flex items-center justify-center shrink-0">
                                                <MapPin className="w-5 h-5 text-gray-400 group-hover:text-[#dc2626] transition-colors" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-black text-gray-900 dark:text-white truncate uppercase tracking-tight">{addr.street}</p>
                                                <p className={`text-xs font-bold ${SUB} mt-1`}>{addr.city}, {addr.state} {addr.postalCode}</p>
                                                <p className={`text-[10px] font-black uppercase tracking-widest text-[#dc2626] mt-2 opacity-60`}>{addr.country}</p>
                                            </div>
                                        </div>
                                        <button onClick={() => handleDeleteAddress(addr._id)} className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all">
                                            <Trash2 className="w-4.5 h-4.5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        </div>
                    )}

                    {/* Payment Tab */}
                    {activeTab === 'payment' && (
                        <div className="text-center py-24 flex flex-col items-center">
                            <CreditCard className="w-16 h-16 text-gray-100 dark:text-[#1a1a1a] mb-6" />
                            <h2 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">Asset Treasury Empty</h2>
                            <p className={`text-xs font-bold ${SUB} mt-2 max-w-[280px] mx-auto mb-8`}>Securely store acquisition instruments to enable seamless transaction cycles.</p>
                            <button className="px-8 py-3 bg-[#DC2626] text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-[#B91C1C] transition-all shadow-lg active:scale-95">
                                Add Instrument
                            </button>
                        </div>
                    )}

                    {/* Vendor: Global Settings Tab */}
                    {activeTab === 'business' && isVendor && (
                        <form onSubmit={handleBusinessSave} className="space-y-10">
                            <div>
                                <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Business Intelligence</h2>
                                <p className={`text-xs font-bold ${SUB} mt-1`}>Configure the core parameters of your commercial entity.</p>
                            </div>

                            <div className="space-y-8 bg-gray-50/50 dark:bg-white/[0.02] p-8 rounded-[32px] border border-gray-100 dark:border-white/10">
                                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#dc2626]">Entity Configuration</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <FIELD label="Legal Commercial Name">
                                        <TextInput value={business.name} onChange={e => setBusiness({...business, name: e.target.value})} />
                                    </FIELD>
                                    <FIELD label="Operational Category">
                                        <SelectInput value={business.businessInfo.type} onChange={e => setBusiness({...business, businessInfo: {...business.businessInfo, type: e.target.value}})}>
                                            <option value="retailer">Retail Entity</option>
                                            <option value="wholesaler">Wholesale Hub</option>
                                            <option value="manufacturer">Direct Manufacturer</option>
                                        </SelectInput>
                                    </FIELD>
                                    <div className="md:col-span-2">
                                        <FIELD label="Global Manifest (Description)">
                                            <textarea 
                                                value={business.businessInfo.description} 
                                                onChange={e => setBusiness({...business, businessInfo: {...business.businessInfo, description: e.target.value}})}
                                                className="w-full px-5 py-4 rounded-[20px] border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.03] text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-[#DC2626]/10 transition-all"
                                                rows={4}
                                            />
                                        </FIELD>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-8 bg-gray-50/50 dark:bg-white/[0.02] p-8 rounded-[32px] border border-gray-100 dark:border-white/10">
                                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#dc2626]">Communication Nodes</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <FIELD label="Official Support Email"><TextInput value={business.contactInfo.email} onChange={e => setBusiness({...business, contactInfo: {...business.contactInfo, email: e.target.value}})} /></FIELD>
                                    <FIELD label="Global Priority Phone"><TextInput value={business.contactInfo.phone} onChange={e => setBusiness({...business, contactInfo: {...business.contactInfo, phone: e.target.value}})} /></FIELD>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button type="submit" disabled={savingBusiness} className="px-10 py-4 bg-gray-900 dark:bg-white text-white dark:text-black font-black text-xs uppercase tracking-widest rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl">
                                    Apply Global Intelligence
                                </button>
                            </div>
                        </form>
                    )}
                        
                    {/* Vendor: Visual Interface Tab */}
                    {activeTab === 'branding' && isVendor && (
                        <form onSubmit={handleBusinessSave} className="space-y-10">
                            <div>
                                <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Visual Interface</h2>
                                <p className={`text-xs font-bold ${SUB} mt-1`}>Define the chromatic signature of your commercial nexus.</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
                                {[
                                    { key: 'primaryColor', label: 'Primary Chromatic' },
                                    { key: 'secondaryColor', label: 'Secondary Chromatic' },
                                    { key: 'accentColor', label: 'Active Accent' },
                                ].map(c => (
                                    <div key={c.key} className="bg-gray-50/50 dark:bg-white/[0.02] p-6 rounded-[24px] border border-gray-100 dark:border-white/10">
                                        <FIELD label={c.label}>
                                            <div className="flex items-center gap-4 mt-2">
                                                <div className="relative group">
                                                    <div className="w-14 h-14 rounded-2xl border-2 border-white/20 shadow-lg overflow-hidden shrink-0 cursor-pointer" style={{ backgroundColor: business.branding[c.key] }} />
                                                    <input 
                                                        type="color" 
                                                        value={business.branding[c.key]} 
                                                        onChange={e => setBusiness({...business, branding: {...business.branding, [c.key]: e.target.value}})} 
                                                        className="absolute inset-0 opacity-0 cursor-pointer" 
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <TextInput value={business.branding[c.key].toUpperCase()} onChange={e => setBusiness({...business, branding: {...business.branding, [c.key]: e.target.value}})} />
                                                </div>
                                            </div>
                                        </FIELD>
                                    </div>
                                ))}
                            </div>
                            
                            {/* Visual Preview */}
                            <div className="bg-gray-900 dark:bg-black rounded-[32px] p-10 border border-white/10 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] -mr-32 -mt-32"></div>
                                <div className="relative z-10 flex flex-col items-center gap-6">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 mb-2">Chromatic Mapping Preview</h4>
                                    <div className="flex gap-4">
                                        <div className="w-24 h-24 rounded-[20px] shadow-2xl transition-all duration-500" style={{ backgroundColor: business.branding.primaryColor }} />
                                        <div className="w-24 h-24 rounded-[20px] shadow-2xl transition-all duration-500" style={{ backgroundColor: business.branding.secondaryColor }} />
                                        <div className="w-24 h-24 rounded-[20px] shadow-2xl transition-all duration-500" style={{ backgroundColor: business.branding.accentColor }} />
                                    </div>
                                    <p className="text-[13px] font-bold text-white/80 max-w-sm text-center">This chromatic signature will be applied to your public-facing catalog interfaces.</p>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button type="submit" disabled={savingBusiness} className="px-10 py-4 bg-[#dc2626] text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-red-500/20">
                                    Commit Brand Signature
                                </button>
                            </div>
                        </form>
                    )}
                </motion.div>
            </AnimatePresence>

          </div>
        </div>
      </div>
    </div>
  );
}
