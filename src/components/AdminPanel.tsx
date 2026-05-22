import React, { useState, useEffect } from 'react';
import { TOTP } from 'totp-generator';
import { Settings, X, Plus, Trash2, Edit3, MessageSquare, ClipboardList, Building, Coins, ShieldAlert, Download, Lock, Key, Mail, LogOut, CheckCircle, Database, Loader } from 'lucide-react';
import { FinancialProduct, Property, Inquiry } from '../types';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { DEFAULT_FINANCIAL_PRODUCTS, DEFAULT_PROPERTIES } from '../data/defaultData';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  // Financial Product operations
  financials: FinancialProduct[];
  setFinancials: React.Dispatch<React.SetStateAction<FinancialProduct[]>>;
  // Property operations
  properties: Property[];
  setProperties: React.Dispatch<React.SetStateAction<Property[]>>;
  // Inquiry operations
  inquiries: Inquiry[];
  setInquiries: React.Dispatch<React.SetStateAction<Inquiry[]>>;
  // Toast triggers
  triggerToast: (msg: string, type?: 'success' | 'error') => void;
  isOfflineSandbox: boolean;
  setIsOfflineSandbox: (val: boolean) => void;
  isAdminAuthenticated: boolean;
  setIsAdminAuthenticated: (val: boolean) => void;
}

const MFA_SECRETS: Record<string, string> = {
  'sidco9ventures@gmail.com': (import.meta.env.VITE_MFA_SECRET_SIDCO9 || 'SIDCOVENTURESMFASECRETKEYROTATEDONE').trim(),
  'siddharthbose23@gmail.com': (import.meta.env.VITE_MFA_SECRET_SIDDHARTH || 'SIDCOVENTURESMFASECRETKEYROTATEDTWO').trim()
};

type AdminTab = 'financial' | 'uae-properties' | 'india-properties' | 'inquiries';

export default function AdminPanel({
  isOpen,
  onClose,
  financials,
  setFinancials,
  properties,
  setProperties,
  inquiries,
  setInquiries,
  triggerToast,
  isOfflineSandbox,
  setIsOfflineSandbox,
  isAdminAuthenticated,
  setIsAdminAuthenticated
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('financial');

  // --- SECURE ADMINISTRATIVE SESSIONS ---
  const [currentUser, setCurrentUser] = useState<User | null>(auth.currentUser);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authLoading, setAuthLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);

  // MFA states
  const [isMFAVerified, setIsMFAVerified] = useState(() => localStorage.getItem('sidco9_mfa_verified') === 'true');
  const [mfaCode, setMfaCode] = useState('');
  const [showMFASetup, setShowMFASetup] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [sandboxOTP, setSandboxOTP] = useState<string>('');

  // Double-Click Confirmation States to bypass cross-origin browser iframe alert/confirm blocks
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteConfirmFinId, setDeleteConfirmFinId] = useState<string | null>(null);
  const [deleteConfirmInqId, setDeleteConfirmInqId] = useState<string | null>(null);
  const [wipeConfirm, setWipeConfirm] = useState(false);

  useEffect(() => {
    if (!currentUser || isMFAVerified) return;
    const email = currentUser.email || '';
    const secret = MFA_SECRETS[email];
    if (!secret) return;

    let active = true;
    const updateOTP = async () => {
      try {
        const token = await TOTP.generate(secret);
        if (active) {
          setSandboxOTP(token.otp);
        }
      } catch (err) {
        console.error(err);
      }
    };

    updateOTP();
    const interval = setInterval(updateOTP, 5000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [currentUser, isMFAVerified]);

  const handleGoogleSignIn = async () => {
    setAuthLoading(true);
    setAuthError(null);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    try {
      const result = await signInWithPopup(auth, provider);
      const email = result.user?.email || '';
      const normalizedEmail = email.trim().toLowerCase();
      
      if (normalizedEmail !== 'sidco9ventures@gmail.com' && normalizedEmail !== 'siddharthbose23@gmail.com') {
        await signOut(auth);
        triggerToast('This Google account is not an authorized administrator.', 'error');
        setAuthError('Unauthorized. The signed-in account is not a registered administrator.');
      } else {
        triggerToast('Authorized Google Session successfully linked.', 'success');
      }
    } catch (err: any) {
      console.error(err);
      let errorMsg = 'Google authentication linkage failure.';
      if (err.code === 'auth/operation-not-allowed') {
        errorMsg = 'Google sign-in provider is not enabled in your Firebase console. Direct Google SSO bypass requires activation on your personal Firebase project.';
      } else if (err.message) {
        errorMsg = err.message;
      }
      triggerToast(errorMsg, 'error');
      setAuthError(errorMsg);
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    if (isOfflineSandbox) {
      const isOffAdmin = localStorage.getItem('sidco9_offline_admin') === 'true';
      const offEmail = localStorage.getItem('sidco9_offline_email');
      if (isOffAdmin && offEmail) {
        setCurrentUser({ email: offEmail } as User);
        setIsMFAVerified(localStorage.getItem('sidco9_mfa_verified') === 'true');
        setIsAdminAuthenticated(true);
      } else {
        setCurrentUser(null);
        setIsMFAVerified(false);
        setIsAdminAuthenticated(false);
      }
      setIsCheckingAuth(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsCheckingAuth(false);
      if (!user) {
        setIsMFAVerified(false);
      }
    });
    return () => unsubscribe();
  }, [isOfflineSandbox]);

  const handleMFAVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mfaCode.length !== 6) {
      triggerToast('Code must be exactly 6 digits.', 'error');
      return;
    }

    const email = currentUser?.email || '';
    const secret = MFA_SECRETS[email];
    if (!secret) {
      triggerToast('No Authenticator secret set for this identity.', 'error');
      return;
    }

    setAuthLoading(true);
    try {
      const check1 = await TOTP.generate(secret);
      const check2 = await TOTP.generate(secret, { timestamp: Date.now() - 30 * 1050 });
      const check3 = await TOTP.generate(secret, { timestamp: Date.now() + 30 * 1050 });

      if (mfaCode === check1.otp || mfaCode === check2.otp || mfaCode === check3.otp) {
        setIsMFAVerified(true);
        localStorage.setItem('sidco9_mfa_verified', 'true');
        if (isOfflineSandbox) {
          localStorage.setItem('sidco9_offline_admin', 'true');
          localStorage.setItem('sidco9_offline_email', email);
          setIsAdminAuthenticated(true);
        }
        triggerToast('Multi-factor authorization unlocked completely.', 'success');
        setMfaCode('');
      } else {
        triggerToast('Invalid Google Authenticator verification code.', 'error');
      }
    } catch (err: any) {
      console.error(err);
      triggerToast('Error validating Authenticator cryptographic tokens.', 'error');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail) {
      triggerToast('Administrative email is required.', 'error');
      return;
    }

    const normalizedEmail = authEmail.trim().toLowerCase();
    if (normalizedEmail !== 'sidco9ventures@gmail.com' && normalizedEmail !== 'siddharthbose23@gmail.com') {
      triggerToast('Unauthorized. Registration is verified for host emails only.', 'error');
      return;
    }

    if (isOfflineSandbox) {
      setCurrentUser({ email: normalizedEmail } as User);
      triggerToast('Local sandbox identity asserted. Authenticator TOTP required.', 'success');
      return;
    }

    if (!authPassword) {
      triggerToast('Please supply password for live database verification.', 'error');
      return;
    }

    setAuthLoading(true);
    setAuthError(null);
    try {
      if (authMode === 'login') {
        await signInWithEmailAndPassword(auth, authEmail.trim(), authPassword);
        triggerToast('Secured administrative session authorized.', 'success');
      } else {
        await createUserWithEmailAndPassword(auth, authEmail.trim(), authPassword);
        triggerToast('Administrator registered successfully. Let\'s verify your Authenticator next!', 'success');
      }
      setAuthPassword('');
    } catch (err: any) {
      console.error(err);
      let errorMsg = 'Session authorization error.';
      if (err.code === 'auth/wrong-password') {
        errorMsg = 'Incorrect administrator password supplied.';
      } else if (err.code === 'auth/user-not-found') {
        errorMsg = 'No administrative registration found under this email. Please register first.';
      } else if (err.code === 'auth/email-already-in-use') {
        errorMsg = 'Admin email is already registered. Choose Login mode.';
      } else if (err.code === 'auth/weak-password') {
        errorMsg = 'Password must be at least 6 characters.';
      } else if (err.code === 'auth/operation-not-allowed') {
        errorMsg = 'Email/Password sign-in provider is disabled in your Firebase console. Please use Google Sign-In below, configure your custom Firebase workspace, or activate "Frictionless Offline Sandbox" bypass.';
      } else if (err.message) {
        errorMsg = err.message;
      }
      triggerToast(errorMsg, 'error');
      setAuthError(errorMsg);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      if (isOfflineSandbox) {
        localStorage.removeItem('sidco9_offline_admin');
        localStorage.removeItem('sidco9_offline_email');
        localStorage.removeItem('sidco9_mfa_verified');
        setIsAdminAuthenticated(false);
        setIsMFAVerified(false);
        setCurrentUser(null);
        triggerToast('Local administrative token cleared.', 'error');
      } else {
        await signOut(auth);
        localStorage.removeItem('sidco9_mfa_verified');
        setIsMFAVerified(false);
        triggerToast('Administrative token cleared. Logout ok.', 'error');
      }
    } catch (err) {
      triggerToast('Could not sign out.', 'error');
    }
  };

  const handleManualSeed = async () => {
    setIsSeeding(true);
    try {
      triggerToast('Deploying assets to database schemas...', 'success');
      
      if (isOfflineSandbox) {
        setFinancials(DEFAULT_FINANCIAL_PRODUCTS);
        setProperties(DEFAULT_PROPERTIES);
        localStorage.setItem('sidco9_financial', JSON.stringify(DEFAULT_FINANCIAL_PRODUCTS));
        localStorage.setItem('sidco9_properties', JSON.stringify(DEFAULT_PROPERTIES));
        triggerToast('Local sandbox reset to defaults success.', 'success');
      } else {
        const finPromises = DEFAULT_FINANCIAL_PRODUCTS.map((f) =>
          setDoc(doc(db, 'financials', f.id), f)
        );

        const propPromises = DEFAULT_PROPERTIES.map((p) =>
          setDoc(doc(db, 'properties', p.id), p)
        );

        await Promise.all([...finPromises, ...propPromises]);
        triggerToast('Databases seeded successfully with clean defaults.', 'success');
      }
    } catch (err) {
      console.error(err);
      triggerToast('Data seed validation failed.', 'error');
    } finally {
      setIsSeeding(false);
    }
  };

  // Form states - Financial
  const [finId, setFinId] = useState('');
  const [finType, setFinType] = useState<'Insurance' | 'Mutual Fund'>('Insurance');
  const [finName, setFinName] = useState('');
  const [finProvider, setFinProvider] = useState('');
  const [finDesc, setFinDesc] = useState('');
  const [finFeatures, setFinFeatures] = useState('');
  const [finBadge, setFinBadge] = useState('');

  // Form states - Property (Combined for UAE / India depending on active tab)
  const [propId, setPropId] = useState('');
  const [propTitle, setPropTitle] = useState('');
  const [propCategory, setPropCategory] = useState<'Residential' | 'Commercial'>('Residential');
  const [propLocation, setPropLocation] = useState('');
  const [propPrice, setPropPrice] = useState<number>(0);
  const [propYield, setPropYield] = useState<number>(0);
  const [propType, setPropType] = useState('');
  const [propHighlights, setPropHighlights] = useState('');
  const [propGradient, setPropGradient] = useState('1');

  if (!isOpen) return null;

  // --- Financial Operations ---
  const handleSaveFinancial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!finName || !finProvider || !finDesc) {
      triggerToast('Please fill all required fields.', 'error');
      return;
    }

    const itemFeatures = finFeatures
      .split(',')
      .map((f) => f.trim())
      .filter(Boolean);

    const targetId = finId || 'f-' + Date.now();
    const newProduct: FinancialProduct = {
      id: targetId,
      type: finType,
      name: finName,
      provider: finProvider,
      desc: finDesc,
      features: itemFeatures
    };

    if (finBadge) {
      newProduct.badge = finBadge;
    }

    if (isOfflineSandbox) {
      setFinancials((prev) => {
        const next = finId ? prev.map((f) => (f.id === finId ? newProduct : f)) : [...prev, newProduct];
        localStorage.setItem('sidco9_financial', JSON.stringify(next));
        return next;
      });
      triggerToast(finId ? 'Financial product updated successfully.' : 'Financial product created successfully.', 'success');
    } else {
      try {
        await setDoc(doc(db, 'financials', targetId), newProduct);
        triggerToast(finId ? 'Financial product updated successfully.' : 'Financial product created successfully.', 'success');
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `financials/${targetId}`);
      }
    }

    // Reset Form
    setFinId('');
    setFinName('');
    setFinProvider('');
    setFinDesc('');
    setFinFeatures('');
    setFinBadge('');
  };

  const handleEditFinancial = (prod: FinancialProduct) => {
    setFinId(prod.id);
    setFinType(prod.type);
    setFinName(prod.name);
    setFinProvider(prod.provider);
    setFinDesc(prod.desc);
    setFinFeatures((prod.features || []).join(', '));
    setFinBadge(prod.badge || '');
  };

  const handleDeleteFinancial = async (id: string) => {
    if (deleteConfirmFinId !== id) {
      setDeleteConfirmFinId(id);
      setTimeout(() => {
        setDeleteConfirmFinId((current) => (current === id ? null : current));
      }, 3050);
      triggerToast('Click delete again to confirm removal.', 'success');
      return;
    }
    setDeleteConfirmFinId(null);

    if (isOfflineSandbox) {
      setFinancials((prev) => {
        const next = prev.filter((f) => f.id !== id);
        localStorage.setItem('sidco9_financial', JSON.stringify(next));
        return next;
      });
      triggerToast('Product deleted.', 'error');
    } else {
      try {
        await deleteDoc(doc(db, 'financials', id));
        triggerToast('Product deleted.', 'error');
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `financials/${id}`);
      }
    }
  };

  // --- Property Operations ---
  const handleSaveProperty = (region: 'UAE' | 'India') => async (e: React.FormEvent) => {
    e.preventDefault();
    if (!propTitle || !propLocation || propPrice <= 0) {
      triggerToast('Please fill all required property specs.', 'error');
      return;
    }

    const itemHighlights = propHighlights
      .split(',')
      .map((h) => h.trim())
      .filter(Boolean);

    const targetId = propId || 'p-' + Date.now();
    const newProperty: Property = {
      id: targetId,
      region,
      category: propCategory,
      title: propTitle.trim(),
      location: propLocation.trim(),
      price: Number(propPrice),
      highlights: itemHighlights,
      gradient: propGradient
    };

    if (propYield) {
      newProperty.yield = Number(propYield);
    }
    if (propType) {
      newProperty.type = propType.trim();
    }

    if (isOfflineSandbox) {
      setProperties((prev) => {
        const next = propId ? prev.map((p) => (p.id === propId ? newProperty : p)) : [...prev, newProperty];
        localStorage.setItem('sidco9_properties', JSON.stringify(next));
        return next;
      });
      triggerToast(propId ? `${region} target property updated.` : `${region} target property listed.`, 'success');
    } else {
      try {
        await setDoc(doc(db, 'properties', targetId), newProperty);
        triggerToast(propId ? `${region} target property updated.` : `${region} target property listed.`, 'success');
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `properties/${targetId}`);
      }
    }

    handleResetPropForm();
  };

  const handleResetPropForm = () => {
    setPropId('');
    setPropTitle('');
    setPropCategory('Residential');
    setPropLocation('');
    setPropPrice(0);
    setPropYield(0);
    setPropType('');
    setPropHighlights('');
    setPropGradient('1');
  };

  const handleEditProperty = (prop: Property) => {
    setPropId(prop.id);
    setPropTitle(prop.title);
    setPropCategory(prop.category);
    setPropLocation(prop.location);
    setPropPrice(prop.price);
    setPropYield(prop.yield || 0);
    setPropType(prop.type || '');
    setPropHighlights((prop.highlights || []).join(', '));
    setPropGradient(prop.gradient || '1');
  };

  const handleDeleteProperty = async (id: string) => {
    if (deleteConfirmId !== id) {
      setDeleteConfirmId(id);
      setTimeout(() => {
        setDeleteConfirmId((current) => (current === id ? null : current));
      }, 3050);
      triggerToast('Click delete again to confirm removal of this asset.', 'success');
      return;
    }
    setDeleteConfirmId(null);

    if (isOfflineSandbox) {
      setProperties((prev) => {
        const next = prev.filter((p) => p.id !== id);
        localStorage.setItem('sidco9_properties', JSON.stringify(next));
        return next;
      });
      triggerToast('Property listing removed.', 'error');
    } else {
      try {
        await deleteDoc(doc(db, 'properties', id));
        triggerToast('Property listing removed.', 'error');
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `properties/${id}`);
      }
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (deleteConfirmInqId !== id) {
      setDeleteConfirmInqId(id);
      setTimeout(() => {
        setDeleteConfirmInqId((current) => (current === id ? null : current));
      }, 3050);
      triggerToast('Click delete again to confirm client lead removal.', 'success');
      return;
    }
    setDeleteConfirmInqId(null);

    if (isOfflineSandbox) {
      setInquiries((prev) => {
        const next = prev.filter((inq) => inq.id !== id);
        localStorage.setItem('sidco9_inquiries', JSON.stringify(next));
        return next;
      });
      triggerToast('Inquiry lead log deleted.', 'error');
    } else {
      try {
        await deleteDoc(doc(db, 'inquiries', id));
        triggerToast('Inquiry lead log deleted.', 'error');
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `inquiries/${id}`);
      }
    }
  };

  const handleUpdateInquiryStatus = async (inq: Inquiry, newStatus: 'New' | 'Contacted' | 'Archived') => {
    const updatedInq: Inquiry = {
      ...inq,
      status: newStatus
    };
    if (isOfflineSandbox) {
      setInquiries((prev) => {
        const next = prev.map((item) => (item.id === inq.id ? updatedInq : item));
        localStorage.setItem('sidco9_inquiries', JSON.stringify(next));
        return next;
      });
      triggerToast(`Inquiry status updated to ${newStatus}.`, 'success');
    } else {
      try {
        await setDoc(doc(db, 'inquiries', inq.id), updatedInq);
        triggerToast(`Inquiry status updated to ${newStatus}.`, 'success');
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `inquiries/${inq.id}`);
      }
    }
  };

  const handleDownloadCSV = () => {
    if (inquiries.length === 0) {
      triggerToast('No inquiry data available to export.', 'error');
      return;
    }

    // Define columns/headers
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Interest', 'Property ID', 'Property Title', 'Message', 'Timestamp', 'Status'];
    
    // Transform entries into formatted records, escaping double quotes and flattening line breaks
    const rows = inquiries.map((inq) => [
      inq.id || '',
      inq.name || '',
      inq.email || '',
      inq.phone || '',
      inq.interest || '',
      inq.propertyId || '',
      inq.propertyTitle || '',
      (inq.message || '').replace(/"/g, '""').replace(/\s+/g, ' '),
      inq.timestamp || '',
      inq.status || 'New'
    ]);

    // Build standard structure
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(value => `"${value}"`).join(','))
    ].join('\r\n');

    try {
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `sidco9_leads_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      triggerToast('Leads exported to CSV successfully.', 'success');
    } catch (error) {
      console.error('Error generating CSV:', error);
      triggerToast('Failed to export leads to CSV.', 'error');
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0A0A0A]/80 backdrop-blur-md z-50 flex items-center justify-center p-4 font-sans text-black animate-fade-in">
      <div className="bg-white w-full max-w-5xl h-[85vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-black/10">
        
        {/* Header bar */}
        <div className="bg-black p-5 text-white flex items-center justify-between border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-2 text-left">
            <Settings className="w-5 h-5 text-[#CBA135] animate-spin" style={{ animationDuration: '8s' }} />
            <span className="font-bold text-sm tracking-widest text-white uppercase block">
              sidco9 Ventures CMS Console
            </span>
            <span className="bg-[#CBA135]/20 text-[#CBA135] border border-[#CBA135]/30 text-[9px] uppercase tracking-widest px-2.5 py-0.5 rounded-full font-mono ml-2">
              System Control
            </span>
          </div>
          <div className="flex items-center gap-4">
            {currentUser && (currentUser.email === 'sidco9ventures@gmail.com' || currentUser.email === 'siddharthbose23@gmail.com') && (
              <button
                onClick={handleSignOut}
                className="text-neutral-400 hover:text-white flex items-center gap-1.5 transition-all outline-none py-1 px-3 border border-neutral-800 rounded-full hover:border-[#CBA135]"
                title="Log Out Security Session"
              >
                <LogOut className="w-3.5 h-3.5 text-[#CBA135]" />
                <span className="text-[9px] uppercase tracking-widest font-black">Revoke Access</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-all text-neutral-300"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Console Body Content Wrapper */}
        {isCheckingAuth ? (
          <div className="flex-1 flex flex-col items-center justify-center bg-[#F5F5F4] p-8">
            <Loader className="w-8 h-8 text-[#CBA135] animate-spin mb-3" />
            <span className="text-xs uppercase tracking-widest font-bold text-[#0A0A0A]/40">Authenticating Secure Link...</span>
          </div>
        ) : !currentUser || (currentUser.email !== 'sidco9ventures@gmail.com' && currentUser.email !== 'siddharthbose23@gmail.com') ? (
          /* Authentication Gate overlay */
          <div className="flex-1 flex flex-col md:flex-row items-center justify-center bg-[#F5F5F4]/30 overflow-y-auto p-6 md:p-12 gap-12 text-black">
            <div className="max-w-md text-left space-y-4">
              <span className="bg-[#CBA135]/10 text-[#CBA135] text-[9px] uppercase tracking-[0.2em] px-3.5 py-1 rounded-full font-black border border-[#CBA135]/20">
                Authorized Personnel Only
              </span>
              <h2 className="text-3xl font-black uppercase text-black tracking-tight leading-tight">
                Advisory Desk<br /><span className="text-[#CBA135]">CMS Gateway</span>
              </h2>
              <p className="text-xs font-medium text-black/50 leading-relaxed max-w-sm">
                Unlock executive panel permissions directing secure asset catalogs, luxury property shelves, and client consultations.
              </p>
              
              <div className="p-4 border border-[#CBA135]/25 rounded-2xl bg-[#CBA135]/5 text-[10px] text-[#0A0A0A]/70 space-y-2.5 leading-relaxed max-w-sm">
                <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[#CBA135]">
                  <Database className="w-3.5 h-3.5 text-[#CBA135] animate-pulse" />
                  Frictionless Sandbox Mode
                </div>
                <p>
                  Since sandbox databases are hosted inside isolated platforms, standard console access to enable providers is restricted.
                </p>
                <div className="pt-2 border-t border-black/5 text-[9px] text-[#0A0A0A]/60 space-y-1 font-sans">
                  <span className="font-extrabold uppercase text-[#CBA135] block">Quick Workspace Option:</span>
                  <p>Activate **Frictionless Offline Sandbox override** to verify all property catalogs, financial models, and inquiry forms in your browser!</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const nextMode = !isOfflineSandbox;
                    setIsOfflineSandbox(nextMode);
                    localStorage.setItem('sidco9_offline_sandbox', nextMode ? 'true' : 'false');
                    triggerToast(nextMode ? 'Frictionless Offline Local Sandbox is now active!' : 'Firebase Cloud Database mode active.', 'success');
                  }}
                  className={`w-full mt-2.5 py-2.5 px-4 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                    isOfflineSandbox
                      ? 'bg-[#CBA135] hover:bg-[#CBA135]/85 text-white shadow-sm'
                      : 'bg-black hover:bg-neutral-850 text-white'
                  }`}
                >
                  <Database className="w-4 h-4 text-white" />
                  {isOfflineSandbox ? '● Local Sandbox Active (Disable)' : 'Enable Local Sandbox Bypass'}
                </button>
              </div>

              <div className="p-4 border border-black/15 rounded-2xl bg-white text-[10px] text-black/50 space-y-1.5 leading-relaxed max-w-sm">
                <span className="font-bold text-black uppercase tracking-wider block">Security Rule Verification:</span>
                <span>Runtime transactions verify that request payloads and reads/writes map strictly to standard cryptographic admin scopes.</span>
              </div>
            </div>

            <div className="w-full max-w-sm bg-white border border-black/10 rounded-3xl p-8 shadow-2xl relative">
              <form onSubmit={handleAuthAction} className="space-y-4 text-left">
                <div className="flex justify-between border-b border-black/10 pb-2 mb-2 items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#CBA135] flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5" />
                    {authMode === 'login' ? 'Authentication Challenge' : 'Administrator Registration'}
                  </span>
                  
                  <button
                    type="button"
                    onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                    className="text-[9px] font-bold text-[#CBA135] hover:underline uppercase tracking-wider transition-colors"
                  >
                    {authMode === 'login' ? 'Register New Password' : 'Back to Login'}
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="block text-[8px] uppercase tracking-widest font-black text-black/40">Registered Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-black/30 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="sidco9ventures@gmail.com"
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      className="w-full text-xs p-3.5 pl-10 bg-[#F5F5F4]/30 border border-black/10 rounded-2xl focus:outline-none focus:border-[#CBA135]/50 hover:border-black/20 transition-all font-sans"
                    />
                  </div>
                  <p className="text-[8px] font-semibold text-black/30 mt-1 uppercase">Must match host: sidco9ventures@gmail.com or siddharthbose23@gmail.com</p>
                </div>

                <div className="space-y-1">
                  <label className="block text-[8px] uppercase tracking-widest font-black text-black/40">Password</label>
                  <div className="relative">
                    <Key className="w-4 h-4 text-black/30 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required={!isOfflineSandbox}
                      placeholder={isOfflineSandbox ? "Optional in Sandbox Mode (Leave blank)" : "••••••••••••"}
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      className="w-full text-xs p-3.5 pl-10 bg-[#F5F5F4]/30 border border-black/10 rounded-2xl focus:outline-none focus:border-[#CBA135]/50 hover:border-black/20 transition-all font-sans"
                    />
                  </div>
                  {isOfflineSandbox && (
                    <p className="text-[8.5px] font-bold text-[#CBA135] uppercase mt-1">
                      ● Local Sandbox active: Leave password blank or enter anything!
                    </p>
                  )}
                </div>

                {authError && (
                  <div className="p-3.5 border border-red-550/20 rounded-2xl bg-red-50/55 text-[10px] text-red-700 space-y-2 leading-relaxed font-semibold">
                    <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-red-900">
                      <ShieldAlert className="w-3.5 h-3.5 text-red-600 animate-pulse" />
                      Configuration Hint
                    </div>
                    <p>{authError}</p>
                    {authError.includes('disabled') && (
                      <div className="pt-2 border-t border-red-500/10 text-[9px] text-[#0A0A0A]/60 space-y-1 font-sans">
                        <span className="font-extrabold uppercase text-[#CBA135] block">Quick Console Instruction:</span>
                        <p>1. Open <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="underline font-bold text-[#CBA135] hover:text-[#CBA135]/85">Firebase Console</a>.</p>
                        <p>2. Select your project <strong className="font-extrabold text-[#0a0a0a]">sidco9-core</strong>.</p>
                        <p>3. Go to <strong className="font-extrabold text-[#0a0a0a]">Build &gt; Authentication &gt; Sign-in method</strong>.</p>
                        <p>4. Add and enable the <strong className="font-extrabold text-[#0a0a0a]">Email/Password</strong> provider.</p>
                        <p className="font-medium text-[8px] text-black/40 mt-1">Or simply click the "Sign in with Google Account" button below which is active by default!</p>
                      </div>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-4 bg-black hover:bg-neutral-850 text-white font-black rounded-full text-[9px] tracking-widest uppercase transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  {authLoading ? (
                    <Loader className="w-4 h-4 text-white animate-spin" />
                  ) : authMode === 'login' ? (
                    'Sign In'
                  ) : (
                    'Register Administrator'
                  )}
                </button>

                {/* Divider Block */}
                <div className="flex items-center gap-2 py-0.5">
                  <div className="flex-1 h-px bg-black/10" />
                  <span className="text-[7.5px] font-black uppercase text-black/30 tracking-widest flex-shrink-0">or secure bypass</span>
                  <div className="flex-1 h-px bg-black/10" />
                </div>

                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={authLoading}
                  className="w-full py-3.5 bg-white hover:bg-[#F5F5F4]/60 text-black font-extrabold rounded-full text-[8.5px] tracking-widest uppercase border border-black/15 hover:border-[#CBA135]/50 transition-all flex items-center justify-center gap-2 shadow-sm active:scale-98"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.62-.62-1.07-1.37-1.18-2.2z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                  </svg>
                  Sign in with Google Account
                </button>
              </form>
            </div>
          </div>
        ) : !isMFAVerified ? (
          /* MFA Security Challenge gate */
          <div className="flex-1 flex flex-col md:flex-row items-center justify-center bg-[#F5F5F4]/30 overflow-y-auto p-6 md:p-12 gap-12 text-black">
            <div className="max-w-md text-left space-y-4">
              <span className="bg-[#CBA135]/10 text-[#CBA135] text-[9px] uppercase tracking-[0.2em] px-3.5 py-1 rounded-full font-black border border-[#CBA135]/20 flex items-center gap-1.5 w-fit">
                <ShieldAlert className="w-3.5 h-3.5" />
                Multi-Factor Authentication Required
              </span>
              <h2 className="text-3xl font-black uppercase text-black tracking-tight leading-tight">
                Two-Step<br /><span className="text-[#CBA135]">Authenticator Shield</span>
              </h2>
              <p className="text-xs font-medium text-black/50 leading-relaxed max-w-sm">
                Enter the 6-digit dynamically rolling code generated by your Google Authenticator app for <span className="text-black font-bold">{currentUser.email}</span>.
              </p>
              
              <button
                onClick={() => setShowMFASetup(!showMFASetup)}
                className="text-xs font-bold text-[#CBA135] hover:underline uppercase tracking-wider block"
              >
                {showMFASetup ? 'Hide Integration Guide' : 'Show Google Authenticator Setup & QR Code'}
              </button>

              {showMFASetup && (
                <div className="p-5 border border-[#CBA135]/20 rounded-2xl bg-white text-[10px] text-black/60 space-y-3 leading-relaxed max-w-sm shadow-sm">
                  <span className="font-bold text-[#CBA135] uppercase tracking-wider block">MFA Device Enrollment:</span>
                  <p>1. Open Google Authenticator on your mobile device.</p>
                  <p>2. Scan this QR Code or click to copy the manual secret key:</p>
                  
                  <div className="flex flex-col items-center gap-3 bg-neutral-50 p-4 rounded-xl border border-black/5">
                    {/* Secure QR Code API Link */}
                    <img
                      referrerPolicy="no-referrer"
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                        `otpauth://totp/sidco9%20Ventures:${currentUser.email}?secret=${MFA_SECRETS[currentUser.email || ''] || ''}&issuer=sidco9%20Ventures`
                      )}`}
                      alt="Google Authenticator QR Code"
                      className="w-32 h-32 border border-black/10 bg-white p-1 rounded-lg"
                    />
                    <div className="text-center">
                      <span className="block text-[8px] uppercase tracking-wider text-black/40 font-black">Manual Secret Key:</span>
                      <code className="bg-white px-2 py-1 rounded border border-black/10 text-[9px] font-mono font-bold block mt-1 select-all cursor-copy" title="Click to copy secret">
                        {MFA_SECRETS[currentUser.email || ''] || ''}
                      </code>
                    </div>
                  </div>
                  <p className="text-[9px] text-black/40">Once added, enter the current 6-digit verification code below to authorize the secure administration layout.</p>
                </div>
              )}
            </div>

            <div className="w-full max-w-sm bg-white border border-black/10 rounded-3xl p-8 shadow-2xl relative">
              <form onSubmit={handleMFAVerify} className="space-y-5 text-left">
                <div className="flex justify-between border-b border-black/10 pb-2 mb-2 items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#CBA135] flex items-center gap-1.5 animate-pulse">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    Enter 6-Digit Code
                  </span>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="text-[9px] font-bold text-red-500 hover:underline uppercase tracking-wider"
                  >
                    Change Account
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="block text-[8px] uppercase tracking-widest font-black text-black/40">Authenticator Code</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="e.g. 123456"
                    value={mfaCode}
                    onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ''))}
                    className="w-full text-center text-lg font-mono font-black tracking-[0.4em] p-3.5 bg-[#F5F5F4]/35 border border-black/10 rounded-2xl focus:outline-none focus:border-[#CBA135] transition-all"
                  />
                  {isOfflineSandbox && sandboxOTP && (
                    <div className="mt-3.5 p-3 bg-[#CBA135]/5 border border-[#CBA135]/20 rounded-2xl text-center">
                      <span className="block text-[8px] font-black uppercase text-[#A67D1C] tracking-wider mb-1.5 animate-pulse">
                        Sandbox Simulator Token Active
                      </span>
                      <button
                        type="button"
                        onClick={() => setMfaCode(sandboxOTP)}
                        className="w-full py-2.5 bg-[#CBA135] hover:bg-[#B68D25] text-white text-[9px] font-black uppercase tracking-widest rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 active:scale-98"
                      >
                        Click to Auto-Fill: {sandboxOTP}
                      </button>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-4 bg-black hover:bg-neutral-850 text-white font-black rounded-full text-[9px] tracking-widest uppercase transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  {authLoading ? (
                    <Loader className="w-4 h-4 text-white animate-spin" />
                  ) : (
                    'Confirm Multi-Factor Access'
                  )}
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* ALL FULL CRUD CAPABILITIES WRAPPED SAFELY UNDER REGISTERED ADMINISTRATOR ONLY */
          <>
            {/* Database Empty Seeding Bar */}
            {financials.length === 0 && properties.length === 0 && (
              <div className="bg-[#CBA135]/15 border-b border-[#CBA135]/20 px-6 py-3.5 flex items-center justify-between text-left shrink-0">
                <span className="text-[10px] text-[#A67D1C] font-black uppercase tracking-wider flex items-center gap-2">
                  <Database className="w-4 h-4 animate-bounce shrink-0 text-[#CBA135]" />
                  Internal schema logs are empty. Would you like to seed default listings?
                </span>
                <button
                  onClick={handleManualSeed}
                  disabled={isSeeding}
                  className="px-5 py-2 bg-[#CBA135] hover:bg-[#B68D25] text-white text-[9px] uppercase tracking-widest font-black rounded-lg transition-all flex items-center gap-1.5 shadow-sm shrink-0"
                >
                  {isSeeding ? <Loader className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                  Deploy default datasets
                </button>
              </div>
            )}

            {/* Console Tab selection */}
            <div className="bg-[#F5F5F4]/40 flex border-b border-black/10 flex-shrink-0 overflow-x-auto">
              <button
                onClick={() => { setActiveTab('financial'); handleResetPropForm(); }}
                className={`flex-1 min-w-[150px] py-4 px-4 text-[10px] uppercase font-black tracking-widest border-b-2 flex items-center justify-center gap-2 transition-all ${
                  activeTab === 'financial'
                    ? 'border-black text-black bg-white shadow-sm font-black'
                    : 'border-transparent text-black/50 hover:text-black hover:bg-black/5'
                }`}
              >
                <Coins className="w-4 h-4" />
                Financial Portfolios
              </button>
              
              <button
                onClick={() => { setActiveTab('uae-properties'); handleResetPropForm(); }}
                className={`flex-1 min-w-[150px] py-4 px-4 text-[10px] uppercase font-black tracking-widest border-b-2 flex items-center justify-center gap-2 transition-all ${
                  activeTab === 'uae-properties'
                    ? 'border-black text-black bg-white shadow-sm font-black'
                    : 'border-transparent text-black/50 hover:text-black hover:bg-black/5'
                }`}
              >
                <Building className="w-4 h-4" />
                UAE Property Shelf
              </button>

              <button
                onClick={() => { setActiveTab('india-properties'); handleResetPropForm(); }}
                className={`flex-1 min-w-[150px] py-4 px-4 text-[10px] uppercase font-black tracking-widest border-b-2 flex items-center justify-center gap-2 transition-all ${
                  activeTab === 'india-properties'
                    ? 'border-black text-black bg-white shadow-sm font-black'
                    : 'border-transparent text-black/50 hover:text-black hover:bg-black/5'
                }`}
              >
                <Building className="w-4 h-4" />
                India Property Shelf
              </button>

              <button
                onClick={() => { setActiveTab('inquiries'); handleResetPropForm(); }}
                className={`flex-1 min-w-[150px] py-4 px-4 text-[10px] uppercase font-black tracking-widest border-b-2 flex items-center justify-center gap-2 transition-all relative ${
                  activeTab === 'inquiries'
                    ? 'border-black text-black bg-white shadow-sm font-black'
                    : 'border-transparent text-black/50 hover:text-black hover:bg-black/5'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                Customer Leads
                {inquiries.length > 0 && (
                  <span className="absolute top-2.5 right-2 bg-black text-white font-mono text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {inquiries.length}
                  </span>
                )}
              </button>
            </div>

        {/* Modal Main body viewport */}
        <div className="flex-1 overflow-y-auto p-6 bg-white text-left">
          
          {/* TAB 1: FINANCIALS */}
          {activeTab === 'financial' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
              {/* Form schema */}
              <form onSubmit={handleSaveFinancial} className="lg:col-span-5 bg-[#F5F5F4] p-6 rounded-3xl border border-black/5 space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-black/5">
                  <h4 className="font-bold text-sm text-black uppercase tracking-tight">{finId ? 'Edit Product' : 'Add Financial Product'}</h4>
                  {finId && (
                    <button
                      type="button"
                      onClick={() => { setFinId(''); setFinName(''); setFinProvider(''); setFinDesc(''); setFinFeatures(''); setFinBadge(''); }}
                      className="text-[10px] font-black text-black hover:underline uppercase"
                    >
                      Reset Form
                    </button>
                  )}
                </div>

                <div>
                  <label className="block text-[9px] font-black uppercase tracking-widest text-[#0A0A0A]/40 mb-1">Product Stream</label>
                  <select
                    value={finType}
                    onChange={(e) => setFinType(e.target.value as 'Insurance' | 'Mutual Fund')}
                    className="w-full text-xs p-3 bg-white border border-black/10 rounded-full focus:outline-none"
                  >
                    <option value="Insurance">Insurance Distribution</option>
                    <option value="Mutual Fund">NRI-Compliant Mutual Fund</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[9px] font-black uppercase tracking-widest text-[#0A0A0A]/40 mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sovereign Balanced growth"
                    value={finName}
                    onChange={(e) => setFinName(e.target.value)}
                    className="w-full text-xs p-3 bg-white border border-black/10 rounded-full focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-black uppercase tracking-widest text-[#0A0A0A]/40 mb-1">Vetted Provider / AMC *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Parag Parikh Asset Management"
                    value={finProvider}
                    onChange={(e) => setFinProvider(e.target.value)}
                    className="w-full text-xs p-3 bg-white border border-black/10 rounded-full focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-black uppercase tracking-widest text-[#0A0A0A]/40 mb-1">Strategic Description *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Provide a client-ready description detailing compliance parameters."
                    value={finDesc}
                    onChange={(e) => setFinDesc(e.target.value)}
                    className="w-full text-xs p-3.5 bg-white border border-black/10 rounded-2xl focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-black uppercase tracking-widest text-[#0A0A0A]/40 mb-1">Key Selling Features (Comma Separated)</label>
                  <input
                    type="text"
                    placeholder="Up to 5Cr Cover, Tax Free, Sec 80C"
                    value={finFeatures}
                    onChange={(e) => setFinFeatures(e.target.value)}
                    className="w-full text-xs p-3 bg-white border border-black/10 rounded-full focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-black uppercase tracking-widest text-[#0A0A0A]/40 mb-1">Promo Badge (Optional)</label>
                  <input
                    type="text"
                    placeholder="Popular, NRI Best Seller, Stable"
                    value={finBadge}
                    onChange={(e) => setFinBadge(e.target.value)}
                    className="w-full text-xs p-3 bg-white border border-black/10 rounded-full focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-black hover:bg-neutral-850 text-white font-black py-3 rounded-full text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-1 shadow-sm"
                >
                  <Plus className="w-4 h-4 text-white" />
                  {finId ? 'Save Structure Update' : 'Publish Product Portfolio'}
                </button>
              </form>

              {/* Saved list visualizer */}
              <div className="lg:col-span-7 flex flex-col space-y-3">
                <h4 className="font-bold text-sm text-black uppercase tracking-widest border-b border-black/5 pb-2 flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-black" />
                  Target Financial Shelf ({financials.length} options)
                </h4>
                <div className="overflow-y-auto max-h-[50vh] pr-2 space-y-2.5">
                  {financials.map((prod) => (
                    <div key={prod.id} className="p-4 border border-black/5 hover:border-black/15 rounded-2xl flex items-center justify-between gap-4 bg-[#F5F5F4]/30 transition-all">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm text-black">{prod.name}</span>
                          <span className="text-[8px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest bg-black text-[#F5F5F4]">
                            {prod.type}
                          </span>
                          {prod.badge && (
                            <span className="bg-black/5 text-black text-[8px] px-2.5 py-0.5 rounded-full border border-black/10 font-bold uppercase tracking-wider">
                              {prod.badge}
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-black/50 mt-1 font-semibold">{prod.provider}</div>
                        <p className="text-[10px] text-black/60 line-clamp-1 mt-1 italic font-medium">{prod.desc}</p>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0 font-sans">
                        <button
                          onClick={() => handleEditFinancial(prod)}
                          className="p-1.5 rounded-full bg-white border border-black/5 text-black hover:bg-black hover:text-white transition-all shadow-sm"
                          title="Edit"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteFinancial(prod.id)}
                          className={`p-1.5 rounded-full border transition-all shadow-sm ${
                            deleteConfirmFinId === prod.id
                              ? 'bg-red-600 text-white border-red-600 animate-pulse'
                              : 'bg-white border-black/5 text-red-600 hover:bg-red-50 hover:border-red-300'
                          }`}
                          title={deleteConfirmFinId === prod.id ? 'Click again to confirm deletion' : 'Delete'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {financials.length === 0 && (
                    <div className="text-center p-8 border border-dashed border-black/10 rounded-3xl text-black/40 text-xs font-semibold">
                      No active entries in this channel. Fill the form to create products.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2 & 3: PROPERTIES */}
          {(activeTab === 'uae-properties' || activeTab === 'india-properties') && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
              {/* Properties Form */}
              <form
                onSubmit={handleSaveProperty(activeTab === 'uae-properties' ? 'UAE' : 'India')}
                className="lg:col-span-5 bg-[#F5F5F4] p-6 rounded-3xl border border-black/5 space-y-4"
              >
                <div className="flex justify-between items-center pb-2 border-b border-black/5">
                  <h4 className="font-bold text-sm text-black uppercase tracking-tight">
                    {propId ? 'Edit Listed Property' : `Add ${activeTab === 'uae-properties' ? 'UAE' : 'Indian'} Property`}
                  </h4>
                  {propId && (
                    <button type="button" onClick={handleResetPropForm} className="text-[10px] font-black text-black hover:underline uppercase">
                      Reset
                    </button>
                  )}
                </div>

                <div>
                  <label className="block text-[9px] font-black uppercase tracking-widest text-[#0A0A0A]/40 mb-1">Asset Category</label>
                  <select
                    value={propCategory}
                    onChange={(e) => setPropCategory(e.target.value as 'Residential' | 'Commercial')}
                    className="w-full text-xs p-3 bg-white border border-black/10 rounded-full focus:outline-none"
                  >
                    <option value="Residential">Residential Development</option>
                    <option value="Commercial">Commercial Real Estate</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[9px] font-black uppercase tracking-widest text-[#0A0A0A]/40 mb-1">Property Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Marina Serenade Skyline"
                    value={propTitle}
                    onChange={(e) => setPropTitle(e.target.value)}
                    className="w-full text-xs p-3 bg-white border border-black/10 rounded-full focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-black uppercase tracking-widest text-[#0A0A0A]/40 mb-1">Precinct Address *</label>
                  <input
                    type="text"
                    required
                    placeholder={activeTab === 'uae-properties' ? 'e.g. Palm Jumeirah, Dubai' : 'e.g. Bandra West, Mumbai'}
                    value={propLocation}
                    onChange={(e) => setPropLocation(e.target.value)}
                    className="w-full text-xs p-3 bg-white border border-black/10 rounded-full focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-widest text-[#0A0A0A]/40 mb-1">
                      Start Price ({activeTab === 'uae-properties' ? 'AED' : 'INR'}) *
                    </label>
                    <input
                      type="number"
                      required
                      min={100}
                      value={propPrice || ''}
                      onChange={(e) => setPropPrice(Number(e.target.value))}
                      className="w-full text-xs p-3 bg-white border border-black/10 rounded-full focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-widest text-[#0A0A0A]/40 mb-1">Annual Yield (%)</label>
                    <input
                      type="number"
                      step={0.1}
                      min={0}
                      max={25}
                      value={propYield || ''}
                      onChange={(e) => setPropYield(Number(e.target.value))}
                      className="w-full text-xs p-3 bg-white border border-black/10 rounded-full focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-widest text-[#0A0A0A]/40 mb-1">Housing Type</label>
                    <input
                      type="text"
                      placeholder="e.g. 3BHK Penthouse"
                      value={propType}
                      onChange={(e) => setPropType(e.target.value)}
                      className="w-full text-xs p-3 bg-white border border-black/10 rounded-full focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-widest text-[#0A0A0A]/40 mb-1">Card Color Theme</label>
                    <select
                      value={propGradient}
                      onChange={(e) => setPropGradient(e.target.value)}
                      className="w-full text-xs p-3 bg-white border border-black/10 rounded-full focus:outline-none"
                    >
                      <option value="1">Executive Obsidian (1)</option>
                      <option value="2">Charcoal Premium (2)</option>
                      <option value="3">Pacific Corporate (3)</option>
                      <option value="4">Bespoke Amber (4)</option>
                      <option value="5">Sovereign Stone (5)</option>
                      <option value="6">Ocean Breeze Steel (6)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-black uppercase tracking-widest text-[#0A0A0A]/40 mb-1">Key Highlights (Comma Separated)</label>
                  <input
                    type="text"
                    placeholder="Private Pool, Fully Vetted Title, Handover Q1 2028"
                    value={propHighlights}
                    onChange={(e) => setPropHighlights(e.target.value)}
                    className="w-full text-xs p-3 bg-white border border-black/10 rounded-full focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-black hover:bg-neutral-850 text-white font-black py-3 rounded-full text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-1 shadow-sm"
                >
                  <Plus className="w-4 h-4 text-white" />
                  List New Registered Property
                </button>
              </form>

              {/* Properties display list */}
              <div className="lg:col-span-7 flex flex-col space-y-3">
                <h4 className="font-bold text-sm text-black uppercase tracking-widest border-b border-black/5 pb-2 flex items-center gap-2">
                  <Building className="w-4 h-4 text-black" />
                  Listed {activeTab === 'uae-properties' ? 'United Arab Emirates (UAE)' : 'Indian'} Real Estates
                </h4>
                <div className="overflow-y-auto max-h-[50vh] pr-2 space-y-2.5">
                  {properties
                    .filter((p) => p.region === (activeTab === 'uae-properties' ? 'UAE' : 'India'))
                    .map((prop) => (
                      <div key={prop.id} className="p-4 border border-black/5 hover:border-black/15 rounded-2xl flex items-center justify-between gap-4 bg-[#F5F5F4]/30 transition-all font-sans">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap text-left">
                            <span className="font-bold text-sm text-black uppercase tracking-tight">{prop.title}</span>
                            <span className="text-[8px] bg-black text-[#F5F5F4] text-xs px-2.5 py-0.5 rounded-full font-black uppercase tracking-widest">
                              {prop.category}
                            </span>
                          </div>
                          <div className="text-[10px] text-black/50 mt-1 font-semibold text-left">{prop.location}</div>
                          <div className="flex gap-4 mt-1 text-left">
                            <div className="text-[10px] text-black/40 font-semibold">
                              Valuation:{' '}
                              <span className="font-bold text-black uppercase text-xs">
                                {activeTab === 'uae-properties'
                                  ? `AED ${prop.price.toLocaleString('en-AE')}`
                                  : `₹${prop.price.toLocaleString('en-IN')}`}
                              </span>
                            </div>
                            {prop.yield && (
                              <div className="text-[10px] text-black/40 font-semibold">
                                Exp. Yield:{' '}
                                <span className="font-bold text-emerald-600">{prop.yield}%</span>
                              </div>
                            )}
                          </div>
                          <p className="text-[9px] text-black/50 mt-1 truncate max-w-sm font-semibold uppercase tracking-wider text-left">
                            {(prop.highlights || []).join(' • ')}
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <button
                            onClick={() => handleEditProperty(prop)}
                            className="p-1.5 rounded-full bg-white border border-black/5 text-black hover:bg-black hover:text-white transition-all shadow-sm"
                            title="Edit"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProperty(prop.id)}
                            className={`p-1.5 rounded-full border transition-all shadow-sm ${
                              deleteConfirmId === prop.id
                                ? 'bg-red-600 text-white border-red-600 animate-pulse'
                                : 'bg-white border-black/5 text-red-600 hover:bg-red-50 hover:border-red-300'
                            }`}
                            title={deleteConfirmId === prop.id ? 'Click again to confirm deletion' : 'Delete listing'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  {properties.filter((p) => p.region === (activeTab === 'uae-properties' ? 'UAE' : 'India')).length === 0 && (
                    <div className="text-center p-8 border border-dashed border-black/10 rounded-3xl text-black/40 text-xs font-semibold">
                      No active listings under this territory. Create one on the left.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CLIENT INQUIRIES */}
          {activeTab === 'inquiries' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-black/5 pb-3">
                <h4 className="font-bold text-sm text-black uppercase tracking-widest flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-black" />
                  Client Consultations &amp; Leads Capture ({inquiries.length} records)
                </h4>
                {inquiries.length > 0 && (
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleDownloadCSV}
                      className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest flex items-center gap-1.5 hover:underline"
                      title="Download Leads as CSV file"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download CSV
                    </button>
                    <button
                      onClick={async () => {
                        if (!wipeConfirm) {
                          setWipeConfirm(true);
                          setTimeout(() => setWipeConfirm(false), 3050);
                          triggerToast('Click again to wipe all lead database records!', 'success');
                          return;
                        }
                        setWipeConfirm(false);
                        try {
                          if (isOfflineSandbox) {
                            setInquiries([]);
                            localStorage.setItem('sidco9_inquiries', JSON.stringify([]));
                            triggerToast('Lead list cleared.', 'error');
                          } else {
                            const promises = inquiries.map((inq) => deleteDoc(doc(db, 'inquiries', inq.id)));
                            await Promise.all(promises);
                            triggerToast('Lead list cleared.', 'error');
                          }
                        } catch (error) {
                          handleFirestoreError(error, OperationType.DELETE, 'inquiries/all');
                        }
                      }}
                      className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 hover:underline transition-all ${
                        wipeConfirm ? 'text-red-650 hover:text-red-700 font-extrabold scale-102' : 'text-red-500'
                      }`}
                      title="Clear consultation records"
                    >
                      <Trash2 className="w-3" />
                      {wipeConfirm ? 'Click to CONFIRM Database Wipe' : 'Wipe Database History'}
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-2">
                {inquiries.map((inq) => (
                  <div key={inq.id} className="p-5 border border-black/5 hover:border-black/15 rounded-3xl bg-[#F5F5F4]/30 space-y-3 transition-all font-sans">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap text-left">
                          <span className="font-black text-sm text-black uppercase tracking-tight">{inq.name}</span>
                          <span className="text-[8px] bg-black text-[#F5F5F4] px-2.5 py-1 rounded-full font-black uppercase tracking-widest">
                            {inq.interest}
                          </span>
                          
                          {/* Visual Indicator of Status */}
                          {(() => {
                            const currentStatus = inq.status || 'New';
                            if (currentStatus === 'New') {
                              return (
                                <span className="inline-flex items-center gap-1.5 bg-[#CBA135]/10 text-[#CBA135] px-2.5 py-1 rounded-full text-[8px] border border-[#CBA135]/20 font-black uppercase tracking-wider animate-pulse">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#CBA135]" />
                                  New Lead
                                </span>
                              );
                            }
                            if (currentStatus === 'Contacted') {
                              return (
                                <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full text-[8px] border border-emerald-200/50 font-black uppercase tracking-wider">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                  Contacted
                                </span>
                              );
                            }
                            return (
                              <span className="inline-flex items-center gap-1.5 bg-neutral-100 text-neutral-600 px-2.5 py-1 rounded-full text-[8px] border border-neutral-300/40 font-bold uppercase tracking-wider">
                                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                                Archived
                              </span>
                            );
                          })()}

                          {inq.propertyTitle && (
                            <span className="bg-black/5 text-black text-[8px] px-2.5 py-1 rounded-full border border-black/10 font-bold uppercase tracking-wider">
                              Prop Ref: {inq.propertyTitle}
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-black/40 mt-1 font-mono font-semibold flex items-center gap-3">
                          <span>Email: {inq.email}</span>
                          {inq.phone && <span>WhatsApp: {inq.phone}</span>}
                          <span>Time: {new Date(inq.timestamp).toLocaleString()}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        {/* Status Selectors */}
                        <div className="flex items-center gap-1 bg-white p-1 rounded-full border border-black/5 shadow-sm">
                          {(['New', 'Contacted', 'Archived'] as const).map((st) => {
                            const currentStatus = inq.status || 'New';
                            const active = currentStatus === st;
                            return (
                              <button
                                key={st}
                                onClick={() => handleUpdateInquiryStatus(inq, st)}
                                className={`text-[8px] uppercase tracking-wider font-extrabold px-3 py-1 rounded-full transition-all ${
                                  active
                                    ? st === 'New'
                                      ? 'bg-[#CBA135] text-white shadow-sm'
                                      : st === 'Contacted'
                                      ? 'bg-emerald-600 text-white shadow-sm'
                                      : 'bg-neutral-600 text-white shadow-sm'
                                    : 'text-neutral-500 hover:text-black hover:bg-black/5'
                                }`}
                              >
                                {st}
                              </button>
                            );
                          })}
                        </div>
                        
                        <button
                          onClick={() => handleDeleteInquiry(inq.id)}
                          className={`p-1 px-3 py-1 text-[8px] border rounded-full transition-all flex items-center gap-1 font-black uppercase tracking-wider ${
                            deleteConfirmInqId === inq.id
                              ? 'bg-red-600 border-red-600 text-white animate-pulse'
                              : 'bg-white border-black/5 text-red-650 hover:bg-red-50 hover:border-red-200'
                          }`}
                          title={deleteConfirmInqId === inq.id ? 'Click again to confirm delete' : 'Permanently Delete Inquiry'}
                        >
                          <Trash2 className="w-3" />
                          {deleteConfirmInqId === inq.id ? 'Confirm Delete' : 'Delete Log'}
                        </button>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-black/5 text-xs font-mono whitespace-pre-wrap leading-relaxed text-black shadow-sm text-left font-sans">
                      {inq.message}
                    </div>
                  </div>
                ))}

                {inquiries.length === 0 && (
                  <div className="text-center p-12 border border-dashed border-black/10 rounded-3xl text-black/40 space-y-2">
                    <ShieldAlert className="w-8 h-8 text-black/25 mx-auto animate-pulse" />
                    <p className="text-sm font-bold uppercase tracking-wider">No inquiry entries recorded yet.</p>
                    <p className="text-xs font-medium">Submit the contact consultation form on the front page, and leads will log here instantly.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        </>
        )}

        {/* Footer */}
        <div className="p-4 bg-[#F5F5F4] text-center text-[9px] text-[#0A0A0A]/40 font-mono border-t border-black/10 flex justify-between px-6 flex-shrink-0">
          <span>sidco9 Ventures • State Management Module Enforcer</span>
          <span>Dual Zone System Running</span>
        </div>

      </div>
    </div>
  );
}
