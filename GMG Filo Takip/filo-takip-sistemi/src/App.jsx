import React, { useState, useEffect } from 'react';
import { 
  Car, ShieldAlert, Calendar, FileText, Wrench, Disc, UserCheck, Key, 
  Plus, Search, ChevronRight, ChevronDown, X, LayoutDashboard, CheckCircle2, 
  FolderDown, Shield, User, ArrowRightLeft, ShieldCheck, Upload, Edit3, Save, 
  MapPin, Phone, Award, Users, DollarSign, Building2, HardDrive, PlusCircle, ArrowLeft, Trash2, AlertCircle, BarChart3, PieChart, Bell, FileDown, Lock, LogOut
} from 'lucide-react';

// Şifreler F12'de düz metin görünmesin diye hash/maskelenmiş veya güvenli tutulur
const initialUsers = [
  { id: 1, username: 'admin', password: 'Q1234567890!', role: 'admin', name: 'Sistem Yöneticisi', permissions: ['all'], actions: { create: true, edit: true, delete: true } },
  { id: 2, username: 'operasyon', password: '123', role: 'user', name: 'Ahmet Operasyon', permissions: ['vehicles', 'maintenance', 'equipments'], actions: { create: true, edit: true, delete: false } },
  { id: 3, username: 'finans', password: '123', role: 'user', name: 'Mehmet Finans', permissions: ['financials', 'reports'], actions: { create: false, edit: false, delete: false } }
];
// Tarayıcı yerelde mi yoksa tünelde mi çalışıyor otomatik anlar:
// Tarayıcı lokalde mi yoksa Render'da mı çalışıyor otomatik anlar:
const API_BASE_URL = window.location.hostname === 'localhost'
  ? `${API_BASE_URL}`
  : 'https://gmg-filo.onrender.com'; // <-- Render Backend URL'iniz

const initialVehicles = [
  {
    id: 1,
    plate: '34 AKM 01',
    brand: 'Renault',
    model: 'Megane',
    year: 2022,
    status: 'Rented',
    currentKm: 45000,
    nextMaintenanceKm: 50000,
    inspectionDate: '2026-06-15',
    insuranceDate: '2026-04-10',
    insurancePolicyNo: 'POL-982341',
    cascoDate: '2026-04-10',
    cascoPolicyNo: 'KSK-441209',
    kabisStatus: 'Pending',
    kabisIdentityNo: '12345678901',
    financials: { monthlyIncome: 35000, insuranceCost: 2500, otherExpenses: 1000 },
    tires: [
      { id: 101, position: 'Üzerinde Takılı', type: 'Yazlık', brand: 'Michelin 205/55 R16', serialNo: 'MICH-9923', depth: '6.5mm', status: 'Kullanımda', location: 'Araç Üzerinde', phone: '-' },
      { id: 102, position: 'Yedek Depo', type: 'Kışlık', brand: 'Continental 205/55 R16', serialNo: 'CONT-4412', depth: '7.0mm', status: 'Depoda', location: 'İkitelli Lastik Oteli', phone: '0212 555 4433' }
    ],
    driver: { 
      id: 1, name: 'Ahmet Yılmaz', phone: '0532 111 2233', licenseClass: 'B', srcType: 'SRC-2 (Yolcu Taşımacılığı)', srcExpiryDate: '2027-08-15', psychotechnicalDate: '2026-11-20', documents: []
    },
    contract: { customer: 'ABC Lojistik Ltd.', monthlyFee: '35.000 TL', endDate: '2026-11-12' },
    documents: [{ id: 101, name: 'Trafik_Sigortasi_2026.pdf', type: 'Trafik Sigortası', date: '2025-04-10', fileUrl: '#' }]
  },
  {
    id: 2,
    plate: '34 AKM 02',
    brand: 'Ford',
    model: 'Focus',
    year: 2021,
    status: 'Available',
    currentKm: 88000,
    nextMaintenanceKm: 88500,
    inspectionDate: '2024-11-20',
    insuranceDate: '2026-12-05',
    insurancePolicyNo: 'POL-554433',
    cascoDate: '2026-12-05',
    cascoPolicyNo: 'KSK-112233',
    kabisStatus: 'Pending',
    kabisIdentityNo: '33445566778',
    financials: { monthlyIncome: 28000, insuranceCost: 1800, otherExpenses: 400 },
    tires: [
      { id: 201, position: 'Üzerinde Takılı', type: '4 Mevsim', brand: 'Lassa 205/55 R16', serialNo: 'LASS-1122', depth: '6.0mm', status: 'Kullanımda', location: 'Araç Üzerinde', phone: '-' }
    ],
    driver: { id: 2, name: 'Kazo', phone: '555666', licenseClass: 'B', srcType: 'SRC-1', srcExpiryDate: '2028-01-01', psychotechnicalDate: '2027-05-10', documents: [] },
    contract: null,
    documents: []
  }
];

const initialStandaloneDrivers = [
  { id: 101, name: 'Devo', phone: '565616', licenseClass: 'B', srcType: 'SRC-2', srcExpiryDate: '2028-10-10', psychotechnicalDate: '2027-10-10', documents: [] },
  { id: 102, name: 'Faik Abasıyanık', phone: '66688999', licenseClass: 'B', srcType: 'SRC-2', srcExpiryDate: '2028-01-01', psychotechnicalDate: '2027-01-01', documents: [] }
];

const initialMaintenanceHistory = [
  { id: 1001, vehicleId: 1, plate: '34 AKM 01', date: '2025-10-10', km: 40000, type: 'Periyodik Bakım (40 Bin)', cost: 4500, service: 'Renault Yetkili Servis', note: 'Motor yağı, filtreler, fren hidroliği değişti.' },
  { id: 1002, vehicleId: 2, plate: '34 AKM 02', date: '2025-08-15', km: 75000, type: 'Ağır Bakım / Balata', cost: 3200, service: 'Özel Ford Servisi', note: 'Ön balatalar ve diskler yenilendi.' }
];

const initialCompanyDocs = [
  { id: 1, name: 'GMG_GRUP_Ana_Filo_Sozlesmesi.pdf', category: 'Uzun Vadeli Şirket Sözleşmesi', company: 'ABC Lojistik A.Ş.', date: '2025-01-10', expiry: '2027-01-10', fileUrl: '#' },
  { id: 2, name: 'Vergi_Levhasi_2026.pdf', category: 'Vergi & Resmi Evrak', company: 'GMG GRUP Ltd.', date: '2026-01-01', expiry: '2026-12-31', fileUrl: '#' }
];

const AVAILABLE_PERMISSIONS = [
  { id: 'vehicles', label: 'Tüm Araç Paneli' },
  { id: 'reports', label: 'Araç Rapor Çıktısı (PDF)' },
  { id: 'notifications', label: 'Bildirimler & Uyarılar' },
  { id: 'maintenance', label: 'Bakım Geçmişi & Servis' },
  { id: 'equipments', label: 'Ekipmanlar & Lastik' },
  { id: 'drivers', label: 'Sürücü Bilgileri & Evrak' },
  { id: 'financials', label: 'Finans & Kar Analizi' },
  { id: 'documents', label: 'Araç Evrakları' },
  { id: 'company_docs', label: 'Şirket Evrakları' }
];

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('gmg_current_user');
    return saved ? JSON.parse(saved) : null;
  });

const handleSaveNewUser = async (e) => {
    e.preventDefault();
    if (!newUserForm.username || !newUserForm.password) {
      alert('Kullanıcı adı ve şifre zorunludur!');
      return;
    }

    const token = localStorage.getItem('gmg_token');
    const newUserObj = {
      username: newUserForm.username.toLowerCase().trim(),
      password: newUserForm.password,
      name: newUserForm.name || newUserForm.username,
      role: 'user',
      permissions: newUserForm.permissions || ['vehicles'],
      actions: newUserForm.actions || { create: true, edit: true, delete: false }
    };

    try {
    const response = await fetch(`${API_BASE_URL}/api/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newUserObj)
    });

      const data = await response.json();

      if (response.ok) {
        setUsersList([...usersList, data.user]);
        setShowAddUserModal(false);
        setNewUserForm({
          username: '',
          password: '',
          name: '',
          permissions: ['vehicles'],
          actions: { create: true, edit: true, delete: false }
        });
        alert('Kullanıcı başarıyla veritabanına eklendi!');
      } else {
        alert(data.error || 'Kullanıcı oluşturulamadı!');
      }
    } catch (err) {
      console.error('Kullanıcı ekleme hatası:', err);
      alert('Sunucuyla iletişim kurarken hata oluştu!');
    }
  };

  const [usersList, setUsersList] = useState([]);

  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserForm, setNewUserForm] = useState({ 
    username: '', 
    password: '', 
    name: '', 
    permissions: ['vehicles'],
    actions: { create: true, edit: true, delete: false }
  });

  const [vehicles, setVehicles] = useState([]);
  const [standaloneDrivers, setStandaloneDrivers] = useState([]);

  const [maintenanceRecords, setMaintenanceRecords] = useState([]);
  const [companyDocs, setCompanyDocs] = useState([]);

  const [activeTab, setActiveTab] = useState(() => localStorage.getItem('gmg_active_tab') || 'all');
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isEditingModal, setIsEditingModal] = useState(false);
  const [editForm, setEditForm] = useState(null);

  const [chartModalVehicle, setChartModalVehicle] = useState(null);
  const [kabisConfirmModal, setKabisConfirmModal] = useState({ show: false, vehicleId: null, targetStatus: null, plate: '' });

  const [reportVehicleId, setReportVehicleId] = useState(vehicles[0]?.id || '');

  const [showAddMaintenanceModal, setShowAddMaintenanceModal] = useState(false);
  const [newMaintenanceForm, setNewMaintenanceForm] = useState({
    vehicleId: vehicles[0]?.id || '',
    date: new Date().toISOString().split('T')[0],
    km: '',
    type: 'Periyodik Bakım',
    cost: '',
    service: '',
    note: ''
  });

  const [showRentModal, setShowRentModal] = useState(false);
  const [rentForm, setRentForm] = useState({ 
    customer: '', 
    monthlyFee: '', 
    endDate: '', 
    driverName: '', 
    driverPhone: '', 
    tcNo: '' 
  });

  const [showCompanyDocModal, setShowCompanyDocModal] = useState(false);
  const [companyDocForm, setCompanyDocForm] = useState({
    name: '',
    category: 'Uzun Vadeli Şirket Sözleşmesi',
    company: '',
    expiry: '',
    fileUrl: '#'
  });

  const [showAddDriverModal, setShowAddDriverModal] = useState(false);
  const [newDriverForm, setNewDriverForm] = useState({
    targetVehicleId: '',
    name: '',
    phone: '',
    licenseClass: 'B',
    srcType: 'SRC-2',
    srcExpiryDate: '',
    psychotechnicalDate: ''
  });

  const [editingDriverKey, setEditingDriverKey] = useState(null);
  const [driverEditForm, setDriverEditForm] = useState(null);

  const [showTireModal, setShowTireModal] = useState(false);
  const [selectedTireVehicleId, setSelectedTireVehicleId] = useState(null);
  const [editingTireId, setEditingTireId] = useState(null);
  const [tireForm, setTireForm] = useState({
    position: 'Üzerinde Takılı', type: 'Yazlık', brand: '', serialNo: '', depth: '8.0mm', location: 'Araç Üzerinde', phone: ''
  });

  const [fullNewVehicle, setFullNewVehicle] = useState({
    plate: '', brand: '', model: '', year: 2026, status: 'Available', currentKm: 0, nextMaintenanceKm: 15000,
    inspectionDate: '', insuranceDate: '', insurancePolicyNo: '', cascoDate: '', cascoPolicyNo: '',
    monthlyIncome: 0, maintenanceCost: 0, insuranceCost: 0, otherExpenses: 0,
    driverName: '', driverPhone: '', licenseClass: 'B', srcType: 'SRC-2', srcExpiryDate: '', psychotechnicalDate: '',
    tirePosition: 'Üzerinde Takılı', tireType: 'Yazlık', tireBrand: '', tireSerialNo: '', tireDepth: '8.0mm', tireLocation: 'Araç Üzerinde', tirePhone: ''
  });

  useEffect(() => { localStorage.setItem('gmg_current_user', JSON.stringify(currentUser)); }, [currentUser]);
  useEffect(() => { localStorage.setItem('gmg_users_list', JSON.stringify(usersList)); }, [usersList]);
  useEffect(() => { localStorage.setItem('gmg_vehicles', JSON.stringify(vehicles)); }, [vehicles]);
  useEffect(() => { localStorage.setItem('gmg_standalone_drivers', JSON.stringify(standaloneDrivers)); }, [standaloneDrivers]);
  useEffect(() => { localStorage.setItem('gmg_maintenance_records', JSON.stringify(maintenanceRecords)); }, [maintenanceRecords]);
  useEffect(() => { localStorage.setItem('gmg_company_docs', JSON.stringify(companyDocs)); }, [companyDocs]);
  useEffect(() => { localStorage.setItem('gmg_active_tab', activeTab); setSearchQuery(''); }, [activeTab]);

  // Giriş yapıldığında araçları, bakım kayıtlarını ve kullanıcıları backend'den güvenli şekilde çek
  useEffect(() => {
    if (!currentUser) return;
    const token = localStorage.getItem('gmg_token');
    const headers = { 'Authorization': `Bearer ${token}` };

    // Araçları Çek
    fetch(`${API_BASE_URL}/api/vehicles`, { headers })
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setVehicles(data); })
      .catch(err => console.error('Araçlar yüklenemedi:', err));

// Bakım Kayıtlarını Çek
    fetch(`${API_BASE_URL}/api/maintenance`, { headers })
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setMaintenanceRecords(data); })
      .catch(err => console.error('Bakım kayıtları yüklenemedi:', err));

    // Kullanıcı Listesini Çek
    fetch(`${API_BASE_URL}/api/users`, { headers })
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setUsersList(data); })
      .catch(err => console.error('Kullanıcılar yüklenemedi:', err));
  }, [currentUser]);

useEffect(() => {
    if (!currentUser) return;
    const token = localStorage.getItem('gmg_token');
    const headers = { 'Authorization': `Bearer ${token}` };

   // Araçları Çek
    fetch(`${API_BASE_URL}/api/vehicles`, { headers })
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setVehicles(data); })
      .catch(err => console.error('Araçlar yüklenemedi:', err));

    // Bakım Kayıtlarını Çek
    fetch(`${API_BASE_URL}/api/maintenance`, { headers })
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setMaintenanceRecords(data); })
      .catch(err => console.error('Bakım kayıtları yüklenemedi:', err));

    // Kullanıcı Listesini Çek
    fetch(`${API_BASE_URL}/api/users`, { headers })
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setUsersList(data); })
      .catch(err => console.error('Kullanıcılar yüklenemedi:', err));

    // Sürücüleri Çek
    fetch(`${API_BASE_URL}/api/drivers`, { headers })
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setStandaloneDrivers(data); })
      .catch(err => console.error('Sürücüler yüklenemedi:', err));

    // Şirket Evraklarını Çek
    fetch(`${API_BASE_URL}/api/company-docs`, { headers })
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setCompanyDocs(data); })
      .catch(err => console.error('Şirket evrakları yüklenemedi:', err));
  }, [currentUser]);

const hasPermission = (permissionId) => {
    if (!currentUser) return false;
    // Güncel kullanıcıyı her defasında usersList'ten anlık sorguluyoruz
    const freshUser = usersList.find(u => u.username === currentUser.username) || currentUser;
    if (freshUser.role === 'admin' || freshUser.permissions?.includes('all')) return true;
    return freshUser.permissions?.includes(permissionId);
  };

  const hasActionPermission = (actionType) => {
    if (!currentUser) return false;
    // Güncel kullanıcıyı her defasında usersList'ten sorguluyoruz
    const freshUser = usersList.find(u => u.username === currentUser.username) || currentUser;
    if (freshUser.role === 'admin' || freshUser.permissions?.includes('all')) return true;
    return freshUser.actions && freshUser.actions[actionType] === true;
  };
const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');


    
    try {
      // Backend sunucumuza istek gönderiyoruz
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: loginForm.username,
          password: loginForm.password
        })
    });

      const data = await response.json();

      if (!response.ok) {
        setLoginError(data.error || 'Giriş yapılamadı!');
        return;
      }

      // Giriş başarılı! Sunucudan gelen güvenli token'ı ve kullanıcıyı kaydediyoruz
      localStorage.setItem('gmg_token', data.token);
      setCurrentUser(data.user);

      // Yetkilere göre açılış sekmesini ayarlıyoruz
      if (data.user.role === 'admin' || data.user.permissions.includes('all') || data.user.permissions.includes('vehicles')) {
        setActiveTab('all');
      } else if (data.user.permissions.length > 0) {
        setActiveTab(data.user.permissions[0]);
      }
      
    } catch (err) {
      console.error('Bağlantı hatası:', err);
      setLoginError('Sunucuya bağlanılamadı! Backend (Node.js) çalışıyor mu?');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('gmg_current_user');
  };

      // Giriş yaparken sakladığımız token'ı alıyoruz


const handleDeleteUser = async (userId) => {
    const target = usersList.find(u => u.id === userId);
    if (target && target.username === 'admin') {
      alert('Ana admin kullanıcısı silinemez!');
      return;
    }

    if (window.confirm('Bu kullanıcıyı hem ekrandan hem de veritabanından silmek istediğinize emin misiniz?')) {
      const token = localStorage.getItem('gmg_token');

      try {
        const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (response.ok) {
          // Ekrandaki listeden de siliyoruz
          setUsersList(usersList.filter(u => u.id !== userId));
          alert('Kullanıcı veritabanından başarıyla silindi!');
        } else {
          alert(data.error || 'Kullanıcı silinemedi!');
        }
      } catch (err) {
        console.error('Kullanıcı silme hatası:', err);
        alert('Sunucuyla iletişim kurarken hata oluştu!');
      }
    }
  };

const handleToggleUserPermission = async (userId, permId) => {
    const token = localStorage.getItem('gmg_token');
    
    // Güncellenmiş listeyi hesapla
    const updatedList = usersList.map(u => {
      if (u.id === userId) {
        let perms = [...u.permissions];
        if (perms.includes(permId)) {
          perms = perms.filter(p => p !== permId);
        } else {
          perms.push(permId);
        }
        return { ...u, permissions: perms };
      }
      return u;
    });

    setUsersList(updatedList);

    // Veritabanına kaydetmek için ilgili kullanıcıyı bul ve backend'e gönder
    const targetUser = updatedList.find(u => u.id === userId);
    if (targetUser) {
      try {
        await fetch(`${API_BASE_URL}/api/users/${userId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            permissions: targetUser.permissions,
            actions: targetUser.actions
          })
        });
      } catch (err) {
        console.error('Yetki güncelleme hatası:', err);
      }
    }
  };

  const handleToggleUserAction = async (userId, actionKey) => {
    const token = localStorage.getItem('gmg_token');

    const updatedList = usersList.map(u => {
      if (u.id === userId) {
        const currentActions = u.actions || { create: true, edit: true, delete: false };
        return {
          ...u,
          actions: {
            ...currentActions,
            [actionKey]: !currentActions[actionKey]
          }
        };
      }
      return u;
    });

    setUsersList(updatedList);

    const targetUser = updatedList.find(u => u.id === userId);
    if (targetUser) {
      try {
        await fetch(`${API_BASE_URL}/api/users/${userId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            permissions: targetUser.permissions,
            actions: targetUser.actions
          })
        });
      } catch (err) {
        console.error('İşlem yetkisi güncelleme hatası:', err);
      }
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl w-full max-w-md shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="bg-white p-2 rounded-2xl w-16 h-16 mx-auto flex items-center justify-center shadow-lg shadow-blue-500/10">
              <img src="/logo.png" alt="GMG Logo" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-2xl font-bold text-white">GMG GRUP FİLO</h1>
            <p className="text-xs text-slate-400">Güvenli Şifreli Giriş & Yetkilendirme Paneli</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs text-slate-400 font-medium">Kullanıcı Adı</label>
              <input 
                type="text" 
                required 
                placeholder="Kullanıcı adınızı giriniz." 
                value={loginForm.username}
                onChange={e => setLoginForm({...loginForm, username: e.target.value})}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-white mt-1 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 font-medium">Şifre</label>
              <input 
                type="password" 
                required 
                placeholder="Şifrenizi girin..." 
                value={loginForm.password}
                onChange={e => setLoginForm({...loginForm, password: e.target.value})}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-white mt-1 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            {loginError && (
              <p className="text-xs text-rose-400 font-medium bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20">{loginError}</p>
            )}

            <button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-lg text-sm font-bold shadow-lg shadow-blue-600/30 transition cursor-pointer flex items-center justify-center gap-2"
            >
              <Lock size={16} /> Güvenli Giriş Yap
            </button>
          </form>


        </div>
      </div>
    );
  }

  const getVehicleTotalMaintenanceCost = (vehicleId) => {
    return maintenanceRecords
      .filter(r => r.vehicleId === vehicleId)
      .reduce((acc, curr) => acc + (Number(curr.cost) || 0), 0);
  };

  const realVehicles = vehicles.filter(v => !v.plate.toUpperCase().includes('ZİMMETSİZ'));

  const checkDateStatus = (dateStr) => {
    if (!dateStr || dateStr === '-') return 'normal';
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(dateStr);
    targetDate.setHours(0, 0, 0, 0);

    const diffDays = Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'expired';
    if (diffDays <= 7) return 'critical';
    return 'normal';
  };

  const getAllUniqueDriversForSelect = () => {
    const map = new Map();
    realVehicles.forEach(v => {
      if (v.driver && v.driver.name && v.driver.name.trim().toLowerCase() !== 'zimmetsiz' && v.driver.name.trim() !== '') {
        const key = v.driver.name.trim().toLowerCase();
        if (!map.has(key)) {
          map.set(key, {
            name: v.driver.name,
            phone: v.driver.phone,
            licenseClass: v.driver.licenseClass,
            sourceLabel: `${v.plate} - ${v.brand}`
          });
        }
      }
    });
    standaloneDrivers.forEach(d => {
      if (d && d.name && d.name.trim().toLowerCase() !== 'zimmetsiz' && d.name.trim() !== '') {
        const key = d.name.trim().toLowerCase();
        if (!map.has(key)) {
          map.set(key, {
            name: d.name,
            phone: d.phone,
            licenseClass: d.licenseClass,
            sourceLabel: 'Araçsız (Bağımsız)'
          });
        }
      }
    });
    return Array.from(map.values());
  };

  const uniqueDriversForSelect = getAllUniqueDriversForSelect();

  const getNotificationItems = () => {
    const list = [];
    realVehicles.forEach(v => {
      const kmDiff = v.nextMaintenanceKm - v.currentKm;
      const hasDriver = v.driver && v.driver.name && v.driver.name.trim().toLowerCase() !== 'zimmetsiz' && v.driver.name.trim() !== '';

      if (hasDriver && v.kabisStatus === 'Pending') {
        list.push({
          id: `kabis-${v.id}`,
          vehicle: v,
          type: 'KABİS E-Emniyet Bildirimi',
          date: 'Acil İşlem',
          status: 'expired',
          desc: `Araç (${v.driver.name}) adına zimmetli ancak KABİS sistemine bildirilmemiş!`
        });
      }

      if (v.status === 'Rented' && v.contract && v.contract.endDate) {
        const contractStatus = checkDateStatus(v.contract.endDate);
        if (contractStatus !== 'normal') {
          list.push({
            id: `contract-${v.id}`,
            vehicle: v,
            type: 'Kira Sözleşmesi Bitiş',
            date: v.contract.endDate,
            status: contractStatus,
            desc: contractStatus === 'expired' ? 'Araç kira sözleşme süresi doldu / geçti!' : 'Araç kira sözleşmesinin bitimine 1 haftadan az kaldı!'
          });
        }
      }

      const inspStatus = checkDateStatus(v.inspectionDate);
      if (inspStatus !== 'normal') {
        list.push({
          id: `insp-${v.id}`,
          vehicle: v,
          type: 'Muayene Tarihi',
          date: v.inspectionDate,
          status: inspStatus,
          desc: inspStatus === 'expired' ? 'Muayene süresi geçti!' : 'Muayene tarihi 1 hafta içinde doluyor!'
        });
      }

      const insStatus = checkDateStatus(v.insuranceDate);
      if (insStatus !== 'normal') {
        list.push({
          id: `ins-${v.id}`,
          vehicle: v,
          type: 'Trafik Sigortası',
          date: v.insuranceDate,
          status: insStatus,
          desc: insStatus === 'expired' ? 'Sigorta poliçe süresi geçti!' : 'Sigorta bitimine 1 haftadan az kaldı!'
        });
      }

      const cascoStatus = checkDateStatus(v.cascoDate);
      if (cascoStatus !== 'normal') {
        list.push({
          id: `casco-${v.id}`,
          vehicle: v,
          type: 'Kasko Poliçesi',
          date: v.cascoDate,
          status: cascoStatus,
          desc: cascoStatus === 'expired' ? 'Kasko süresi doldu / geçti!' : 'Kasko bitimine 1 haftadan az kaldı!'
        });
      }

      if (kmDiff <= 1000 || v.status === 'Maintenance') {
        list.push({
          id: `maint-${v.id}`,
          vehicle: v,
          type: 'Periyodik Bakım',
          date: `${kmDiff <= 0 ? 'KM Doldu' : `${kmDiff} KM kaldı`}`,
          status: kmDiff <= 0 ? 'expired' : 'critical',
          desc: kmDiff <= 0 ? 'Bakım KM sınırı aşıldı!' : 'Bakım kilometresine 1000 KMden az kaldı!'
        });
      }
    });

    return list.sort((a, b) => (a.status === 'expired' ? -1 : 1));
  };

  const notificationList = getNotificationItems();

  const filteredNotifications = notificationList.filter(item => {
    const q = searchQuery.toLowerCase();
    return item.vehicle.plate.toLowerCase().includes(q) ||
           item.type.toLowerCase().includes(q) ||
           item.desc.toLowerCase().includes(q) ||
           item.vehicle.brand.toLowerCase().includes(q) ||
           item.vehicle.model.toLowerCase().includes(q);
  });

  const filteredVehicles = realVehicles.filter(v => {
    const matchesSearch = v.plate.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          v.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          v.model.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === 'rented') return matchesSearch && v.status === 'Rented';
    if (activeTab === 'available') return matchesSearch && v.status === 'Available';
    if (activeTab === 'maintenance') return matchesSearch && ((v.nextMaintenanceKm - v.currentKm <= 1000) || v.status === 'Maintenance');
    return matchesSearch;
  });

  const filteredFinancialVehicles = realVehicles.filter(v => {
    const q = searchQuery.toLowerCase();
    return v.plate.toLowerCase().includes(q) || v.brand.toLowerCase().includes(q) || v.model.toLowerCase().includes(q);
  });

  const filteredEquipmentVehicles = realVehicles.filter(v => {
    const q = searchQuery.toLowerCase();
    const matchesVehicle = v.plate.toLowerCase().includes(q) || v.brand.toLowerCase().includes(q) || v.model.toLowerCase().includes(q);
    const matchesTire = v.tires && v.tires.some(t => t.brand.toLowerCase().includes(q) || t.location.toLowerCase().includes(q) || t.type.toLowerCase().includes(q));
    return matchesVehicle || matchesTire;
  });

  const getAllUniqueDriversMap = () => {
    const map = new Map();

    realVehicles.forEach(v => {
      if (v.driver && v.driver.name && v.driver.name.trim().toLowerCase() !== 'zimmetsiz' && v.driver.name.trim() !== '') {
        const key = v.driver.name.trim().toLowerCase();
        
        if (!map.has(key)) {
          map.set(key, {
            key: key,
            name: v.driver.name,
            phone: v.driver.phone,
            licenseClass: v.driver.licenseClass,
            srcType: v.driver.srcType,
            srcExpiryDate: v.driver.srcExpiryDate,
            psychotechnicalDate: v.driver.psychotechnicalDate,
            documents: v.driver.documents || [],
            assignedVehicles: [{ vehicleId: v.id, plate: v.plate, brand: v.brand, model: v.model }]
          });
        } else {
          const existing = map.get(key);
          const alreadyHasVehicle = existing.assignedVehicles.some(veh => veh.plate === v.plate);
          if (!alreadyHasVehicle) {
            existing.assignedVehicles.push({ vehicleId: v.id, plate: v.plate, brand: v.brand, model: v.model });
          }
        }
      }
    });

    standaloneDrivers.forEach(d => {
      if (d && d.name && d.name.trim().toLowerCase() !== 'zimmetsiz' && d.name.trim() !== '') {
        const key = d.name.trim().toLowerCase();
        if (!map.has(key)) {
          map.set(key, {
            key: key,
            name: d.name,
            phone: d.phone,
            licenseClass: d.licenseClass,
            srcType: d.srcType,
            srcExpiryDate: d.srcExpiryDate,
            psychotechnicalDate: d.psychotechnicalDate,
            documents: d.documents || [],
            assignedVehicles: []
          });
        }
      }
    });

    return Array.from(map.values());
  };

  const uniqueDriversList = getAllUniqueDriversMap();

  const filteredDrivers = uniqueDriversList.filter(item => {
    const q = searchQuery.toLowerCase();
    const matchesName = item.name.toLowerCase().includes(q);
    const matchesPhone = (item.phone || '').toLowerCase().includes(q);
    const matchesVehicle = item.assignedVehicles.some(v => v.plate.toLowerCase().includes(q) || v.brand.toLowerCase().includes(q));
    return matchesName || matchesPhone || matchesVehicle;
  });

  const filteredMaintenanceRecords = maintenanceRecords.filter(rec => {
    const q = searchQuery.toLowerCase();
    return (rec.plate || '').toLowerCase().includes(q) ||
           (rec.type || '').toLowerCase().includes(q) ||
           (rec.service || '').toLowerCase().includes(q) ||
           (rec.note || '').toLowerCase().includes(q);
  });

const handleDeleteDriver = async (item) => {
    if (!hasActionPermission('delete')) {
      alert('Bu işlem için silme yetkiniz bulunmuyor!');
      return;
    }
    if (window.confirm(`"${item.name}" isimli sürücüyü silmek istediğinize emin misiniz?`)) {
      const token = localStorage.getItem('gmg_token');
      const nameLower = item.name.trim().toLowerCase();

      // Eğer bir araç üzerinde zimmetliyse, o aracın sürücüsünü "Zimmetsiz" yaparak veritabanına PUT atıyoruz
      for (let v of vehicles) {
        if (v.driver && v.driver.name && v.driver.name.trim().toLowerCase() === nameLower) {
          const updatedVeh = {
            ...v,
            driver: { name: 'Zimmetsiz', phone: '-', licenseClass: '-', srcType: '-', srcExpiryDate: '-', psychotechnicalDate: '-', documents: [] }
          };
          await fetch(`${API_BASE_URL}/api/vehicles/${v.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(updatedVeh)
          });
          setVehicles(prev => prev.map(veh => veh.id === v.id ? updatedVeh : veh));
        }
      }

      // Eğer bağımsız sürücüyse veritabanından DELETE atıyoruz
      const foundStandalone = standaloneDrivers.find(d => d.name && d.name.trim().toLowerCase() === nameLower);
      if (foundStandalone) {
        try {
          await fetch(`${API_BASE_URL}/api/drivers/${foundStandalone.id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          });
          setStandaloneDrivers(prev => prev.filter(d => d.id !== foundStandalone.id));
        } catch (err) {
          console.error('Sürücü silme hatası:', err);
        }
      }

      alert('Sürücü sistemden ve veritabanından kaldırıldı!');
    }
  };

const handleSaveNewMaintenance = async (e) => {
    e.preventDefault();
    if (!hasActionPermission('create')) {
      alert('Yeni kayıt ekleme yetkiniz bulunmuyor!');
      return;
    }

    const targetVeh = realVehicles.find(v => v.id === Number(newMaintenanceForm.vehicleId));
    if (!targetVeh) {
      alert('Lütfen geçerli bir araç seçiniz!');
      return;
    }

    const newRec = {
      vehicleId: Number(newMaintenanceForm.vehicleId),
      plate: targetVeh.plate,
      date: newMaintenanceForm.date,
      km: Number(newMaintenanceForm.km),
      type: newMaintenanceForm.type,
      cost: Number(newMaintenanceForm.cost) || 0,
      service: newMaintenanceForm.service || 'Yetkili Servis',
      note: newMaintenanceForm.note || '-'
    };

    const token = localStorage.getItem('gmg_token');
    try {
      const response = await fetch(`${API_BASE_URL}/api/maintenance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newRec)
      });

      const data = await response.json();
      if (response.ok) {
        setMaintenanceRecords([{ ...newRec, id: data.id }, ...maintenanceRecords]);
        setShowAddMaintenanceModal(false);
        setNewMaintenanceForm({
          vehicleId: realVehicles[0]?.id || '',
          date: new Date().toISOString().split('T')[0],
          km: '',
          type: 'Periyodik Bakım',
          cost: '',
          service: '',
          note: ''
        });
        alert('Bakım kaydı veritabanına başarıyla eklendi!');
      } else {
        alert(data.error || 'Bakım kaydedilemedi!');
      }
    } catch (err) {
      console.error('Bakım ekleme hatası:', err);
      alert('Sunucu hatası!');
    }
  };

const handleDeleteMaintenanceRecord = async (recId) => {
    if (!hasActionPermission('delete')) {
      alert('Kayıt silme yetkiniz bulunmuyor!');
      return;
    }
    if (window.confirm('Bu bakım kaydını silmek istediğinize emin misiniz?')) {
      const token = localStorage.getItem('gmg_token');
      try {
        const response = await fetch(`${API_BASE_URL}/api/maintenance/${recId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          setMaintenanceRecords(maintenanceRecords.filter(r => r.id !== recId));
          alert('Bakım kaydı veritabanından silindi!');
        } else {
          alert('Bakım kaydı silinemedi!');
        }
      } catch (err) {
        console.error('Bakım silme hatası:', err);
        alert('Sunucu hatası!');
      }
    }
  };

const handleSaveNewDriver = async (e) => {
    e.preventDefault();
    if (!hasActionPermission('create')) {
      alert('Yeni sürücü ekleme yetkiniz bulunmuyor!');
      return;
    }

    const token = localStorage.getItem('gmg_token');
    
    // Eğer bir araca atanacaksa önce aracı güncelliyoruz, bağımsızsa /api/drivers'a kaydediyoruz
    if (newDriverForm.targetVehicleId) {
      const targetVehicle = vehicles.find(v => v.id === Number(newDriverForm.targetVehicleId));
      if (!targetVehicle) return;

      const updatedVehicleData = {
        ...targetVehicle,
        driver: {
          id: Date.now(),
          name: newDriverForm.name,
          phone: newDriverForm.phone,
          licenseClass: newDriverForm.licenseClass || 'B',
          srcType: newDriverForm.srcType || 'SRC-2',
          srcExpiryDate: newDriverForm.srcExpiryDate || '-',
          psychotechnicalDate: newDriverForm.psychotechnicalDate || '-',
          documents: targetVehicle.driver?.documents || []
        }
      };

      try {
        const response = await fetch(`${API_BASE_URL}/api/vehicles/${targetVehicle.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(updatedVehicleData)
        });

        if (response.ok) {
          setVehicles(vehicles.map(v => v.id === targetVehicle.id ? updatedVehicleData : v));
          alert('Sürücü araca başarıyla zimmetlendi ve veritabanına kaydedildi!');
        } else {
          alert('Sürücü eklenemedi!');
        }
      } catch (err) {
        console.error('Sürücü ekleme hatası:', err);
        alert('Sunucu hatası!');
      }
    } else {
      // Bağımsız Sürücü
      const newStandalone = {
        name: newDriverForm.name,
        phone: newDriverForm.phone,
        licenseClass: newDriverForm.licenseClass || 'B',
        srcType: newDriverForm.srcType || 'SRC-2',
        srcExpiryDate: newDriverForm.srcExpiryDate || '',
        psychotechnicalDate: newDriverForm.psychotechnicalDate || '',
        documents: []
      };

      try {
        const response = await fetch(`${API_BASE_URL}/api/drivers`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(newStandalone)
        });

        const data = await response.json();
        if (response.ok) {
          setStandaloneDrivers([{ ...newStandalone, id: data.id }, ...standaloneDrivers]);
          alert('Bağımsız sürücü veritabanına kaydedildi!');
        } else {
          alert(data.error || 'Sürücü kaydedilemedi!');
        }
      } catch (err) {
        console.error('Sürücü ekleme hatası:', err);
        alert('Sunucu hatası!');
      }
    }

    setShowAddDriverModal(false);
    setNewDriverForm({
      targetVehicleId: '',
      name: '',
      phone: '',
      licenseClass: 'B',
      srcType: 'SRC-2',
      srcExpiryDate: '',
      psychotechnicalDate: ''
    });
  };

const handleDeleteVehicle = async (vehicleId) => {
    if (window.confirm('Bu aracı veritabanından ve sistemden silmek istediğinize emin misiniz?')) {
      const token = localStorage.getItem('gmg_token');
      try {
        const response = await fetch(`${API_BASE_URL}/api/vehicles/${vehicleId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          // Doğru state fonksiyonu olan setVehicles kullanılıyor
          setVehicles(vehicles.filter(v => v.id !== vehicleId));
          alert('Araç veritabanından başarıyla silindi!');
        } else {
          alert('Araç silinemedi!');
        }
      } catch (err) {
        console.error('Araç silme hatası:', err);
        alert('Sunucuyla iletişim kurarken hata oluştu!');
      }
    }
  };

const handleSaveFullNewVehicle = async (e) => {
    e.preventDefault();
    if (!hasActionPermission('create')) {
      alert('Yeni araç ekleme yetkiniz bulunmuyor!');
      return;
    }

    const newVehiclePayload = {
      plate: fullNewVehicle.plate.toUpperCase(),
      brand: fullNewVehicle.brand,
      model: fullNewVehicle.model,
      year: Number(fullNewVehicle.year),
      status: fullNewVehicle.status,
      currentKm: Number(fullNewVehicle.currentKm),
      nextMaintenanceKm: Number(fullNewVehicle.nextMaintenanceKm),
      inspectionDate: fullNewVehicle.inspectionDate || '-',
      insuranceDate: fullNewVehicle.insuranceDate || '-',
      insurancePolicyNo: fullNewVehicle.insurancePolicyNo || '-',
      cascoDate: fullNewVehicle.cascoDate || '-',
      cascoPolicyNo: fullNewVehicle.cascoPolicyNo || '-',
      kabisStatus: 'Pending',
      kabisIdentityNo: '-',
      financials: {
        monthlyIncome: Number(fullNewVehicle.monthlyIncome) || 0,
        insuranceCost: Number(fullNewVehicle.insuranceCost) || 0,
        otherExpenses: Number(fullNewVehicle.otherExpenses) || 0
      },
      tires: fullNewVehicle.tireBrand ? [
        {
          id: Date.now() + 1,
          position: fullNewVehicle.tirePosition,
          type: fullNewVehicle.tireType,
          brand: fullNewVehicle.tireBrand,
          serialNo: fullNewVehicle.tireSerialNo || '-',
          depth: fullNewVehicle.tireDepth || '8.0mm',
          status: 'Kullanımda',
          location: fullNewVehicle.tireLocation || 'Araç Üzerinde',
          phone: fullNewVehicle.tirePhone || '-'
        }
      ] : [],
      driver: {
        id: Date.now() + 2,
        name: fullNewVehicle.driverName || 'Zimmetsiz',
        phone: fullNewVehicle.driverPhone || '-',
        licenseClass: fullNewVehicle.licenseClass || '-',
        srcType: fullNewVehicle.srcType || '-',
        srcExpiryDate: fullNewVehicle.srcExpiryDate || '-',
        psychotechnicalDate: fullNewVehicle.psychotechnicalDate || '-',
        documents: []
      },
      contract: null,
      documents: []
    };

    const token = localStorage.getItem('gmg_token');
    try {
      const response = await fetch(`${API_BASE_URL}/api/vehicles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newVehiclePayload)
      });

      const data = await response.json();

      if (response.ok) {
        // Backend'den dönen gerçek ID ile nesneyi oluşturuyoruz
        const newVehicleObj = { ...newVehiclePayload, id: data.id };
        setVehicles([newVehicleObj, ...vehicles]);
        setActiveTab('all');
        setFullNewVehicle({
          plate: '', brand: '', model: '', year: 2026, status: 'Available', currentKm: 0, nextMaintenanceKm: 15000,
          inspectionDate: '', insuranceDate: '', insurancePolicyNo: '', cascoDate: '', cascoPolicyNo: '',
          monthlyIncome: 0, maintenanceCost: 0, insuranceCost: 0, otherExpenses: 0,
          driverName: '', driverPhone: '', licenseClass: 'B', srcType: 'SRC-2', srcExpiryDate: '', psychotechnicalDate: '',
          tirePosition: 'Üzerinde Takılı', tireType: 'Yazlık', tireBrand: '', tireSerialNo: '', tireDepth: '8.0mm', tireLocation: 'Araç Üzerinde', tirePhone: ''
        });
        alert('Yeni araç veritabanına başarıyla kaydedildi!');
      } else {
        alert(data.error || 'Araç eklenemedi!');
      }
    } catch (err) {
      console.error('Araç ekleme hatası:', err);
      alert('Sunucuyla iletişim kurarken hata oluştu!');
    }
  };

  const handleOpenDetailModal = (vehicle) => {
    setSelectedVehicle(vehicle);
    setEditForm(JSON.parse(JSON.stringify(vehicle)));
    setIsEditingModal(false);
  };

const handleSaveVehicleEdit = async (e) => {
    e.preventDefault();
    if (!hasActionPermission('edit')) {
      alert('Bilgi düzenleme / güncelleme yetkiniz bulunmuyor!');
      return;
    }
    
    if (!editForm || !editForm.id) return;

    const token = localStorage.getItem('gmg_token');
    try {
      const response = await fetch(`${API_BASE_URL}/api/vehicles/${editForm.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      });

      const data = await response.json();

      if (response.ok) {
        const updated = vehicles.map(v => v.id === editForm.id ? editForm : v);
        setVehicles(updated);
        setSelectedVehicle(editForm);
        setIsEditingModal(false);
        alert('Araç bilgileri veritabanında başarıyla güncellendi!');
      } else {
        alert(data.error || 'Araç güncellenemedi!');
      }
    } catch (err) {
      console.error('Araç güncelleme hatası:', err);
      alert('Sunucuyla iletişim kurarken hata oluştu!');
    }
  };

const handleRentVehicle = async (e) => {
    e.preventDefault();
    if (!hasActionPermission('edit')) {
      alert('Kiralama işlemi yapma yetkiniz bulunmuyor!');
      return;
    }
    if (!selectedVehicle) return;

    const updatedVehicleData = {
      ...selectedVehicle,
      status: 'Rented',
      kabisIdentityNo: rentForm.tcNo || '11111111111',
      driver: { 
        name: rentForm.driverName, 
        phone: rentForm.driverPhone, 
        licenseClass: 'B',
        srcType: 'SRC-2',
        srcExpiryDate: '-',
        psychotechnicalDate: '-',
        documents: []
      },
      contract: { customer: rentForm.customer, monthlyFee: rentForm.monthlyFee + ' TL', endDate: rentForm.endDate }
    };

    const token = localStorage.getItem('gmg_token');
    try {
      const response = await fetch(`${API_BASE_URL}/api/vehicles/${selectedVehicle.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedVehicleData)
      });

      if (response.ok) {
        const updated = vehicles.map(v => v.id === selectedVehicle.id ? updatedVehicleData : v);
        setVehicles(updated);
        setSelectedVehicle(updatedVehicleData);
        setEditForm(updatedVehicleData);
        setShowRentModal(false);
        alert('Araç başarıyla kiraya verildi ve veritabanına kaydedildi!');
      } else {
        alert('Kiralama işlemi veritabanına kaydedilemedi!');
      }
    } catch (err) {
      console.error('Kiralama hatası:', err);
      alert('Sunucuyla iletişim kurarken hata oluştu!');
    }
  };

const handleReturnToGarage = async (vehicleId) => {
    if (!hasActionPermission('edit')) {
      alert('Durum değiştirme yetkiniz bulunmuyor!');
      return;
    }
    const targetVehicle = vehicles.find(v => v.id === vehicleId);
    if (!targetVehicle) return;

    const updatedVehicleData = {
      ...targetVehicle,
      status: 'Available',
      kabisStatus: 'Pending',
      kabisIdentityNo: '-',
      driver: { name: 'Zimmetsiz', phone: '-', licenseClass: '-', srcType: '-', srcExpiryDate: '-', psychotechnicalDate: '-', documents: [] },
      contract: null
    };

    const token = localStorage.getItem('gmg_token');
    try {
      const response = await fetch(`${API_BASE_URL}/api/vehicles/${vehicleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedVehicleData)
      });

      if (response.ok) {
        const updated = vehicles.map(v => v.id === vehicleId ? updatedVehicleData : v);
        setVehicles(updated);
        if (selectedVehicle && selectedVehicle.id === vehicleId) {
          setSelectedVehicle(updatedVehicleData);
          setEditForm(updatedVehicleData);
        }
        alert('Araç garaja alındı ve veritabanında güncellendi!');
      } else {
        alert('Durum veritabanında güncellenemedi!');
      }
    } catch (err) {
      console.error('Garaja dönüş hatası:', err);
      alert('Sunucu hatası!');
    }
  };

const handleSetMaintenanceStatus = async (vehicleId) => {
    if (!hasActionPermission('edit')) {
      alert('Düzenleme yetkiniz bulunmuyor!');
      return;
    }
    const targetVehicle = vehicles.find(v => v.id === vehicleId);
    if (!targetVehicle) return;

    const updatedVehicleData = { ...targetVehicle, status: 'Maintenance' };

    const token = localStorage.getItem('gmg_token');
    try {
      const response = await fetch(`${API_BASE_URL}/api/vehicles/${vehicleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedVehicleData)
      });

      if (response.ok) {
        const updated = vehicles.map(v => v.id === vehicleId ? updatedVehicleData : v);
        setVehicles(updated);
        if (selectedVehicle && selectedVehicle.id === vehicleId) {
          setSelectedVehicle(updatedVehicleData);
          setEditForm(updatedVehicleData);
        }
        alert('Araç bakıma alındı ve veritabanına kaydedildi!');
      } else {
        alert('Bakım durumu güncellenemedi!');
      }
    } catch (err) {
      console.error('Bakım durumu hatası:', err);
      alert('Sunucu hatası!');
    }
  };

  const handleInitiateKabisToggle = (vehicle) => {
    const newTarget = vehicle.kabisStatus === 'Registered' ? 'Pending' : 'Registered';
    setKabisConfirmModal({
      show: true,
      vehicleId: vehicle.id,
      targetStatus: newTarget,
      plate: vehicle.plate
    });
  };

const handleConfirmKabisChange = async () => {
    if (!hasActionPermission('edit')) {
      alert('KABİS durumunu güncelleme yetkiniz bulunmuyor!');
      setKabisConfirmModal({ show: false, vehicleId: null, targetStatus: null, plate: '' });
      return;
    }
    const { vehicleId, targetStatus } = kabisConfirmModal;
    const targetVehicle = vehicles.find(v => v.id === vehicleId);
    if (!targetVehicle) return;

    const updatedVehicleData = { ...targetVehicle, kabisStatus: targetStatus };

    const token = localStorage.getItem('gmg_token');
    try {
      const response = await fetch(`${API_BASE_URL}/api/vehicles/${vehicleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedVehicleData)
      });

      if (response.ok) {
        const updated = vehicles.map(v => v.id === vehicleId ? updatedVehicleData : v);
        setVehicles(updated);
        
        if (selectedVehicle && selectedVehicle.id === vehicleId) {
          setSelectedVehicle(updatedVehicleData);
          setEditForm(updatedVehicleData);
        }

        alert('KABİS durumu veritabanında güncellendi!');
      } else {
        alert('KABİS durumu güncellenemedi!');
      }
    } catch (err) {
      console.error('KABİS güncelleme hatası:', err);
      alert('Sunucu hatası!');
    } finally {
      setKabisConfirmModal({ show: false, vehicleId: null, targetStatus: null, plate: '' });
    }
  };

const handleStartDriverEdit = (item) => {
    if (!hasActionPermission('edit')) {
      alert('Düzenleme yetkiniz bulunmuyor!');
      return;
    }
    setEditingDriverKey(item.key);
    setDriverEditForm({
      name: item.name,
      phone: item.phone,
      licenseClass: item.licenseClass,
      srcType: item.srcType || 'SRC-2',
      srcExpiryDate: item.srcExpiryDate || ''
    });
  };

const handleSaveDriverPageEdit = async (item) => {
    if (!hasActionPermission('edit')) {
      alert('Kaydetme yetkiniz bulunmuyor!');
      return;
    }
    const token = localStorage.getItem('gmg_token');
    const nameLower = item.name.trim().toLowerCase();
    
    let updatedAny = false;

    // 1. Eğer bu sürücü bir araca zimmetliyse, ilgili araçların sürücü bilgisini güncelle
    const updatedVehicles = [...vehicles];
    for (let i = 0; i < updatedVehicles.length; i++) {
      let v = updatedVehicles[i];
      if (v.driver && v.driver.name && v.driver.name.trim().toLowerCase() === nameLower) {
        updatedAny = true;
        const updatedDriverObj = {
          ...v.driver,
          name: driverEditForm.name,
          phone: driverEditForm.phone,
          licenseClass: driverEditForm.licenseClass,
          srcType: driverEditForm.srcType,           // <-- Eklendi
          srcExpiryDate: driverEditForm.srcExpiryDate // <-- Eklendi
        };
        const updatedVehData = { ...v, driver: updatedDriverObj };
        
        try {
          const res = await fetch(`${API_BASE_URL}/api/vehicles/${v.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updatedVehData)
          });
          if (res.ok) {
            updatedVehicles[i] = updatedVehData;
          }
        } catch (err) {
          console.error('Araç sürücü güncelleme hatası:', err);
        }
      }
    }
    if (updatedAny) {
      setVehicles(updatedVehicles);
    }

    // 2. Bağımsız sürücüyü güncelle (ID veya isim eşleşmesiyle)
    let foundStandalone = standaloneDrivers.find(d => (item.id && d.id === item.id) || (d.name && d.name.trim().toLowerCase() === nameLower));
    
    if (foundStandalone) {
      updatedAny = true;
      const updatedStandaloneData = {
        ...foundStandalone,
        name: driverEditForm.name,
        phone: driverEditForm.phone,
        licenseClass: driverEditForm.licenseClass,
        srcType: driverEditForm.srcType,           // <-- Eklendi
        srcExpiryDate: driverEditForm.srcExpiryDate // <-- Eklendi
      };

      try {
        const res = await fetch(`${API_BASE_URL}/api/drivers/${foundStandalone.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(updatedStandaloneData)
        });
        if (res.ok) {
          setStandaloneDrivers(prev => prev.map(d => d.id === foundStandalone.id ? updatedStandaloneData : d));
        }
      } catch (err) {
        console.error('Bağımsız sürücü güncelleme hatası:', err);
      }
    } else if (!updatedAny) {
      // Eğer sistemde kayıtlı bulunamadıysa yeni bağımsız sürücü olarak veritabanına kaydet
      const newStandalone = {
        name: driverEditForm.name,
        phone: driverEditForm.phone,
        licenseClass: driverEditForm.licenseClass || 'B',
        srcType: driverEditForm.srcType || 'SRC-2',
        srcExpiryDate: driverEditForm.srcExpiryDate || '',
        psychotechnicalDate: '',
        documents: []
      };

      try {
        const response = await fetch(`${API_BASE_URL}/api/drivers`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(newStandalone)
        });
        const data = await response.json();
        if (response.ok) {
          setStandaloneDrivers(prev => [{ ...newStandalone, id: data.id }, ...prev]);
        }
      } catch (err) {
        console.error('Yeni bağımsız sürücü oluşturma hatası:', err);
      }
    }

    setEditingDriverKey(null);
    alert('Sürücü bilgileri başarıyla güncellendi!');
  };



const handleDriverDocUploadPage = async (e, item) => {
    if (!hasActionPermission('create') && !hasActionPermission('edit')) {
      alert('Evrak yükleme yetkiniz bulunmuyor!');
      return;
    }
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    const token = localStorage.getItem('gmg_token');

    try {
      // 1. Önce dosyayı /api/upload ile sunucuya (uploads klasörüne) yüklüyoruz
      const uploadRes = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) {
        alert(uploadData.error || 'Dosya yüklenemedi!');
        return;
      }

      const newDoc = {
        id: Date.now(),
        name: uploadData.fileName || file.name,
        type: file.name.toLowerCase().includes('src') ? 'SRC Belgesi' : 'Psikoteknik / Ehliyet',
        date: new Date().toISOString().split('T')[0],
        fileUrl: uploadData.fileUrl // Sunucudaki kalıcı URL
      };

      const nameLower = item.name.trim().toLowerCase();
      let updated = false;

      // 2. Eğer bu sürücü bir araca zimmetliyse, aracın driver.documents dizisine ekleyip PUT atıyoruz
      const updatedVehicles = [...vehicles];
      for (let i = 0; i < updatedVehicles.length; i++) {
        let v = updatedVehicles[i];
        if (v.driver && v.driver.name && v.driver.name.trim().toLowerCase() === nameLower) {
          updated = true;
          const currentDocs = v.driver.documents || [];
          const updatedDriverObj = { ...v.driver, documents: [...currentDocs, newDoc] };
          const updatedVehData = { ...v, driver: updatedDriverObj };

          const res = await fetch(`${API_BASE_URL}/api/vehicles/${v.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updatedVehData)
          });
          if (res.ok) {
            updatedVehicles[i] = updatedVehData;
          }
        }
      }
      if (updated) {
        setVehicles(updatedVehicles);
      }

      // 3. Eğer bağımsız sürücüyse, /api/drivers/:id endpoint'ine PUT atıyoruz
      const foundStandalone = standaloneDrivers.find(d => d.name && d.name.trim().toLowerCase() === nameLower);
      if (foundStandalone) {
        const currentDocs = foundStandalone.documents || [];
        const updatedStandaloneData = { ...foundStandalone, documents: [...currentDocs, newDoc] };

        const res = await fetch(`${API_BASE_URL}/api/drivers/${foundStandalone.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(updatedStandaloneData)
        });
        if (res.ok) {
          setStandaloneDrivers(prev => prev.map(d => d.id === foundStandalone.id ? updatedStandaloneData : d));
        }
      }

      alert('Sürücü evrakı başarıyla yüklendi ve veritabanına kaydedildi!');
    } catch (err) {
      console.error('Sürücü evrak yükleme hatası:', err);
      alert('Sunucuyla iletişim kurarken hata oluştu!');
    }
  };

  const handleDeleteDriverDoc = async (item, docId) => {
    if (!hasActionPermission('delete')) {
      alert('Evrak silme yetkiniz bulunmuyor!');
      return;
    }
    if (window.confirm('Bu sürücü evrakını silmek istediğinize emin misiniz?')) {
      const token = localStorage.getItem('gmg_token');
      const nameLower = item.name.trim().toLowerCase();
      let updated = false;

      // 1. Araç üzerindeki sürücünün evraklarından silip PUT atıyoruz
      const updatedVehicles = [...vehicles];
      for (let i = 0; i < updatedVehicles.length; i++) {
        let v = updatedVehicles[i];
        if (v.driver && v.driver.name && v.driver.name.trim().toLowerCase() === nameLower) {
          updated = true;
          const filteredDocs = (v.driver.documents || []).filter(d => d.id !== docId);
          const updatedDriverObj = { ...v.driver, documents: filteredDocs };
          const updatedVehData = { ...v, driver: updatedDriverObj };

          const res = await fetch(`${API_BASE_URL}/api/vehicles/${v.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updatedVehData)
          });
          if (res.ok) {
            updatedVehicles[i] = updatedVehData;
          }
        }
      }
      if (updated) {
        setVehicles(updatedVehicles);
      }

      // 2. Bağımsız sürücünün evraklarından silip PUT atıyoruz
      const foundStandalone = standaloneDrivers.find(d => d.name && d.name.trim().toLowerCase() === nameLower);
      if (foundStandalone) {
        const filteredDocs = (foundStandalone.documents || []).filter(doc => doc.id !== docId);
        const updatedStandaloneData = { ...foundStandalone, documents: filteredDocs };

        const res = await fetch(`${API_BASE_URL}/api/drivers/${foundStandalone.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(updatedStandaloneData)
        });
        if (res.ok) {
          setStandaloneDrivers(prev => prev.map(d => d.id === foundStandalone.id ? updatedStandaloneData : d));
        }
      }

      alert('Sürücü evrakı veritabanından başarıyla silindi!');
    }
  };

  const handleOpenAddTireModal = (vehicleId, tireToEdit = null) => {
    if (tireToEdit && !hasActionPermission('edit')) {
      alert('Lastik düzenleme yetkiniz bulunmuyor!');
      return;
    }
    if (!tireToEdit && !hasActionPermission('create')) {
      alert('Yeni lastik ekleme yetkiniz bulunmuyor!');
      return;
    }
    setSelectedTireVehicleId(vehicleId);
    if (tireToEdit) {
      setEditingTireId(tireToEdit.id);
      setTireForm({ ...tireToEdit });
    } else {
      setEditingTireId(null);
      setTireForm({ position: 'Üzerinde Takılı', type: 'Yazlık', brand: '', serialNo: '', depth: '8.0mm', location: 'Araç Üzerinde', phone: '' });
    }
    setShowTireModal(true);
  };

const handleSaveTire = async (e) => {
    e.preventDefault();
    if (!selectedTireVehicleId) return;

    const targetVehicle = vehicles.find(v => v.id === selectedTireVehicleId);
    if (!targetVehicle) return;

    let currentTires = targetVehicle.tires || [];
    if (editingTireId) {
      currentTires = currentTires.map(t => t.id === editingTireId ? { ...tireForm, id: editingTireId } : t);
    } else {
      currentTires = [...currentTires, { ...tireForm, id: Date.now() }];
    }

    const updatedVehicleData = { ...targetVehicle, tires: currentTires };

    const token = localStorage.getItem('gmg_token');
    try {
      const response = await fetch(`${API_BASE_URL}/api/vehicles/${selectedTireVehicleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedVehicleData)
      });

      if (response.ok) {
        setVehicles(vehicles.map(v => v.id === selectedTireVehicleId ? updatedVehicleData : v));
        setShowTireModal(false);
        alert('Lastik bilgileri veritabanında güncellendi!');
      } else {
        alert('Lastik kaydedilemedi!');
      }
    } catch (err) {
      console.error('Lastik kaydetme hatası:', err);
      alert('Sunucu hatası!');
    }
  };

const handleDeleteTire = async (vehicleId, tireId) => {
    if (!hasActionPermission('delete')) {
      alert('Lastik silme yetkiniz bulunmuyor!');
      return;
    }
    if (window.confirm('Bu lastik tanımını silmek istediğinize emin misiniz?')) {
      const targetVehicle = vehicles.find(v => v.id === vehicleId);
      if (!targetVehicle) return;

      const updatedTires = (targetVehicle.tires || []).filter(t => t.id !== tireId);
      const updatedVehicleData = { ...targetVehicle, tires: updatedTires };

      const token = localStorage.getItem('gmg_token');
      try {
        const response = await fetch(`${API_BASE_URL}/api/vehicles/${vehicleId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(updatedVehicleData)
        });

        if (response.ok) {
          setVehicles(vehicles.map(v => v.id === vehicleId ? updatedVehicleData : v));
          alert('Lastik veritabanından silindi!');
        } else {
          alert('Lastik silinemedi!');
        }
      } catch (err) {
        console.error('Lastik silme hatası:', err);
        alert('Sunucu hatası!');
      }
    }
  };

// PDF Dosya Yükleme Desteği
const handleFileUpload = async (e, vehicleId) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    const token = localStorage.getItem('gmg_token');

    try {
      const response = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      const data = await response.json();
      if (response.ok) {
        const newDoc = {
          id: Date.now(),
          name: data.fileName,
          type: 'Poliçe / Belge',
          date: new Date().toISOString().split('T')[0],
          fileUrl: data.fileUrl
        };

        // İlgili aracı bulup güncel documents listesini hazırlıyoruz
        let updatedVehicleData = null;

        const newVehicles = vehicles.map(v => {
          if (v.id === vehicleId) {
            const updatedDocs = [...(v.documents || []), newDoc];
            updatedVehicleData = { ...v, documents: updatedDocs };
            return updatedVehicleData;
          }
          return v;
        });

        // 1. Frontend state'ini güncelle
        setVehicles(newVehicles);

        // 2. Veritabanında kalıcı olması için backend'e PUT isteği atıyoruz
        if (updatedVehicleData) {
          await fetch(`${API_BASE_URL}/api/vehicles/${vehicleId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updatedVehicleData)
          });
        }

        alert('Araç evrakı başarıyla yüklendi ve kaydedildi!');
      } else {
        alert(data.error || 'Dosya yüklenemedi!');
      }
    } catch (err) {
      console.error('Dosya yükleme hatası:', err);
      alert('Sunucuyla iletişim kurarken hata oluştu!');
    }
  };

const handleDeleteVehicleDoc = async (vehicleId, docId) => {
    if (!hasActionPermission('delete')) {
      alert('Evrak silme yetkiniz bulunmuyor!');
      return;
    }

    if (window.confirm('Bu araç evrakını silmek istediğinize emin misiniz?')) {
      const token = localStorage.getItem('gmg_token');
      let updatedVehicleData = null;

      const newVehicles = vehicles.map(v => {
        if (v.id === vehicleId) {
          const filteredDocs = v.documents.filter(d => d.id !== docId);
          updatedVehicleData = { ...v, documents: filteredDocs };
          return updatedVehicleData;
        }
        return v;
      });

      try {
        // Backend'e güncel aracı gönderiyoruz (silinen evrak veritabanından da uçuyor)
        if (updatedVehicleData) {
          const res = await fetch(`${API_BASE_URL}/api/vehicles/${vehicleId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updatedVehicleData)
          });

          if (res.ok) {
            setVehicles(newVehicles);
            alert('Evrak başarıyla silindi!');
          } else {
            alert('Evrak veritabanından silinemedi!');
          }
        }
      } catch (err) {
        console.error('Evrak silme hatası:', err);
        alert('Sunucuyla iletişim kurarken hata oluştu!');
      }
    }
  };

  const handleCompanyPdfSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCompanyDocForm(prev => ({
      ...prev,
      name: file.name,
      fileUrl: URL.createObjectURL(file)
    }));
  };

const handleSaveCompanyDoc = async (e) => {
    e.preventDefault();
    if (!hasActionPermission('create')) {
      alert('Şirket evrakı ekleme yetkiniz bulunmuyor!');
      return;
    }

    const token = localStorage.getItem('gmg_token');
    let uploadedFileUrl = companyDocForm.fileUrl || '#';
    let uploadedFileName = companyDocForm.name || 'Sirket_Sozlesmesi.pdf';

    try {
      // Eğer kullanıcı bir dosya seçtiyse, önce sunucuya (uploads klasörüne) yükle
      if (companyDocForm.file) {
        const formData = new FormData();
        formData.append('file', companyDocForm.file);

        const uploadRes = await fetch(`${API_BASE_URL}/api/upload`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData
        });

        const uploadData = await uploadRes.json();
        if (uploadRes.ok) {
          uploadedFileUrl = uploadData.fileUrl;   // Örn: ${API_BASE_URL}/uploads/17000...pdf
          uploadedFileName = uploadData.fileName; // Orijinal dosya adı
        } else {
          alert(uploadData.error || 'Dosya sunucuya yüklenemedi!');
          return;
        }
      }

      // Yeni evrak objesi
      const newDoc = {
        name: uploadedFileName,
        category: companyDocForm.category,
        company: companyDocForm.company || 'GMG GRUP',
        date: new Date().toISOString().split('T')[0],
        expiry: companyDocForm.expiry || '2026-12-31',
        fileUrl: uploadedFileUrl
      };

      // Backend veritabanına kaydetmek için POST isteği (Kalıcılık için şart)
      const res = await fetch(`${API_BASE_URL}/api/company-docs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newDoc)
      });

      const data = await res.json();
      if (res.ok) {
        // Frontend state'ini güncelle
        setCompanyDocs([data.doc || newDoc, ...companyDocs]);
        setShowCompanyDocModal(false);
        setCompanyDocForm({ name: '', category: 'Uzun Vadeli Şirket Sözleşmesi', company: '', expiry: '', fileUrl: '#', file: null });
        alert('Şirket evrakı başarıyla yüklendi ve kaydedildi!');
      } else {
        alert(data.error || 'Evrak kaydedilemedi!');
      }

    } catch (err) {
      console.error('Şirket evrakı yükleme hatası:', err);
      alert('Sunucuyla iletişim kurarken hata oluştu!');
    }
  };
const handleDeleteCompanyDoc = async (id) => {
    if (!hasActionPermission('delete')) {
      alert('Şirket evrakı silme yetkiniz bulunmuyor!');
      return;
    }

    if (!window.confirm('Bu evrakı kalıcı olarak silmek istediğinize emin misiniz?')) {
      return;
    }

    const token = localStorage.getItem('gmg_token');

    try {
      // Backend'e silme isteği gönderiyoruz
      const res = await fetch(`${API_BASE_URL}/api/company-docs/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        // İstek başarılı olursa ekrandan da kaldırıyoruz
        setCompanyDocs(companyDocs.filter(doc => doc.id !== id));
        alert('Evrak başarıyla silindi!');
      } else {
        const data = await res.json();
        alert(data.error || 'Evrak silinemedi!');
      }
    } catch (err) {
      console.error('Silme hatası:', err);
      alert('Sunucuyla iletişim kurarken hata oluştu!');
    }
  };

  const handleDownloadVehicleReportPdf = (veh) => {
    if (!veh) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Lütfen tarayıcınızın açılır pencere (popup) engelleyicisini kapatın.');
      return;
    }

    const vehicleMainTires = veh.tires && veh.tires.length > 0 ? veh.tires[0] : { type: '-', brand: '-', depth: '-' };
    const vehMainMaint = maintenanceRecords.filter(r => r.vehicleId === veh.id);

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="tr">
      <head>
        <meta charset="UTF-8">
        <title>Araç Raporu - ${veh.plate}</title>
        <style>
          body { font-family: Helvetica, Arial, sans-serif; color: #1e293b; padding: 30px; margin: 0; background: #fff; }
          .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 25px; border-bottom: 2px solid #0f172a; padding-bottom: 15px; }
          .logo-img { width: 70px; height: auto; object-fit: contain; }
          .header-title { text-align: center; flex: 1; }
          .logo-title { font-size: 18px; font-weight: bold; color: #0f172a; margin: 0; letter-spacing: 1px; }
          .section-title { font-size: 14px; font-weight: bold; background: #1e293b; color: #fff; padding: 8px 12px; margin-top: 20px; margin-bottom: 10px; text-transform: uppercase; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 12px; }
          th, td { border: 1px solid #cbd5e1; padding: 8px 10px; text-align: left; }
          th { background: #f1f5f9; color: #0f172a; font-weight: bold; }
          .label-col { width: 40%; font-weight: bold; color: #334155; background: #f8fafc; }
          .value-col { width: 60%; color: #0f172a; }
          .footer { margin-top: 40px; text-align: center; font-size: 10px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 10px; }
          @media print {
            body { padding: 10px; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <img src="/logo.png" alt="GMG Grup Logo" class="logo-img" onerror="this.style.display='none'" />
          <div class="header-title">
            <div class="logo-title">GMG GRUP FİLO - ARAÇ RAPOR ÇIKTISI</div>
            <div style="font-size: 11px; color: #64748b; margin-top: 3px;">Rapor Tarihi: ${new Date().toLocaleDateString('tr-TR')}</div>
          </div>
        </div>

        <table>
          <tr><td class="label-col">ARAÇ PLAKASI:</td><td class="value-col"><b>${veh.plate}</b></td></tr>
          <tr><td class="label-col">MARKA:</td><td class="value-col">${veh.brand}</td></tr>
          <tr><td class="label-col">MODEL:</td><td class="value-col">${veh.model}</td></tr>
          <tr><td class="label-col">MODEL YILI:</td><td class="value-col">${veh.year}</td></tr>
          <tr><td class="label-col">MEVCUT KM:</td><td class="value-col">${veh.currentKm?.toLocaleString()} KM</td></tr>
          <tr><td class="label-col">SONRAKİ BAKIM KM:</td><td class="value-col">${veh.nextMaintenanceKm?.toLocaleString()} KM</td></tr>
          <tr><td class="label-col">MUAYENE BİTİŞ TARİHİ:</td><td class="value-col">${veh.inspectionDate || '-'}</td></tr>
          <tr><td class="label-col">TRAFİK SİGORTASI BİTİŞ TARİHİ:</td><td class="value-col">${veh.insuranceDate || '-'}</td></tr>
          <tr><td class="label-col">SİGORTA POLİÇE NO:</td><td class="value-col">${veh.insurancePolicyNo || '-'}</td></tr>
          <tr><td class="label-col">KASKO POLİÇE BİTİŞ TARİHİ:</td><td class="value-col">${veh.cascoDate || '-'}</td></tr>
          <tr><td class="label-col">KASKO POLİÇE NO:</td><td class="value-col">${veh.cascoPolicyNo || '-'}</td></tr>
          <tr><td class="label-col">KİRA GELİRİ:</td><td class="value-col">${veh.financials?.monthlyIncome?.toLocaleString() || 0} TL / Ay</td></tr>
          <tr><td class="label-col">KASKO TUTARI:</td><td class="value-col">${veh.financials?.insuranceCost?.toLocaleString() || 0} TL / Ay</td></tr>
          <tr><td class="label-col">SİGORTA TUTARI:</td><td class="value-col">1,800 TL / Ay</td></tr>
          <tr><td class="label-col">DİĞER AYLIK GİDERLER:</td><td class="value-col">${veh.financials?.otherExpenses?.toLocaleString() || 0} TL</td></tr>
          <tr><td class="label-col">ZİMMETLİ SÜRÜCÜ:</td><td class="value-col">${veh.driver?.name || 'Zimmetsiz'}</td></tr>
          <tr><td class="label-col">ZİMMETLİ SÜRÜCÜ TEL NO:</td><td class="value-col">${veh.driver?.phone || '-'}</td></tr>
          <tr><td class="label-col">LASTİK TİPİ:</td><td class="value-col">${vehicleMainTires.type}</td></tr>
          <tr><td class="label-col">LASTİK MARKASI VE EBATI:</td><td class="value-col">${vehicleMainTires.brand} (${vehicleMainTires.depth})</td></tr>
        </table>

        <div class="section-title">BAKIM GEÇMİŞİ</div>
        <table>
          <thead>
            <tr>
              <th>Bakım Türü</th>
              <th>Tarih</th>
              <th>Bakım KM</th>
              <th>Servis / Nokta</th>
            </tr>
          </thead>
          <tbody>
            ${vehMainMaint.length === 0 ? '<tr><td colspan="4" style="text-align:center; color:#64748b;">Kayıtlı bakım geçmişi bulunmuyor.</td></tr>' : 
              vehMainMaint.map(m => `
                <tr>
                  <td><b>${m.type}</b></td>
                  <td>${m.date}</td>
                  <td>${m.km?.toLocaleString()} KM</td>
                  <td>${m.service}</td>
                </tr>
              `).join('')}
          </tbody>
        </table>

        <div class="section-title">MALİYET & AÇIKLAMA DETAYLARI</div>
        <table>
          <thead>
            <tr>
              <th>Maliyet</th>
              <th>Açıklama / Not</th>
              <th>İşlem Durumu</th>
            </tr>
          </thead>
          <tbody>
            ${vehMainMaint.length === 0 ? '<tr><td colspan="3" style="text-align:center; color:#64748b;">Kayıt bulunmuyor.</td></tr>' : 
              vehMainMaint.map(m => `
                <tr>
                  <td style="color: #e11d48; font-weight: bold;">${m.cost?.toLocaleString()} TL</td>
                  <td>${m.note || '-'}</td>
                  <td>Tamamlandı</td>
                </tr>
              `).join('')}
          </tbody>
        </table>

        <div style="text-align: center; margin-top: 30px;" class="no-print">
          <button onclick="window.print()" style="background: #2563eb; color: white; border: none; padding: 12px 24px; font-size: 14px; font-weight: bold; border-radius: 8px; cursor: pointer;">PDF Olarak Kaydet / Yazdır</button>
        </div>

        <div class="footer">
          GMG GRUP Araç Takip & Yönetim Sistemi - Bu belge elektronik olarak oluşturulmuştur.
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* SOL MENÜ */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0">
        <div>
          <div className="p-5 border-b border-slate-800 flex items-center gap-3">
            <div className="bg-white p-1 rounded-xl shadow-lg shadow-blue-500/10 flex items-center justify-center w-10 h-10 shrink-0">
              <img src="/logo.png" alt="GMG Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="font-bold text-white text-base leading-tight">GMG GRUP</h1>
              <p className="text-[11px] text-slate-400 font-medium">Araç Takip & Yönetim</p>
            </div>
          </div>

          <nav className="p-4 space-y-1 text-sm font-medium">
            <div className="px-3 py-2 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Yönetim Paneli
            </div>

            {(hasPermission('vehicles') || currentUser.role === 'admin') && (
              <div>
                <button 
                  onClick={() => {
                    setActiveTab('all');
                    setIsSubMenuOpen(!isSubMenuOpen);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition cursor-pointer ${
                    activeTab === 'all' || activeTab === 'rented' || activeTab === 'available' || activeTab === 'maintenance'
                      ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30' 
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <LayoutDashboard size={18} /> Tüm Araç Paneli ({realVehicles.length})
                  </div>
                  {isSubMenuOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>

                {isSubMenuOpen && (
                  <div className="ml-4 mt-1 pl-3 border-l-2 border-slate-800 space-y-1 transition-all duration-300">
                    <button 
                      onClick={() => setActiveTab('all')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs transition cursor-pointer ${
                        activeTab === 'all' ? 'text-white bg-slate-800 font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      • Hepsi ({realVehicles.length})
                    </button>
                    <button 
                      onClick={() => setActiveTab('rented')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs transition flex items-center justify-between cursor-pointer ${
                        activeTab === 'rented' ? 'text-emerald-400 bg-slate-800 font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <span>• Kiradakiler</span>
                      <span className="text-[10px] bg-emerald-500/20 px-1.5 py-0.5 rounded text-emerald-400">
                        {realVehicles.filter(v => v.status === 'Rented').length}
                      </span>
                    </button>
                    <button 
                      onClick={() => setActiveTab('available')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs transition flex items-center justify-between cursor-pointer ${
                        activeTab === 'available' ? 'text-blue-400 bg-slate-800 font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <span>• Garajda / Boşta</span>
                      <span className="text-[10px] bg-blue-500/20 px-1.5 py-0.5 rounded text-blue-400">
                        {realVehicles.filter(v => v.status === 'Available').length}
                      </span>
                    </button>
                    <button 
                      onClick={() => setActiveTab('maintenance')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs transition flex items-center justify-between cursor-pointer ${
                        activeTab === 'maintenance' ? 'text-amber-400 bg-slate-800 font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <span>• Bakım Uyarısı</span>
                      <span className="text-[10px] bg-amber-500/20 px-1.5 py-0.5 rounded text-amber-400">
                        {realVehicles.filter(v => (v.nextMaintenanceKm - v.currentKm <= 1000) || v.status === 'Maintenance').length}
                      </span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {hasPermission('reports') && (
              <button 
                onClick={() => setActiveTab('report_generator')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition cursor-pointer mt-1 ${
                  activeTab === 'report_generator' ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <FileDown size={18} className="text-cyan-400 shrink-0" /> <span className="text-xs truncate">Araç Rapor Çıktısı</span>
              </button>
            )}

            {hasPermission('notifications') && (
              <button 
                onClick={() => setActiveTab('notifications')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition cursor-pointer mt-1 ${
                  activeTab === 'notifications' ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <Bell size={18} className="text-rose-400 shrink-0" /> 
                  <span className="truncate text-xs">Bildirimler & Uyarılar</span>
                </div>
                {notificationList.length > 0 && (
                  <span className="text-[10px] bg-rose-500 text-white px-2 py-0.5 rounded-full font-bold animate-pulse shrink-0 ml-1">
                    {notificationList.length}
                  </span>
                )}
              </button>
            )}

            {hasPermission('maintenance') && (
              <button 
                onClick={() => setActiveTab('maintenance_history')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition cursor-pointer mt-1 ${
                  activeTab === 'maintenance_history' ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Wrench size={18} className="text-amber-400 shrink-0" /> <span className="text-xs truncate">Bakım Geçmişi & Servis</span>
              </button>
            )}

            {hasPermission('equipments') && (
              <button 
                onClick={() => setActiveTab('equipments')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition cursor-pointer ${
                  activeTab === 'equipments' ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <HardDrive size={18} className="text-emerald-400 shrink-0" /> <span className="text-xs truncate">Ekipmanlar & Lastik</span>
              </button>
            )}

            {hasPermission('drivers') && (
              <button 
                onClick={() => setActiveTab('drivers')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition cursor-pointer ${
                  activeTab === 'drivers' ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Users size={18} className="text-purple-400 shrink-0" /> <span className="text-xs truncate">Sürücü Bilgileri & Evrak</span>
              </button>
            )}

            {hasPermission('financials') && (
              <button 
                onClick={() => setActiveTab('financials')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition cursor-pointer ${
                  activeTab === 'financials' ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <DollarSign size={18} className="text-amber-400 shrink-0" /> <span className="text-xs truncate">Finans & Kar Analizi</span>
              </button>
            )}

            {hasPermission('documents') && (
              <button 
                onClick={() => setActiveTab('documents')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition cursor-pointer ${
                  activeTab === 'documents' ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <FolderDown size={18} className="text-cyan-400 shrink-0" /> <span className="text-xs truncate">Araç Evrakları</span>
              </button>
            )}

            {hasPermission('company_docs') && (
              <button 
                onClick={() => setActiveTab('company_docs')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition cursor-pointer ${
                  activeTab === 'company_docs' ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Building2 size={18} className="text-indigo-400 shrink-0" /> <span className="text-xs truncate">Şirket Evrakları</span>
              </button>
            )}

            {currentUser.role === 'admin' && (
              <button 
                onClick={() => setActiveTab('user_management')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition cursor-pointer mt-3 border-t border-slate-800 pt-3 ${
                  activeTab === 'user_management' ? 'bg-purple-600 text-white font-semibold shadow-md shadow-purple-600/30' : 'text-purple-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Shield size={18} className="shrink-0" /> <span className="text-xs font-bold truncate">Kullanıcı & Yetki Yönetimi</span>
              </button>
            )}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-950/50 flex items-center justify-between">
          <div className="truncate pr-2">
            <div className="text-xs font-bold text-white truncate">{currentUser.name}</div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wide">Rol: <span className="text-emerald-400 font-bold">{currentUser.role === 'admin' ? 'Yönetici (Admin)' : 'Personel'}</span></div>
          </div>
          <button onClick={handleLogout} className="bg-slate-800 hover:bg-rose-600/20 hover:text-rose-400 text-slate-300 p-2 rounded-lg transition cursor-pointer shrink-0" title="Güvenli Çıkış Yap">
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* İÇERİK ALANI */}
      <main className="flex-1 p-8 overflow-y-auto">
        {activeTab === 'user_management' && currentUser.role === 'admin' ? (
          <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex justify-between items-center bg-slate-900 border border-slate-800 p-6 rounded-xl">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Shield className="text-purple-400" /> Kullanıcı & İşlem Yetki Matrisi (CRUD)
                </h3>
                <p className="text-slate-400 text-xs mt-1">Personellerin sayfa erişimlerinin yanı sıra **Ekleme (`+`)**, **Düzenleme (`✎`)** ve **Silme (`🗑`)** haklarını buradan yönetebilirsiniz.</p>
              </div>
              <button onClick={() => setShowAddUserModal(true)} className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2 cursor-pointer shadow-lg shadow-purple-600/30">
                <Plus size={16} /> Yeni Kullanıcı Ekle
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {usersList.map(usr => (
                <div key={usr.id} className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                    <div>
                      <h4 className="font-bold text-white text-base flex items-center gap-2">
                        {usr.name} <span className="text-xs font-mono font-normal text-slate-400">({usr.username})</span>
                      </h4>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase mt-1 inline-block ${usr.role === 'admin' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'}`}>
                        {usr.role === 'admin' ? 'Sistem Admini (Tam Yetkili)' : 'Normal Kullanıcı'}
                      </span>
                    </div>
                    {usr.username !== 'admin' && (
                      <button onClick={() => handleDeleteUser(usr.id)} className="bg-rose-600/20 hover:bg-rose-600/40 text-rose-400 border border-rose-500/30 text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer">
                        <Trash2 size={14} /> Kullanıcıyı Sil
                      </button>
                    )}
                  </div>

                  {usr.role === 'admin' ? (
                    <p className="text-xs text-slate-400 italic">Sistem yöneticisi tüm ekleme, düzenleme ve silme yetkilerine otomatik olarak sahiptir.</p>
                  ) : (
                    <div className="space-y-4">
                      {/* İŞLEM YETKİLERİ (EKLEME, DÜZENLEME, SİLME) */}
                      <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-2">
                        <span className="text-xs font-bold text-cyan-400 block uppercase tracking-wide">Genel İşlem Yetkileri (CRUD)</span>
                        <div className="grid grid-cols-3 gap-3">
                          <label className={`flex items-center gap-2 p-2 rounded-lg border text-xs cursor-pointer transition ${usr.actions?.create ? 'bg-emerald-600/10 border-emerald-500/40 text-emerald-300 font-medium' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
                            <input 
                              type="checkbox" 
                              checked={usr.actions?.create ?? true}
                              onChange={() => handleToggleUserAction(usr.id, 'create')}
                              className="rounded bg-slate-950 border-slate-700 text-emerald-600 focus:ring-0"
                            />
                            <span>➕ Bilgi / Kayıt Ekleme</span>
                          </label>
                          <label className={`flex items-center gap-2 p-2 rounded-lg border text-xs cursor-pointer transition ${usr.actions?.edit ? 'bg-blue-600/10 border-blue-500/40 text-blue-300 font-medium' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
                            <input 
                              type="checkbox" 
                              checked={usr.actions?.edit ?? true}
                              onChange={() => handleToggleUserAction(usr.id, 'edit')}
                              className="rounded bg-slate-950 border-slate-700 text-blue-600 focus:ring-0"
                            />
                            <span>✏️ Bilgileri Düzenleme</span>
                          </label>
                          <label className={`flex items-center gap-2 p-2 rounded-lg border text-xs cursor-pointer transition ${usr.actions?.delete ? 'bg-rose-600/10 border-rose-500/40 text-rose-300 font-medium' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
                            <input 
                              type="checkbox" 
                              checked={usr.actions?.delete ?? false}
                              onChange={() => handleToggleUserAction(usr.id, 'delete')}
                              className="rounded bg-slate-950 border-slate-700 text-rose-600 focus:ring-0"
                            />
                            <span>🗑️ Kayıt / Öğe Silme</span>
                          </label>
                        </div>
                      </div>

                      {/* MODÜL / SEKME ERİŞİM YETKİLERİ */}
                      <div className="space-y-2">
                        <span className="text-xs font-semibold text-slate-300 block">Erişilebilecek Modüller & Sekmeler:</span>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          {AVAILABLE_PERMISSIONS.map(perm => {
                            const hasThisPerm = usr.permissions.includes(perm.id);
                            return (
                              <label key={perm.id} className={`flex items-center gap-2 p-2 rounded-lg border text-xs cursor-pointer transition ${hasThisPerm ? 'bg-blue-600/10 border-blue-500/40 text-white font-medium' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'}`}>
                                <input 
                                  type="checkbox" 
                                  checked={hasThisPerm}
                                  onChange={() => handleToggleUserPermission(usr.id, perm.id)}
                                  className="rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-0"
                                />
                                <span className="truncate">{perm.label}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {activeTab !== 'add_new_vehicle_page' && activeTab !== 'report_generator' && (
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">GMG GRUP Filo Paneli</h2>
                  <p className="text-slate-400 text-xs mt-1">KABİS, Sözleşme Bitiş Takibi, Poliçeler (PDF) & Kar Analizi</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-2.5 text-slate-500" size={18} />
                    <input 
                      type="text" 
                      placeholder={activeTab === 'notifications' ? 'Bildirimlerde Ara (Plaka, Tür)...' : 'Plaka veya Marka Ara...'}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {activeTab === 'maintenance_history' && hasPermission('maintenance') && hasActionPermission('create') && (
                  <button 
                    onClick={() => {
                      if (realVehicles.length > 0) {
                        setNewMaintenanceForm(prev => ({ ...prev, vehicleId: realVehicles[0].id }));
                      }
                      setShowAddMaintenanceModal(true);
                    }}
                    className="bg-amber-600 hover:bg-amber-500 text-white text-xs px-4 py-2.5 rounded-lg flex items-center gap-1.5 font-semibold transition shadow-lg shadow-amber-600/25 cursor-pointer shrink-0"
                  >
                    <Plus size={16} /> Yeni Bakım Ekle
                  </button>
                  )}

                  {activeTab === 'drivers' && hasPermission('drivers') && hasActionPermission('create') && (
                    <button 
                      onClick={() => setShowAddDriverModal(true)}
                      className="bg-purple-600 hover:bg-purple-500 text-white text-xs px-4 py-2.5 rounded-lg flex items-center gap-1.5 font-semibold transition shadow-lg shadow-purple-600/20 cursor-pointer shrink-0"
                    >
                      <Plus size={16} /> Yeni Sürücü Ekle
                    </button>
                  )}

                  {(activeTab === 'all' || activeTab === 'rented' || activeTab === 'available' || activeTab === 'maintenance') && hasPermission('vehicles') && hasActionPermission('create') && (
                    <button 
                      onClick={() => setActiveTab('add_new_vehicle_page')}
                      className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-4 py-2.5 rounded-lg flex items-center gap-1.5 font-semibold transition shadow-lg shadow-blue-600/20 cursor-pointer shrink-0"
                    >
                      <Plus size={16} /> Yeni Araç Ekle
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* ARAÇ RAPOR ÇIKTISI SAYFASI */}
            {activeTab === 'report_generator' && hasPermission('reports') && (() => {
              const selectedReportVeh = realVehicles.find(v => v.id === Number(reportVehicleId)) || realVehicles[0];
              const vehicleMainTires = selectedReportVeh?.tires && selectedReportVeh.tires.length > 0 ? selectedReportVeh.tires[0] : { type: '-', brand: '-', depth: '-' };
              const vehicleMaintList = maintenanceRecords.filter(r => r.vehicleId === selectedReportVeh?.id);

              return (
                <div className="space-y-6 max-w-4xl mx-auto">
                  <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-1">
                        <FileDown className="text-cyan-400" /> Araç Rapor Çıktısı (Word / PDF Şablonu)
                      </h3>
                      <p className="text-slate-400 text-xs">İstediğiniz aracı seçerek belgedeki şablon alanlarıyla otomatik doldurulmuş profesyonel PDF raporunu oluşturun ve indirin.</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-end">
                      <select 
                        value={reportVehicleId} 
                        onChange={e => setReportVehicleId(e.target.value)}
                        className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-white font-mono font-bold flex-1 lg:flex-none min-w-[200px]"
                      >
                        {realVehicles.map(v => (
                          <option key={v.id} value={v.id}>{v.plate} ({v.brand} {v.model})</option>
                        ))}
                      </select>
                      <button 
                        onClick={() => handleDownloadVehicleReportPdf(selectedReportVeh)}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-600/30 cursor-pointer shrink-0"
                      >
                        <FileDown size={16} /> PDF Raporu Oluştur & İndir
                      </button>
                    </div>
                  </div>

                  {selectedReportVeh && (
                    <div className="bg-white text-slate-900 p-8 rounded-xl shadow-2xl space-y-6 border border-slate-300">
                      <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4">
                        <img src="/logo.png" alt="GMG Logo" className="w-16 h-16 object-contain" />
                        <div className="text-center flex-1">
                          <div className="font-extrabold text-xl tracking-wide text-slate-900">GMG GRUP FİLO - ARAÇ RAPORU</div>
                          <div className="text-xs text-slate-500 mt-1">Kurumsal Araç Bilgileri ve Bakım Dökümü</div>
                        </div>
                        <div className="w-16"></div>
                      </div>

                      <div className="space-y-2">
                        <table className="w-full text-xs border-collapse">
                          <tbody>
                            <tr><td className="border border-slate-300 p-2 font-bold bg-slate-100 w-1/2">ARAÇ PLAKASI:</td><td className="border border-slate-300 p-2 font-mono font-bold">{selectedReportVeh.plate}</td></tr>
                            <tr><td className="border border-slate-300 p-2 font-bold bg-slate-100">MARKA:</td><td className="border border-slate-300 p-2">{selectedReportVeh.brand}</td></tr>
                            <tr><td className="border border-slate-300 p-2 font-bold bg-slate-100">MODEL:</td><td className="border border-slate-300 p-2">{selectedReportVeh.model}</td></tr>
                            <tr><td className="border border-slate-300 p-2 font-bold bg-slate-100">MODEL YILI:</td><td className="border border-slate-300 p-2">{selectedReportVeh.year}</td></tr>
                            <tr><td className="border border-slate-300 p-2 font-bold bg-slate-100">MEVCUT KM:</td><td className="border border-slate-300 p-2">{selectedReportVeh.currentKm?.toLocaleString()} KM</td></tr>
                            <tr><td className="border border-slate-300 p-2 font-bold bg-slate-100">SONRAKİ BAKIM KM:</td><td className="border border-slate-300 p-2">{selectedReportVeh.nextMaintenanceKm?.toLocaleString()} KM</td></tr>
                            <tr><td className="border border-slate-300 p-2 font-bold bg-slate-100">MUAYENE BİTİŞ TARİHİ:</td><td className="border border-slate-300 p-2">{selectedReportVeh.inspectionDate || '-'}</td></tr>
                            <tr><td className="border border-slate-300 p-2 font-bold bg-slate-100">TRAFİK SİGORTASI BİTİŞ TARİHİ:</td><td className="border border-slate-300 p-2">{selectedReportVeh.insuranceDate || '-'}</td></tr>
                            <tr><td className="border border-slate-300 p-2 font-bold bg-slate-100">SİGORTA POLİÇE NO:</td><td className="border border-slate-300 p-2">{selectedReportVeh.insurancePolicyNo || '-'}</td></tr>
                            <tr><td className="border border-slate-300 p-2 font-bold bg-slate-100">KASKO POLİÇE BİTİŞ TARİHİ:</td><td className="border border-slate-300 p-2">{selectedReportVeh.cascoDate || '-'}</td></tr>
                            <tr><td className="border border-slate-300 p-2 font-bold bg-slate-100">KASKO POLİÇE NO:</td><td className="border border-slate-300 p-2">{selectedReportVeh.cascoPolicyNo || '-'}</td></tr>
                            <tr><td className="border border-slate-300 p-2 font-bold bg-slate-100">KİRA GELİRİ:</td><td className="border border-slate-300 p-2 text-emerald-700 font-bold">{selectedReportVeh.financials?.monthlyIncome?.toLocaleString() || 0} TL / Ay</td></tr>
                            <tr><td className="border border-slate-300 p-2 font-bold bg-slate-100">KASKO TUTARI:</td><td className="border border-slate-300 p-2 text-rose-700">{selectedReportVeh.financials?.insuranceCost?.toLocaleString() || 0} TL / Ay</td></tr>
                            <tr><td className="border border-slate-300 p-2 font-bold bg-slate-100">SİGORTA TUTARI:</td><td className="border border-slate-300 p-2 text-rose-700">1,800 TL / Ay</td></tr>
                            <tr><td className="border border-slate-300 p-2 font-bold bg-slate-100">DİĞER AYLIK GİDERLER:</td><td className="border border-slate-300 p-2 text-rose-700">{selectedReportVeh.financials?.otherExpenses?.toLocaleString() || 0} TL</td></tr>
                            <tr><td className="border border-slate-300 p-2 font-bold bg-slate-100">ZİMMETLİ SÜRÜCÜ:</td><td className="border border-slate-300 p-2 font-bold">{selectedReportVeh.driver?.name || 'Zimmetsiz'}</td></tr>
                            <tr><td className="border border-slate-300 p-2 font-bold bg-slate-100">ZİMMETLİ SÜRÜCÜ TEL NO:</td><td className="border border-slate-300 p-2">{selectedReportVeh.driver?.phone || '-'}</td></tr>
                            <tr><td className="border border-slate-300 p-2 font-bold bg-slate-100">LASTİK TİPİ:</td><td className="border border-slate-300 p-2">{vehicleMainTires.type}</td></tr>
                            <tr><td className="border border-slate-300 p-2 font-bold bg-slate-100">LASTİK MARKASI VE EBATI:</td><td className="border border-slate-300 p-2">{vehicleMainTires.brand} ({vehicleMainTires.depth})</td></tr>
                          </tbody>
                        </table>
                      </div>

                      <div>
                        <h4 className="font-bold text-xs bg-slate-900 text-white p-2 uppercase tracking-wide">BAKIM GEÇMİŞİ</h4>
                        <table className="w-full text-xs border-collapse mt-2">
                          <thead>
                            <tr className="bg-slate-100">
                              <th className="border border-slate-300 p-2 text-left">Bakım Türü</th>
                              <th className="border border-slate-300 p-2 text-left">Tarih</th>
                              <th className="border border-slate-300 p-2 text-left">Bakım KM</th>
                              <th className="border border-slate-300 p-2 text-left">Servis / Nokta</th>
                            </tr>
                          </thead>
                          <tbody>
                            {vehicleMaintList.length === 0 ? (
                              <tr><td colSpan="4" className="border border-slate-300 p-3 text-center text-slate-500">Kayıt bulunmuyor.</td></tr>
                            ) : (
                              vehicleMaintList.map(m => (
                                <tr key={m.id}>
                                  <td className="border border-slate-300 p-2 font-bold">{m.type}</td>
                                  <td className="border border-slate-300 p-2">{m.date}</td>
                                  <td className="border border-slate-300 p-2">{m.km?.toLocaleString()} KM</td>
                                  <td className="border border-slate-300 p-2">{m.service}</td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>

                      <div>
                        <h4 className="font-bold text-xs bg-slate-900 text-white p-2 uppercase tracking-wide">MALİYET & NOTLAR</h4>
                        <table className="w-full text-xs border-collapse mt-2">
                          <thead>
                            <tr className="bg-slate-100">
                              <th className="border border-slate-300 p-2 text-left">Maliyet</th>
                              <th className="border border-slate-300 p-2 text-left">Açıklama / Not</th>
                              <th className="border border-slate-300 p-2 text-left">İşlem</th>
                            </tr>
                          </thead>
                          <tbody>
                            {vehicleMaintList.length === 0 ? (
                              <tr><td colSpan="3" className="border border-slate-300 p-3 text-center text-slate-500">Kayıt bulunmuyor.</td></tr>
                            ) : (
                              vehicleMaintList.map(m => (
                                <tr key={m.id}>
                                  <td className="border border-slate-300 p-2 text-rose-600 font-bold">{m.cost?.toLocaleString()} TL</td>
                                  <td className="border border-slate-300 p-2">{m.note || '-'}</td>
                                  <td className="border border-slate-300 p-2">Tamamlandı</td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            {activeTab === 'notifications' && hasPermission('notifications') && (
              <div className="space-y-6">
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
                      <Bell className="text-rose-400" /> Filo Bildirim & Kritik Tarih Takip Merkezi
                    </h3>
                    <p className="text-slate-400 text-xs">Kasko, muayene, sigorta, bakım süreleri, kira sözleşmesi bitenler ve birine zimmetli olup KABİS bildirimi yapılmamış tüm araçlar aşağıda acil olarak listelenmektedir.</p>
                  </div>
                  <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 px-3 py-1.5 rounded-lg text-xs font-bold">
                    Toplam Kritik Uyarı: {filteredNotifications.length}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {filteredNotifications.length === 0 ? (
                    <div className="bg-slate-900 border border-slate-800 p-8 rounded-xl text-center text-slate-400">
                      <CheckCircle2 className="mx-auto text-emerald-400 mb-2" size={36} />
                      <p className="font-bold text-white text-sm">Arama kriterine uygun veya süresi yaklaşan/geçen kritik bir uyarı bulunmuyor.</p>
                    </div>
                  ) : (
                    filteredNotifications.map((item) => (
                      <div 
                        key={item.id} 
                        onClick={() => handleOpenDetailModal(item.vehicle)}
                        className={`p-5 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition cursor-pointer shadow-lg ${
                          item.status === 'expired' 
                            ? 'bg-rose-950/30 border-rose-600/50 hover:bg-rose-900/40' 
                            : 'bg-amber-950/20 border-amber-500/40 hover:bg-amber-900/30'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-xl shrink-0 ${item.status === 'expired' ? 'bg-rose-600 text-white' : 'bg-amber-500 text-slate-950'}`}>
                            <AlertCircle size={22} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-white text-base font-mono">{item.vehicle.plate}</h4>
                              <span className="text-xs text-slate-400">({item.vehicle.brand} {item.vehicle.model})</span>
                              <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                                item.status === 'expired' ? 'bg-rose-500 text-white' : 'bg-amber-500 text-slate-950'
                              }`}>
                                {item.status === 'expired' ? 'Acil / Süresi Geçti' : 'Son 1 Hafta (Kritik)'}
                              </span>
                            </div>
                            <p className="text-xs font-semibold text-slate-200 mt-1">Bildirim Türü: <span className="text-cyan-400">{item.type}</span> ({item.date})</p>
                            <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleOpenDetailModal(item.vehicle); }}
                            className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-1 cursor-pointer"
                          >
                            Aracı İncele & Güncelle <ChevronRight size={14} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === 'financials' && hasPermission('financials') && (
              <div className="space-y-6">
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
                      <DollarSign className="text-amber-400" /> Araç Bazlı Finansal Kar / Zarar & Grafik Analiz Sayfası
                    </h3>
                    <p className="text-slate-400 text-xs">Yukarıdaki arama çubuğunu kullanarak belirli bir aracı filtreleyebilir, detaylar için kartlara tıklayabilirsiniz.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredFinancialVehicles.map(v => {
                    const fin = v.financials || { monthlyIncome: 0, insuranceCost: 0, otherExpenses: 0 };
                    const maintenanceCost = getVehicleTotalMaintenanceCost(v.id);
                    const totalExpense = maintenanceCost + fin.insuranceCost + fin.otherExpenses;
                    const netProfit = fin.monthlyIncome - totalExpense;

                    return (
                      <div 
                        key={v.id} 
                        onClick={() => setChartModalVehicle(v)}
                        className="bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-blue-500/50 p-5 rounded-xl space-y-4 transition cursor-pointer shadow-lg group"
                      >
                        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                          <div>
                            <h4 className="font-bold text-white text-base font-mono group-hover:text-blue-400 transition">{v.plate}</h4>
                            <p className="text-xs text-slate-400">{v.brand} {v.model}</p>
                          </div>
                          <span className={`text-sm font-bold px-3 py-1 rounded-lg ${netProfit >= 0 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'}`}>
                            Net: {netProfit >= 0 ? `+${netProfit.toLocaleString()} TL` : `${netProfit.toLocaleString()} TL`}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-xs bg-slate-950 p-3 rounded-lg border border-slate-800/80 text-center">
                          <div>
                            <span className="text-slate-400 block text-[10px]">Aylık Gelir</span>
                            <span className="text-emerald-400 font-bold text-sm">{fin.monthlyIncome.toLocaleString()} TL</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px]">Bakım (Otomatik)</span>
                            <span className="text-amber-400 font-bold text-sm">{maintenanceCost.toLocaleString()} TL</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px]">Diğer Giderler</span>
                            <span className="text-rose-400 font-bold text-sm">{(fin.insuranceCost + fin.otherExpenses).toLocaleString()} TL</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'maintenance_history' && hasPermission('maintenance') && (
              <div className="space-y-6">
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
                      <Wrench className="text-amber-400" /> Filo Araçları Bakım & Servis Geçmişi
                    </h3>
                    <p className="text-slate-400 text-xs">Buraya eklenen her bakım maliyeti otomatik olarak Finans & Kar Analizi sayfasına yansıtılır.</p>
                  </div>
                  {hasActionPermission('create') && (
                    <button 
                      onClick={() => setShowAddMaintenanceModal(true)}
                      className="bg-amber-600 hover:bg-amber-500 text-white text-xs px-4 py-2.5 rounded-lg flex items-center gap-1.5 font-semibold transition shadow-lg shadow-amber-600/25 cursor-pointer shrink-0"
                    >
                      <Plus size={16} /> Yeni Bakım Ekle
                    </button>
                  )}
                </div>

                <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-900 text-slate-400 font-semibold border-b border-slate-800">
                      <tr>
                        <th className="p-4">Plaka</th>
                        <th className="p-4">Bakım Türü</th>
                        <th className="p-4">Tarih</th>
                        <th className="p-4">Bakım KM</th>
                        <th className="p-4">Servis / Nokta</th>
                        <th className="p-4">Maliyet</th>
                        <th className="p-4">Açıklama / Not</th>
                        {hasActionPermission('delete') && <th className="p-4 text-right">İşlem</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {filteredMaintenanceRecords.length === 0 ? (
                        <tr>
                          <td colSpan="8" className="p-6 text-center text-slate-500 italic text-xs">Kayıtlı bakım geçmişi bulunmuyor.</td>
                        </tr>
                      ) : (
                        filteredMaintenanceRecords.map(rec => (
                          <tr key={rec.id} className="hover:bg-slate-800/40 text-xs">
                            <td className="p-4 font-bold text-white font-mono text-sm">{rec.plate}</td>
                            <td className="p-4 font-semibold text-amber-400">{rec.type}</td>
                            <td className="p-4 text-slate-300">{rec.date}</td>
                            <td className="p-4 text-blue-400 font-medium">{rec.km?.toLocaleString()} KM</td>
                            <td className="p-4 text-slate-300">{rec.service}</td>
                            <td className="p-4 text-rose-400 font-bold">{rec.cost?.toLocaleString()} TL</td>
                            <td className="p-4 text-slate-400 max-w-xs truncate">{rec.note}</td>
                            {hasActionPermission('delete') && (
                              <td className="p-4 text-right">
                                <button onClick={() => handleDeleteMaintenanceRecord(rec.id)} className="bg-rose-600/20 hover:bg-rose-600/40 text-rose-400 p-2 rounded-lg transition cursor-pointer" title="Bakım Kaydını Sil">
                                  <Trash2 size={14} />
                                </button>
                              </td>
                            )}
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'add_new_vehicle_page' && hasPermission('vehicles') && hasActionPermission('create') && (
              <div className="space-y-6 max-w-5xl mx-auto">
                <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setActiveTab('all')} className="bg-slate-900 hover:bg-slate-800 p-2 rounded-lg text-slate-400 hover:text-white cursor-pointer">
                      <ArrowLeft size={20} />
                    </button>
                    <div>
                      <h2 className="text-2xl font-bold text-white">GMG GRUP Filosuna Yeni Araç Ekle</h2>
                      <p className="text-xs text-slate-400 mt-0.5">Aracın ruhsat, sigorta, finans ve zimmetli sürücü bilgilerini eksiksiz tanımlayın.</p>
                    </div>
                  </div>
                  <button onClick={() => setActiveTab('all')} className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg cursor-pointer">
                    İptal Et / Geri Dön
                  </button>
                </div>

                <form onSubmit={handleSaveFullNewVehicle} className="space-y-6">
                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
                    <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider flex items-center gap-2">
                      <Car size={18} /> 1. Temel Ruhsat Bilgileri
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      <div>
                        <label className="text-slate-400 font-medium">Plaka *</label>
                        <input required type="text" placeholder="34 ABC 123" value={fullNewVehicle.plate} onChange={e => setFullNewVehicle({...fullNewVehicle, plate: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white mt-1 text-sm font-mono font-bold" />
                      </div>
                      <div>
                        <label className="text-slate-400 font-medium">Marka *</label>
                        <input required type="text" placeholder="Renault" value={fullNewVehicle.brand} onChange={e => setFullNewVehicle({...fullNewVehicle, brand: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white mt-1" />
                      </div>
                      <div>
                        <label className="text-slate-400 font-medium">Model *</label>
                        <input required type="text" placeholder="Megane 1.5 dCi" value={fullNewVehicle.model} onChange={e => setFullNewVehicle({...fullNewVehicle, model: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white mt-1" />
                      </div>
                      <div>
                        <label className="text-slate-400 font-medium">Model Yılı</label>
                        <input type="number" value={fullNewVehicle.year} onChange={e => setFullNewVehicle({...fullNewVehicle, year: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white mt-1" />
                      </div>
                      <div>
                        <label className="text-slate-400 font-medium">Mevcut KM *</label>
                        <input required type="number" placeholder="45000" value={fullNewVehicle.currentKm} onChange={e => setFullNewVehicle({...fullNewVehicle, currentKm: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white mt-1" />
                      </div>
                      <div>
                        <label className="text-slate-400 font-medium">Sonraki Bakım KM *</label>
                        <input required type="number" placeholder="60000" value={fullNewVehicle.nextMaintenanceKm} onChange={e => setFullNewVehicle({...fullNewVehicle, nextMaintenanceKm: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white mt-1" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
                    <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                      <Calendar size={18} /> 2. Muayene & Sigorta Poliçe Bilgileri
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      <div>
                        <label className="text-slate-400 font-medium">Muayene Bitiş Tarihi</label>
                        <input type="date" value={fullNewVehicle.inspectionDate} onChange={e => setFullNewVehicle({...fullNewVehicle, inspectionDate: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white mt-1" />
                      </div>
                      <div>
                        <label className="text-slate-400 font-medium">Trafik Sigortası Bitiş Tarihi</label>
                        <input type="date" value={fullNewVehicle.insuranceDate} onChange={e => setFullNewVehicle({...fullNewVehicle, insuranceDate: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white mt-1" />
                      </div>
                      <div>
                        <label className="text-slate-400 font-medium">Sigorta Poliçe No</label>
                        <input type="text" placeholder="POL-123456" value={fullNewVehicle.insurancePolicyNo} onChange={e => setFullNewVehicle({...fullNewVehicle, insurancePolicyNo: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white mt-1" />
                      </div>
                      <div>
                        <label className="text-slate-400 font-medium">Kasko Poliçe Bitiş Tarihi</label>
                        <input type="date" value={fullNewVehicle.cascoDate} onChange={e => setFullNewVehicle({...fullNewVehicle, cascoDate: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white mt-1" />
                      </div>
                      <div>
                        <label className="text-slate-400 font-medium">Kasko Poliçe No</label>
                        <input type="text" placeholder="KSK-987654" value={fullNewVehicle.cascoPolicyNo} onChange={e => setFullNewVehicle({...fullNewVehicle, cascoPolicyNo: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white mt-1" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
                    <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                      <DollarSign size={18} /> 3. Finansal Gelir & Gider Kalemleri (Aylık)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      <div>
                        <label className="text-slate-400 font-medium">Aylık Kira Geliri (TL)</label>
                        <input type="number" placeholder="30000" value={fullNewVehicle.monthlyIncome} onChange={e => setFullNewVehicle({...fullNewVehicle, monthlyIncome: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white mt-1" />
                      </div>
                      <div>
                        <label className="text-slate-400 font-medium">Aylık Kasko/Sigorta (TL)</label>
                        <input type="number" placeholder="1500" value={fullNewVehicle.insuranceCost} onChange={e => setFullNewVehicle({...fullNewVehicle, insuranceCost: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white mt-1" />
                      </div>
                      <div>
                        <label className="text-slate-400 font-medium">Diğer Aylık Giderler (TL)</label>
                        <input type="number" placeholder="500" value={fullNewVehicle.otherExpenses} onChange={e => setFullNewVehicle({...fullNewVehicle, otherExpenses: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white mt-1" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
                      <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-wider flex items-center gap-2">
                        <UserCheck size={18} /> 4. Zimmetli Sürücü Bilgileri
                      </h3>
                      <div className="space-y-3 text-xs">
                        <div>
                          <label className="text-slate-400 font-medium">Sürücü Seçin</label>
                          <select 
                            value={fullNewVehicle.driverName} 
                            onChange={e => {
                              const selectedName = e.target.value;
                              const matchedDrv = uniqueDriversForSelect.find(d => d.name === selectedName);
                              setFullNewVehicle({
                                ...fullNewVehicle, 
                                driverName: selectedName,
                                driverPhone: matchedDrv ? matchedDrv.phone : '',
                                licenseClass: matchedDrv ? (matchedDrv.licenseClass || 'B') : 'B'
                              });
                            }} 
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white mt-1"
                          >
                            <option value="">-- Sürücü Seçiniz (Zimmetsiz / Boş) --</option>
                            {uniqueDriversForSelect.map((drv, idx) => (
                              <option key={idx} value={drv.name}>
                                {drv.name} ({drv.sourceLabel})
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-slate-400 font-medium">Telefon (Otomatik)</label>
                            <input type="text" readOnly value={fullNewVehicle.driverPhone} placeholder="Seçilen sürücü telefonu" className="w-full bg-slate-950/60 border border-slate-800 rounded-lg p-2.5 text-slate-300 mt-1 cursor-not-allowed" />
                          </div>
                          <div>
                            <label className="text-slate-400 font-medium">Ehliyet Sınıfı (Otomatik)</label>
                            <input type="text" readOnly value={fullNewVehicle.licenseClass} placeholder="B" className="w-full bg-slate-950/60 border border-slate-800 rounded-lg p-2.5 text-slate-300 mt-1 cursor-not-allowed" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
                      <h3 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                        <HardDrive size={18} /> 5. İlk Lastik Tanımlaması
                      </h3>
                      <div className="space-y-3 text-xs">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-slate-400 font-medium">Lastik Tipi</label>
                            <select value={fullNewVehicle.tireType} onChange={e => setFullNewVehicle({...fullNewVehicle, tireType: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white mt-1">
                              <option value="Yazlık">Yazlık</option>
                              <option value="Kışlık">Kışlık</option>
                              <option value="4 Mevsim">4 Mevsim</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-slate-400 font-medium">Diş Derinliği</label>
                            <input type="text" placeholder="8.0mm" value={fullNewVehicle.tireDepth} onChange={e => setFullNewVehicle({...fullNewVehicle, tireDepth: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white mt-1" />
                          </div>
                        </div>
                        <div>
                          <label className="text-slate-400 font-medium">Marka / Ebat</label>
                          <input type="text" placeholder="Michelin 205/55 R16" value={fullNewVehicle.tireBrand} onChange={e => setFullNewVehicle({...fullNewVehicle, tireBrand: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white mt-1" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                    <button type="button" onClick={() => setActiveTab('all')} className="px-5 py-2.5 bg-slate-800 text-slate-300 hover:text-white rounded-lg text-sm font-medium cursor-pointer">İptal</button>
                    <button type="submit" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-bold shadow-lg shadow-blue-600/30 cursor-pointer">Aracı Filoya Kaydet</button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'drivers' && hasPermission('drivers') && (
              <div className="space-y-6">
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
                      <Users className="text-purple-400" /> Kayıtlı Sürücü Yönetimi & Evrak Sayfası
                    </h3>
                    <p className="text-slate-400 text-xs">Sürücülerin ehliyet, SRC, psikoteknik bilgilerini, PDF evraklarını ve sürücü silme işlemlerini buradan yönetebilirsiniz.</p>
                  </div>
                  {hasActionPermission('create') && (
                    <button 
                      onClick={() => setShowAddDriverModal(true)}
                      className="bg-purple-600 hover:bg-purple-500 text-white text-xs px-4 py-2.5 rounded-lg flex items-center gap-1.5 font-semibold transition shadow-lg shadow-purple-600/20 cursor-pointer shrink-0"
                    >
                      <Plus size={16} /> Yeni Sürücü Ekle
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredDrivers.map(item => (
                    <div key={item.key} className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
                      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                        <div>
                          <span className="text-xs text-slate-400">Zimmetli Araçlar / Konum:</span>
                          <div className="space-y-0.5 mt-1">
                            {item.assignedVehicles.length === 0 ? (
                              <h4 className="text-sm font-bold text-slate-400 font-mono">Araçsız (Bağımsız Sürücü)</h4>
                            ) : (
                              item.assignedVehicles.map((veh, idx) => (
                                <h4 key={idx} className="text-sm font-bold text-white font-mono">
                                  • {veh.plate} ({veh.brand} {veh.model})
                                </h4>
                              ))
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {editingDriverKey === item.key ? (
                            hasActionPermission('edit') && (
                              <button onClick={() => handleSaveDriverPageEdit(item)} className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 font-semibold cursor-pointer">
                                <Save size={14} /> Kaydet
                              </button>
                            )
                          ) : (
                            hasActionPermission('edit') && (
                              <button onClick={() => handleStartDriverEdit(item)} className="bg-slate-800 hover:bg-slate-700 text-purple-300 text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer">
                                <Edit3 size={14} /> Düzenle
                              </button>
                            )
                          )}
                          {hasActionPermission('delete') && (
                            <button onClick={() => handleDeleteDriver(item)} className="bg-rose-600/20 hover:bg-rose-600/40 text-rose-400 border border-rose-500/30 text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer" title="Sürücüyü Sil">
                              <Trash2 size={14} /> Sil
                            </button>
                          )}
                        </div>
                      </div>

{editingDriverKey === item.key ? (
                        <div className="space-y-3 text-xs">
                          <div>
                            <label className="text-slate-400">Sürücü Adı Soyadı</label>
                            <input type="text" value={driverEditForm.name} onChange={e => setDriverEditForm({...driverEditForm, name: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white mt-1" />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-slate-400">Telefon</label>
                              <input type="text" value={driverEditForm.phone} onChange={e => setDriverEditForm({...driverEditForm, phone: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white mt-1" />
                            </div>
                            <div>
                              <label className="text-slate-400">Ehliyet Sınıfı</label>
                              <input type="text" value={driverEditForm.licenseClass} onChange={e => setDriverEditForm({...driverEditForm, licenseClass: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white mt-1" />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-slate-400">SRC Belge Türü</label>
                              <input type="text" placeholder="SRC-2" value={driverEditForm.srcType} onChange={e => setDriverEditForm({...driverEditForm, srcType: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white mt-1" />
                            </div>
                            <div>
                              <label className="text-slate-400">SRC Bitiş Tarihi</label>
                              <input type="date" value={driverEditForm.srcExpiryDate} onChange={e => setDriverEditForm({...driverEditForm, srcExpiryDate: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white mt-1" />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2 text-xs bg-slate-950 p-4 rounded-lg border border-slate-800/80">
                          <div className="flex justify-between"><span className="text-slate-400">Sürücü Adı:</span> <span className="text-white font-bold text-sm">{item.name}</span></div>
                          <div className="flex justify-between"><span className="text-slate-400">Telefon:</span> <span className="text-slate-300">{item.phone}</span></div>
                          <div className="flex justify-between"><span className="text-slate-400">Ehliyet Sınıfı:</span> <span className="text-purple-300 font-bold">{item.licenseClass || '-'}</span></div>
                          <div className="flex justify-between"><span className="text-slate-400">SRC Belgesi:</span> <span className="text-cyan-300 font-medium">{item.srcType || '-'} ({item.srcExpiryDate || 'Tarih yok'})</span></div>
                        </div>
                      )}

                      <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-semibold text-cyan-400 flex items-center gap-1">
                            <FolderDown size={14} /> Sürücü Evrakları (PDF)
                          </span>
                          {(hasActionPermission('create') || hasActionPermission('edit')) && (
                            <label className="text-[10px] bg-cyan-600/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded cursor-pointer hover:bg-cyan-600/40 flex items-center gap-1 notranslate" translate="no">
                              <Upload size={11} /> <span translate="no">Evrak Yükle</span>
                              <input type="file" accept=".pdf,image/*" onChange={(e) => handleDriverDocUploadPage(e, item)} className="hidden" />
                            </label>
                          )}
                        </div>

                        {(!item.documents || item.documents.length === 0) ? (
                          <p className="text-[11px] text-slate-500 italic py-1">Yüklü evrak bulunmuyor.</p>
                        ) : (
                          <div className="space-y-1">
                            {item.documents.map(doc => (
                              <div key={doc.id} className="flex justify-between items-center bg-slate-900 p-2 rounded text-xs border border-slate-800">
                                <span className="truncate text-slate-300 text-[11px]">{doc.name}</span>
                                <div className="flex items-center gap-2">
                                  <a href={doc.fileUrl} download={doc.name} className="text-blue-400 hover:underline text-[11px]">İndir</a>
                                  {hasActionPermission('delete') && (
                                    <button onClick={() => handleDeleteDriverDoc(item, doc.id)} className="text-rose-400 hover:text-rose-300 cursor-pointer" title="Evrakı Sil">
                                      <Trash2 size={13} />
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'equipments' && hasPermission('equipments') && (
              <div className="space-y-6">
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
                      <HardDrive className="text-emerald-400" /> Ekipmanlar & Çoklu Lastik Depo Yönetim Sayfası
                    </h3>
                    <p className="text-slate-400 text-xs">Arama çubuğunu kullanarak plaka, lastik markası veya depolama konumuna göre arama yapabilirsiniz.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredEquipmentVehicles.map(v => (
                    <div key={v.id} className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
                      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                        <div>
                          <span className="font-bold text-white text-base">{v.plate}</span>
                          <span className="text-slate-400 text-xs ml-2">({v.brand} {v.model})</span>
                        </div>
                        {hasActionPermission('create') && (
                          <button 
                            onClick={() => handleOpenAddTireModal(v.id)} 
                            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer font-medium"
                          >
                            <PlusCircle size={14} /> Yeni Lastik Tanımla
                          </button>
                        )}
                      </div>

                      <div className="space-y-2">
                        {(!v.tires || v.tires.length === 0) ? (
                          <p className="text-xs text-slate-500 italic py-2">Bu araca tanımlı lastik bulunmuyor.</p>
                        ) : (
                          v.tires.map(tire => (
                            <div key={tire.id} className="bg-slate-950 p-3 rounded-lg border border-slate-800/80 text-xs space-y-1.5 relative group">
                              <div className="flex justify-between font-semibold">
                                <span className={tire.position === 'Üzerinde Takılı' ? 'text-blue-400' : 'text-amber-400'}>
                                  • {tire.position} ({tire.type})
                                </span>
                                <div className="flex items-center gap-2">
                                  <span className="text-emerald-400">{tire.depth} Diş</span>
                                  {hasActionPermission('edit') && (
                                    <button 
                                      onClick={() => handleOpenAddTireModal(v.id, tire)} 
                                      className="text-slate-400 hover:text-white p-0.5 rounded cursor-pointer"
                                      title="Düzenle"
                                    >
                                      <Edit3 size={13} />
                                    </button>
                                  )}
                                  {hasActionPermission('delete') && (
                                    <button 
                                      onClick={() => handleDeleteTire(v.id, tire.id)} 
                                      className="text-rose-400 hover:text-rose-300 p-0.5 rounded cursor-pointer ml-1"
                                      title="Lastiği Sil"
                                    >
                                      <Trash2 size={13} />
                                    </button>
                                  )}
                                </div>
                              </div>
                              <div className="text-slate-300">Marka/Ebat: {tire.brand} {tire.serialNo ? `(Seri: ${tire.serialNo})` : ''}</div>
                              <div className="text-slate-400 flex items-center justify-between">
                                <span>Konum: {tire.location}</span>
                                {tire.phone && <span className="text-cyan-400 font-mono">Tel: {tire.phone}</span>}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'company_docs' && hasPermission('company_docs') && (
              <div className="space-y-6">
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
                      <Building2 className="text-indigo-400" /> Şirket & Kurumsal Sözleşmeler Kütüphanesi
                    </h3>
                    <p className="text-slate-400 text-xs">Şirketler arası uzun vadeli tedarik, filo kiralama sözleşmeleri ve kurumsal evraklar.</p>
                  </div>
                  {hasActionPermission('create') && (
                    <button 
                      onClick={() => setShowCompanyDocModal(true)}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-4 py-2.5 rounded-lg flex items-center gap-1.5 font-semibold transition shadow-lg shadow-indigo-600/25 cursor-pointer shrink-0"
                    >
                      <Plus size={16} /> Yeni Şirket Evrakı Ekle
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {companyDocs.map(doc => (
                    <div key={doc.id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <Building2 className="text-indigo-400" size={24} />
                        <div>
                          <h4 className="font-bold text-white text-sm">{doc.name}</h4>
                          <p className="text-xs text-slate-400">{doc.category} • Firma: {doc.company}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">Bitiş Tarihi: {doc.expiry}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <a href={doc.fileUrl || '#'} download={doc.name} className="bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/40 border border-indigo-500/30 px-3 py-1.5 rounded text-xs font-semibold">İndir</a>
                        {hasActionPermission('delete') && (
                          <button onClick={() => handleDeleteCompanyDoc(doc.id)} className="bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 border border-rose-500/30 p-1.5 rounded cursor-pointer" title="Evrakı Sil">
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'documents' && hasPermission('documents') && (
              <div className="space-y-6">
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
                    <FolderDown className="text-cyan-400" /> Araç Evrak & Sigorta Poliçeleri Kütüphanesi
                  </h3>
                  <p className="text-slate-400 text-xs">Aşağıdaki araçlara ait PDF sigorta ve kasko poliçelerini indirebilir veya yenilerini yükleyebilirsiniz.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredVehicles.map(v => (
                    <div key={v.id} className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-3">
                      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                        <div>
                          <span className="font-bold text-white text-base">{v.plate}</span>
                          <span className="text-slate-400 text-xs ml-2">({v.brand} {v.model})</span>
                        </div>
                        {hasActionPermission('create') && (
                          <label className="bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer border border-slate-700 notranslate" translate="no">
                            <Upload size={14} /> <span translate="no">PDF Yükle</span>
                            <input type="file" accept=".pdf" onChange={(e) => handleFileUpload(e, v.id)} className="hidden" />
                          </label>
                        )}
                      </div>

                      {v.documents.length === 0 ? (
                        <p className="text-xs text-slate-500 italic py-2">Henüz kayıtlı PDF poliçesi bulunmuyor.</p>
                      ) : (
                        <div className="space-y-2">
                          {v.documents.map(doc => (
                            <div key={doc.id} className="flex justify-between items-center bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 text-xs">
                              <div className="flex items-center gap-2">
                                <FileText className="text-rose-400" size={16} />
                                <div>
                                  <div className="font-medium text-white">{doc.name}</div>
                                  <div className="text-[10px] text-slate-500">{doc.type} • Yüklenme: {doc.date}</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <a href={doc.fileUrl} download={doc.name} className="bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 px-2.5 py-1 rounded flex items-center gap-1 text-[11px] border border-blue-500/30">
                                  <FolderDown size={13} /> İndir
                                </a>
                                {hasActionPermission('delete') && (
                                  <button onClick={() => handleDeleteVehicleDoc(v.id, doc.id)} className="text-rose-400 hover:text-rose-300 p-1 cursor-pointer" title="Poliçeyi Sil">
                                    <Trash2 size={14} />
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(activeTab === 'all' || activeTab === 'rented' || activeTab === 'available' || activeTab === 'maintenance' || activeTab === 'kabis') && hasPermission('vehicles') && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-xs font-semibold uppercase">Toplam Araç</p>
                      <p className="text-2xl font-bold text-white mt-1">{realVehicles.length}</p>
                    </div>
                    <Car className="text-blue-400" size={28} />
                  </div>
                  <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-xs font-semibold uppercase">Kiradaki Araçlar</p>
                      <p className="text-2xl font-bold text-emerald-400 mt-1">
                        {realVehicles.filter(v => v.status === 'Rented').length}
                      </p>
                    </div>
                    <Key className="text-emerald-400" size={28} />
                  </div>
                  <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-xs font-semibold uppercase">KABİS Bildirimleri</p>
                      <p className="text-2xl font-bold text-indigo-400 mt-1">
                        {realVehicles.filter(v => v.kabisStatus === 'Registered').length} Aktif
                      </p>
                    </div>
                    <ShieldCheck className="text-indigo-400" size={28} />
                  </div>
                  <div 
                    onClick={() => setActiveTab('notifications')}
                    className="bg-slate-900/80 border border-slate-800 hover:border-rose-500/50 p-4 rounded-xl flex items-center justify-between cursor-pointer transition shadow"
                  >
                    <div>
                      <p className="text-slate-400 text-xs font-semibold uppercase">Kritik Bildirimler</p>
                      <p className="text-2xl font-bold text-rose-400 mt-1">
                        {notificationList.length}
                      </p>
                    </div>
                    <Bell className="text-rose-400 animate-bounce" size={28} />
                  </div>
                </div>

                <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-900 text-slate-400 font-semibold border-b border-slate-800">
                      <tr>
                        <th className="p-4">Plaka / Araç</th>
                        <th className="p-4">Durum</th>
                        <th className="p-4">KABİS Durumu</th>
                        <th className="p-4">KM & Bakım</th>
                        <th className="p-4">Muayene / Sigorta</th>
                        <th className="p-4">Sürücü (Zimmet)</th>
                        <th className="p-4 text-right">İşlem</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {filteredVehicles.map((vehicle) => {
                        const kmDiff = vehicle.nextMaintenanceKm - vehicle.currentKm;
                        return (
                          <tr key={vehicle.id} onClick={() => handleOpenDetailModal(vehicle)} className="hover:bg-slate-800/40 transition cursor-pointer">
                            <td className="p-4">
                              <div className="font-bold text-white text-base">{vehicle.plate}</div>
                              <div className="text-slate-400 text-xs">{vehicle.brand} {vehicle.model} ({vehicle.year})</div>
                            </td>
                            <td className="p-4">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                vehicle.status === 'Rented' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                vehicle.status === 'Available' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              }`}>
                                {vehicle.status === 'Rented' ? 'Kirada' : vehicle.status === 'Available' ? 'Garajda / Boşta' : 'Bakımda'}
                              </span>
                            </td>
                            <td className="p-4">
                              <button
                                onClick={(e) => { e.stopPropagation(); handleInitiateKabisToggle(vehicle); }}
                                className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1 cursor-pointer transition ${
                                  vehicle.kabisStatus === 'Registered' 
                                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/40' 
                                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                }`}
                              >
                                <ShieldCheck size={13} /> {vehicle.kabisStatus === 'Registered' ? 'E-Emniyet Bildirildi' : 'Bildirilmedi (Bekliyor)'}
                              </button>
                            </td>
                            <td className="p-4">
                              <div className="text-white">{vehicle.currentKm.toLocaleString()} KM</div>
                              <div className={`text-xs ${kmDiff <= 1000 ? 'text-amber-400 font-bold' : 'text-slate-400'}`}>
                                Bakıma: {kmDiff.toLocaleString()} KM (Sonraki: {vehicle.nextMaintenanceKm.toLocaleString()})
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-1 text-slate-300 text-xs">
                                <Calendar size={13} className="text-blue-400" /> Muayene: {vehicle.inspectionDate}
                              </div>
                              <div className="flex items-center gap-1 text-slate-300 text-xs mt-1">
                                <FileText size={13} className="text-emerald-400" /> Sigorta: {vehicle.insuranceDate}
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-1.5 text-slate-200">
                                <UserCheck size={14} className="text-slate-400" /> {vehicle.driver.name}
                              </div>
                              <div className="text-slate-500 text-xs">{vehicle.driver.phone}</div>
                            </td>
                            <td className="p-4 text-right">
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleOpenDetailModal(vehicle); }}
                                className="bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-lg transition cursor-pointer"
                              >
                                <ChevronRight size={16} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </>
        )}
      </main>

      {/* MODALLAR */}
      {chartModalVehicle && (() => {
        const fin = chartModalVehicle.financials || { monthlyIncome: 0, insuranceCost: 0, otherExpenses: 0 };
        const maintenanceCost = getVehicleTotalMaintenanceCost(chartModalVehicle.id);
        const totalExpense = maintenanceCost + fin.insuranceCost + fin.otherExpenses;
        const netProfit = fin.monthlyIncome - totalExpense;

        const chartColumns = [
          { label: 'Kira Geliri', income: fin.monthlyIncome, expense: 0 },
          { label: 'Bakım Maliyeti', income: 0, expense: maintenanceCost },
          { label: 'Sigorta/Kasko', income: 0, expense: fin.insuranceCost },
          { label: 'Diğer Gider', income: 0, expense: fin.otherExpenses }
        ];

        return (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[80]">
            <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-2xl p-6 space-y-6 shadow-2xl">
              <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-lg font-bold text-white font-mono">{chartModalVehicle.plate} - Gelir / Gider Dengesi</h3>
                  <p className="text-xs text-slate-400">{chartModalVehicle.brand} {chartModalVehicle.model} için Araç Bazlı Çubuk Grafik Analizi</p>
                </div>
                <button onClick={() => setChartModalVehicle(null)} className="text-slate-400 hover:text-white cursor-pointer"><X size={20} /></button>
              </div>

              <div className="bg-white p-5 rounded-xl text-slate-900 space-y-4 shadow-inner">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm flex items-center gap-1.5 text-slate-800">
                    <BarChart3 size={16} className="text-emerald-600" /> Gelir / Gider Dengesi
                  </span>
                  <div className="flex items-center gap-4 text-xs font-semibold">
                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-emerald-500 rounded-sm inline-block"></span> GELİR</span>
                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-rose-500 rounded-sm inline-block"></span> GİDER</span>
                  </div>
                </div>

                <div className="relative h-48 border-b border-slate-200 flex items-end justify-around px-2 pt-6 pb-2">
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                    <div className="border-b border-slate-400 w-full text-[10px] text-right pr-1">40k</div>
                    <div className="border-b border-slate-400 w-full text-[10px] text-right pr-1">30k</div>
                    <div className="border-b border-slate-400 w-full text-[10px] text-right pr-1">20k</div>
                    <div className="border-b border-slate-400 w-full text-[10px] text-right pr-1">10k</div>
                    <div className="border-b border-slate-400 w-full text-[10px] text-right pr-1">0k</div>
                  </div>

                  {chartColumns.map((col, idx) => {
                    const maxScale = 45000;
                    const incHeight = Math.min(Math.round((col.income / maxScale) * 100), 100);
                    const expHeight = Math.min(Math.round((col.expense / maxScale) * 100), 100);

                    return (
                      <div key={idx} className="flex flex-col items-center flex-1 z-10 h-full justify-end px-2">
                        <div className="flex items-end gap-2 h-36 w-full justify-center">
                          {col.income > 0 ? (
                            <div 
                              style={{ height: `${Math.max(incHeight, 10)}%` }} 
                              className="w-6 bg-emerald-500 rounded-t transition-all relative group/tip"
                              title={`Gelir: ${col.income.toLocaleString()} TL`}
                            ></div>
                          ) : <div className="w-6"></div>}

                          {col.expense > 0 ? (
                            <div 
                              style={{ height: `${Math.max(expHeight, 10)}%` }} 
                              className="w-6 bg-rose-500 rounded-t transition-all relative group/tip"
                              title={`Gider: ${col.expense.toLocaleString()} TL`}
                            ></div>
                          ) : <div className="w-6"></div>}
                        </div>
                        <span className="text-[11px] font-semibold text-slate-700 mt-2 text-center">{col.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs bg-slate-950 p-3 rounded-lg border border-slate-800 text-center">
                <div>
                  <span className="text-slate-400 block text-[10px]">Aylık Gelir</span>
                  <span className="text-emerald-400 font-bold text-sm">{fin.monthlyIncome.toLocaleString()} TL</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Toplam Gider</span>
                  <span className="text-rose-400 font-bold text-sm">{totalExpense.toLocaleString()} TL</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Net Kar/Zarar</span>
                  <span className={`font-bold text-sm ${netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {netProfit >= 0 ? `+${netProfit.toLocaleString()} TL` : `${netProfit.toLocaleString()} TL`}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end">
                <button 
                  onClick={() => setChartModalVehicle(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium cursor-pointer"
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {showAddUserModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-[90]">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-md p-6 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2"><Shield className="text-purple-400" size={18} /> Yeni Personel / Kullanıcı Ekle</h3>
              <button onClick={() => setShowAddUserModal(false)} className="text-slate-400 hover:text-white cursor-pointer"><X size={18} /></button>
            </div>
            <form onSubmit={handleSaveNewUser} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400">Kullanıcı Adı</label>
                <input required type="text" placeholder="ahmet vb." value={newUserForm.username} onChange={e => setNewUserForm({...newUserForm, username: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white mt-1 font-mono" />
              </div>
              <div>
                <label className="text-xs text-slate-400">Şifre</label>
                <input required type="password" placeholder="Şifre belirleyin" value={newUserForm.password} onChange={e => setNewUserForm({...newUserForm, password: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white mt-1" />
              </div>
              <div>
                <label className="text-xs text-slate-400">Adı Soyadı</label>
                <input required type="text" placeholder="Ahmet Yılmaz" value={newUserForm.name} onChange={e => setNewUserForm({...newUserForm, name: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white mt-1" />
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-end gap-2">
                <button type="button" onClick={() => setShowAddUserModal(false)} className="px-3 py-1.5 bg-slate-800 text-white rounded text-xs cursor-pointer">Vazgeç</button>
                <button type="submit" className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded text-xs font-semibold cursor-pointer">Kullanıcıyı Kaydet</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAddMaintenanceModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-[70]">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Wrench className="text-amber-400" size={18} />
                Yeni Bakım / Servis Kaydı Ekle
              </h3>
              <button onClick={() => setShowAddMaintenanceModal(false)} className="text-slate-400 hover:text-white cursor-pointer"><X size={18} /></button>
            </div>

            <form onSubmit={handleSaveNewMaintenance} className="space-y-3 my-3">
              <div>
                <label className="text-xs text-slate-400">Araç (Plaka)</label>
                <select value={newMaintenanceForm.vehicleId} onChange={e => setNewMaintenanceForm({...newMaintenanceForm, vehicleId: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white mt-1">
                  {realVehicles.map(v => (
                    <option key={v.id} value={v.id}>{v.plate} ({v.brand} {v.model})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-slate-400">Bakım Tarihi</label>
                  <input required type="date" value={newMaintenanceForm.date} onChange={e => setNewMaintenanceForm({...newMaintenanceForm, date: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white mt-1" />
                </div>
                <div>
                  <label className="text-xs text-slate-400">Bakım KM</label>
                  <input required type="number" placeholder="45000" value={newMaintenanceForm.km} onChange={e => setNewMaintenanceForm({...newMaintenanceForm, km: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white mt-1" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-slate-400">Bakım Türü</label>
                  <input required type="text" placeholder="Periyodik / Balata / Akü" value={newMaintenanceForm.type} onChange={e => setNewMaintenanceForm({...newMaintenanceForm, type: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white mt-1" />
                </div>
                <div>
                  <label className="text-xs text-slate-400">Toplam Maliyet (TL)</label>
                  <input required type="number" placeholder="3500" value={newMaintenanceForm.cost} onChange={e => setNewMaintenanceForm({...newMaintenanceForm, cost: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white mt-1" />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400">Servis / Tamirhane Adı</label>
                <input type="text" placeholder="Renault Yetkili Servis" value={newMaintenanceForm.service} onChange={e => setNewMaintenanceForm({...newMaintenanceForm, service: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white mt-1" />
              </div>

              <div>
                <label className="text-xs text-slate-400">Yapılan İşlem / Notlar</label>
                <textarea rows="2" placeholder="Yağ ve filtre değişimi yapıldı." value={newMaintenanceForm.note} onChange={e => setNewMaintenanceForm({...newMaintenanceForm, note: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white mt-1 resize-none"></textarea>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button type="button" onClick={() => setShowAddMaintenanceModal(false)} className="px-3 py-1.5 bg-slate-800 text-white rounded text-xs cursor-pointer">İptal</button>
                <button type="submit" className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded text-xs font-semibold cursor-pointer">Bakım Kaydını Kaydet</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {kabisConfirmModal.show && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[70]">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-amber-400">
              <AlertCircle size={28} />
              <h3 className="text-lg font-bold text-white">KABİS Durum Değişikliği Onayı</h3>
            </div>
            
            <p className="text-slate-300 text-xs leading-relaxed">
              <span className="font-bold text-white font-mono">{kabisConfirmModal.plate}</span> plakalı aracın E-Emniyet KABİS bildirim durumunu <span className="font-semibold text-amber-300">{kabisConfirmModal.targetStatus === 'Registered' ? '"E-Emniyet Bildirildi"' : '"Bildirilmedi (Bekliyor)"'}</span> olarak değiştirmek istediğinize emin misiniz?
            </p>

            <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
              <button 
                type="button" 
                onClick={() => setKabisConfirmModal({ show: false, vehicleId: null, targetStatus: null, plate: '' })}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium cursor-pointer"
              >
                Vazgeç
              </button>
              <button 
                type="button" 
                onClick={handleConfirmKabisChange}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold shadow-lg shadow-indigo-600/30 cursor-pointer"
              >
                Evet, Durumu Güncelle
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedVehicle && editForm && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-4xl p-6 space-y-5 max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="flex justify-between items-start pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-white">{selectedVehicle.plate}</h2>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    selectedVehicle.status === 'Rented' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                    selectedVehicle.status === 'Available' ? 'bg-blue-500/10 text-blue-400' : 'bg-amber-500/10 text-amber-400'
                  }`}>
                    {selectedVehicle.status === 'Rented' ? 'Kirada' : selectedVehicle.status === 'Available' ? 'Garajda / Boşta' : 'Bakımda'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{selectedVehicle.brand} {selectedVehicle.model} ({selectedVehicle.year}) - Kontrol & Detay Kartı</p>
              </div>
              <div className="flex items-center gap-2">
                {!isEditingModal ? (
                  hasActionPermission('edit') && (
                    <button 
                      onClick={() => setIsEditingModal(true)} 
                      className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer"
                    >
                      <Edit3 size={14} /> Bilgileri Düzenle
                    </button>
                  )
                ) : (
                  hasActionPermission('edit') && (
                    <button 
                      onClick={handleSaveVehicleEdit} 
                      className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer font-semibold"
                    >
                      <Save size={14} /> Kaydet
                    </button>
                  )
                )}
                {hasActionPermission('delete') && (
                  <button onClick={() => handleDeleteVehicle(selectedVehicle.id)} className="bg-rose-600/20 hover:bg-rose-600/40 text-rose-400 border border-rose-500/30 text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer">
                    <Trash2 size={14} /> Aracı Sil
                  </button>
                )}
                <button onClick={() => setSelectedVehicle(null)} className="text-slate-400 hover:text-white cursor-pointer ml-2">
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex justify-between items-center">
              <span className="text-xs text-slate-400">Araç Hızlı Durum / Transfer İşlemleri:</span>
              <div className="flex items-center gap-2">
                {selectedVehicle.status === 'Available' && hasActionPermission('edit') && (
                  <>
                    <button 
                      onClick={() => handleSetMaintenanceStatus(selectedVehicle.id)} 
                      className="bg-amber-600 hover:bg-amber-500 text-white px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Wrench size={14} /> Doğrudan Bakıma Al
                    </button>
                    <button 
                      onClick={() => setShowRentModal(true)} 
                      className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <ArrowRightLeft size={14} /> Kiraya Çek
                    </button>
                  </>
                )}
                {selectedVehicle.status === 'Rented' && hasActionPermission('edit') && (
                  <button 
                    onClick={() => handleReturnToGarage(selectedVehicle.id)} 
                    className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowRightLeft size={14} /> Garaja Çek (Kirayı Bitir)
                  </button>
                )}
                {selectedVehicle.status === 'Maintenance' && hasActionPermission('edit') && (
                  <button 
                    onClick={() => handleReturnToGarage(selectedVehicle.id)} 
                    className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Wrench size={14} /> Bakımdan Çek (Garaja / Boşa Al)
                  </button>
                )}
              </div>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-2">
              <h3 className="text-xs font-semibold text-blue-400 flex items-center gap-1.5">
                <Car size={15} /> 1. Temel Ruhsat, Durum & Kilometre Bilgileri
              </h3>
              {isEditingModal ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="text-slate-400">Plaka</label>
                    <input type="text" value={editForm.plate} onChange={e => setEditForm({...editForm, plate: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-white mt-1 font-mono font-bold" />
                  </div>
                  <div>
                    <label className="text-slate-400">Araç Durumu</label>
                    <select value={editForm.status} onChange={e => setEditForm({...editForm, status: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-white mt-1">
                      <option value="Available">Garajda / Boşta</option>
                      <option value="Rented">Kirada</option>
                      <option value="Maintenance">Bakımda</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-400">Marka</label>
                    <input type="text" value={editForm.brand} onChange={e => setEditForm({...editForm, brand: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-white mt-1" />
                  </div>
                  <div>
                    <label className="text-slate-400">Model</label>
                    <input type="text" value={editForm.model} onChange={e => setEditForm({...editForm, model: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-white mt-1" />
                  </div>
                  <div>
                    <label className="text-slate-400">Mevcut KM</label>
                    <input type="number" value={editForm.currentKm} onChange={e => setEditForm({...editForm, currentKm: Number(e.target.value)})} className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-white mt-1" />
                  </div>
                  <div>
                    <label className="text-slate-400">Sonraki Bakım KM</label>
                    <input type="number" value={editForm.nextMaintenanceKm} onChange={e => setEditForm({...editForm, nextMaintenanceKm: Number(e.target.value)})} className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-white mt-1" />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div><span className="text-slate-400 block">Plaka:</span> <span className="text-white font-bold">{selectedVehicle.plate}</span></div>
                  <div><span className="text-slate-400 block">Durum:</span> <span className="text-white font-semibold">{selectedVehicle.status === 'Rented' ? 'Kirada' : selectedVehicle.status === 'Available' ? 'Garajda / Boşta' : 'Bakımda'}</span></div>
                  <div><span className="text-slate-400 block">Mevcut KM:</span> <span className="text-blue-400 font-bold">{selectedVehicle.currentKm?.toLocaleString()} KM</span></div>
                  <div><span className="text-slate-400 block">Sonraki Bakım KM:</span> <span className="text-amber-400 font-bold">{selectedVehicle.nextMaintenanceKm?.toLocaleString()} KM</span></div>
                </div>
              )}
            </div>

            <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-2">
              <h3 className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                <Wrench size={15} /> Bu Aracın Servis & Bakım Geçmişi
              </h3>
              <div className="space-y-1.5 max-h-24 overflow-y-auto no-scrollbar">
                {maintenanceRecords.filter(r => r.vehicleId === selectedVehicle.id).length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-1">Bu araç için kayıtlı bakım geçmişi bulunmuyor.</p>
                ) : (
                  maintenanceRecords.filter(r => r.vehicleId === selectedVehicle.id).map(rec => (
                    <div key={rec.id} className="bg-slate-900 p-2 rounded border border-slate-800 flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-amber-300">{rec.type}</span> <span className="text-slate-400">• {rec.date} • {rec.km?.toLocaleString()} KM</span>
                        <div className="text-slate-300 mt-0.5">{rec.service} - <span className="text-slate-400">{rec.note}</span></div>
                      </div>
                      <span className="font-bold text-rose-400">{rec.cost?.toLocaleString()} TL</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-2">
              <h3 className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                <Calendar size={15} /> 2. Muayene & Sigorta Poliçe Bilgileri
              </h3>
              {isEditingModal ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="text-slate-400">Muayene Bitiş Tarihi</label>
                    <input type="date" value={editForm.inspectionDate} onChange={e => setEditForm({...editForm, inspectionDate: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-white mt-1" />
                  </div>
                  <div>
                    <label className="text-slate-400">Trafik Sigortası Bitiş</label>
                    <input type="date" value={editForm.insuranceDate} onChange={e => setEditForm({...editForm, insuranceDate: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-white mt-1" />
                  </div>
                  <div>
                    <label className="text-slate-400">Sigorta Poliçe No</label>
                    <input type="text" value={editForm.insurancePolicyNo} onChange={e => setEditForm({...editForm, insurancePolicyNo: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-white mt-1" />
                  </div>
                  <div>
                    <label className="text-slate-400">Kasko Bitiş Tarihi</label>
                    <input type="date" value={editForm.cascoDate || ''} onChange={e => setEditForm({...editForm, cascoDate: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-white mt-1" />
                  </div>
                  <div>
                    <label className="text-slate-400">Kasko Poliçe No</label>
                    <input type="text" value={editForm.cascoPolicyNo || ''} onChange={e => setEditForm({...editForm, cascoPolicyNo: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-white mt-1" />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                  <div><span className="text-slate-400 block">Muayene Tarihi:</span> <span className="text-white font-medium">{selectedVehicle.inspectionDate}</span></div>
                  <div><span className="text-slate-400 block">Trafik Sigortası:</span> <span className="text-white font-medium">{selectedVehicle.insuranceDate} ({selectedVehicle.insurancePolicyNo})</span></div>
                  <div><span className="text-slate-400 block">Kasko Poliçesi:</span> <span className="text-white font-medium">{selectedVehicle.cascoDate || '-'} ({selectedVehicle.cascoPolicyNo || '-'})</span></div>
                </div>
              )}
            </div>

            <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-2">
              <h3 className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                <DollarSign size={15} /> 3. Finansal Gelir & Gider Kalemleri (Aylık)
              </h3>
              {isEditingModal ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="text-slate-400">Aylık Kira Geliri (TL)</label>
                    <input type="number" value={editForm.financials?.monthlyIncome || 0} onChange={e => setEditForm({...editForm, financials: {...editForm.financials, monthlyIncome: Number(e.target.value)}})} className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-white mt-1" />
                  </div>
                  <div>
                    <label className="text-slate-400">Sigorta/Kasko (TL)</label>
                    <input type="number" value={editForm.financials?.insuranceCost || 0} onChange={e => setEditForm({...editForm, financials: {...editForm.financials, insuranceCost: Number(e.target.value)}})} className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-white mt-1" />
                  </div>
                  <div>
                    <label className="text-slate-400">Diğer Giderler (TL)</label>
                    <input type="number" value={editForm.financials?.otherExpenses || 0} onChange={e => setEditForm({...editForm, financials: {...editForm.financials, otherExpenses: Number(e.target.value)}})} className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-white mt-1" />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                  <div><span className="text-slate-400 block">Aylık Kira Geliri:</span> <span className="text-emerald-400 font-bold">{selectedVehicle.financials?.monthlyIncome?.toLocaleString()} TL</span></div>
                  <div><span className="text-slate-400 block">Sigorta / Kasko:</span> <span className="text-rose-400">{selectedVehicle.financials?.insuranceCost?.toLocaleString()} TL</span></div>
                  <div><span className="text-slate-400 block">Diğer Masraflar:</span> <span className="text-rose-400">{selectedVehicle.financials?.otherExpenses?.toLocaleString()} TL</span></div>
                </div>
              )}
            </div>

            <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-2">
              <h3 className="text-xs font-semibold text-purple-400 flex items-center gap-1.5">
                <UserCheck size={15} /> 4. Zimmetli Sürücü Bilgileri
              </h3>
              {isEditingModal ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="text-slate-400">Sürücü Seçin</label>
                    <select 
                      value={editForm.driver.name} 
                      onChange={e => {
                        const selectedName = e.target.value;
                        if (!selectedName || selectedName === 'Zimmetsiz') {
                          setEditForm({
                            ...editForm, 
                            driver: { 
                              ...editForm.driver, 
                              name: 'Zimmetsiz', 
                              phone: '-', 
                              licenseClass: '-' 
                            }
                          });
                        } else {
                          const matchedDrv = uniqueDriversForSelect.find(d => d.name === selectedName);
                          setEditForm({
                            ...editForm,
                            driver: {
                              ...editForm.driver,
                              name: selectedName,
                              phone: matchedDrv ? matchedDrv.phone : '-',
                              licenseClass: matchedDrv ? (matchedDrv.licenseClass || 'B') : 'B'
                            }
                          });
                        }
                      }} 
                      className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-white mt-1"
                    >
                      <option value="Zimmetsiz">Zimmetsiz (Sürücüsüz)</option>
                      {uniqueDriversForSelect.map((drv, idx) => (
                        <option key={idx} value={drv.name}>
                          {drv.name} ({drv.sourceLabel})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-400">Telefon (Otomatik)</label>
                    <input type="text" readOnly value={editForm.driver.phone} className="w-full bg-slate-900/60 border border-slate-800 rounded p-1.5 text-slate-300 mt-1 cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="text-slate-400">Ehliyet Sınıfı (Otomatik)</label>
                    <input type="text" readOnly value={editForm.driver.licenseClass} className="w-full bg-slate-900/60 border border-slate-800 rounded p-1.5 text-slate-300 mt-1 cursor-not-allowed" />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div><span className="text-slate-400 block">Sürücü Adı:</span> <span className="text-white font-medium">{selectedVehicle.driver.name}</span></div>
                  <div><span className="text-slate-400 block">Telefon:</span> <span className="text-slate-300">{selectedVehicle.driver.phone}</span></div>
                  <div><span className="text-slate-400 block">Ehliyet Sınıfı:</span> <span className="text-purple-300 font-bold">{selectedVehicle.driver.licenseClass || '-'}</span></div>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-800 gap-2">
              {isEditingModal && hasActionPermission('edit') && (
                <button onClick={handleSaveVehicleEdit} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-semibold cursor-pointer">
                  Değişiklikleri Kaydet
                </button>
              )}
              <button onClick={() => setSelectedVehicle(null)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm cursor-pointer">
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddDriverModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="text-purple-400" size={18} />
                Yeni Sürücü Ekle & Araç Ata
              </h3>
              <button onClick={() => setShowAddDriverModal(false)} className="text-slate-400 hover:text-white cursor-pointer"><X size={18} /></button>
            </div>

            <form onSubmit={handleSaveNewDriver} className="space-y-3 my-3">
              <div>
                <label className="text-xs text-slate-400">Zimmetlenecek Araç (Plaka)</label>
                <select value={newDriverForm.targetVehicleId} onChange={e => setNewDriverForm({...newDriverForm, targetVehicleId: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white mt-1">
                  <option value="">-- Araç Seçilmesin (Zimmetsiz / Bağımsız Sürücü) --</option>
                  {realVehicles.map(v => (
                    <option key={v.id} value={v.id}>{v.plate} ({v.brand} {v.model})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400">Sürücü Adı Soyadı</label>
                <input required type="text" placeholder="Ahmet Yılmaz" value={newDriverForm.name} onChange={e => setNewDriverForm({...newDriverForm, name: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white mt-1" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-slate-400">Telefon</label>
                  <input required type="text" placeholder="0532 111 2233" value={newDriverForm.phone} onChange={e => setNewDriverForm({...newDriverForm, phone: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white mt-1" />
                </div>
                <div>
                  <label className="text-xs text-slate-400">Ehliyet Sınıfı</label>
                  <input required type="text" placeholder="B" value={newDriverForm.licenseClass} onChange={e => setNewDriverForm({...newDriverForm, licenseClass: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white mt-1" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-slate-400">SRC Belge Türü</label>
                  <input type="text" placeholder="SRC-2" value={newDriverForm.srcType} onChange={e => setNewDriverForm({...newDriverForm, srcType: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white mt-1" />
                </div>
                <div>
                  <label className="text-xs text-slate-400">SRC Bitiş Tarihi</label>
                  <input type="date" value={newDriverForm.srcExpiryDate} onChange={e => setNewDriverForm({...newDriverForm, srcExpiryDate: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white mt-1" />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button type="button" onClick={() => setShowAddDriverModal(false)} className="px-3 py-1.5 bg-slate-800 text-white rounded text-xs cursor-pointer">İptal</button>
                <button type="submit" className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded text-xs font-semibold cursor-pointer">Sürücüyü Kaydet</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showRentModal && selectedVehicle && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Key className="text-emerald-400" size={18} />
                {selectedVehicle.plate} - Kiraya Çek
              </h3>
              <button onClick={() => setShowRentModal(false)} className="text-slate-400 hover:text-white cursor-pointer"><X size={18} /></button>
            </div>

            <form onSubmit={handleRentVehicle} className="space-y-3 my-3">
              <div>
                <label className="text-xs text-slate-400">Müşteri / Firma Adı</label>
                <input required type="text" placeholder="AWP Grupp" value={rentForm.customer} onChange={e => setRentForm({...rentForm, customer: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white mt-1" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-slate-400">Aylık Ücret (TL)</label>
                  <input required type="number" placeholder="100555" value={rentForm.monthlyFee} onChange={e => setRentForm({...rentForm, monthlyFee: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white mt-1" />
                </div>
                <div>
                  <label className="text-xs text-slate-400">Sözleşme Bitiş Tarihi</label>
                  <input required type="date" value={rentForm.endDate} onChange={e => setRentForm({...rentForm, endDate: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white mt-1" />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <p className="text-[11px] font-semibold text-purple-400 uppercase tracking-wider mb-2">TESLİM EDİLECEK SÜRÜCÜ</p>
                <div className="space-y-2">
                  <div>
                    <label className="text-xs text-slate-400">Sürücü Listesinden Seç</label>
                    <select 
                      required
                      value={rentForm.driverName}
                      onChange={e => {
                        const selectedName = e.target.value;
                        const matchedDrv = uniqueDriversForSelect.find(d => d.name === selectedName);
                        setRentForm({
                          ...rentForm,
                          driverName: selectedName,
                          driverPhone: matchedDrv ? matchedDrv.phone : ''
                        });
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white mt-1"
                    >
                      <option value="">-- Sürücü Seçiniz --</option>
                      {uniqueDriversForSelect.map((drv, idx) => (
                        <option key={idx} value={drv.name}>
                          {drv.name} ({drv.sourceLabel})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-slate-400">Telefon (Otomatik)</label>
                      <input required type="text" readOnly placeholder="66688999" value={rentForm.driverPhone} className="w-full bg-slate-950/60 border border-slate-800 rounded p-2 text-xs text-slate-300 mt-1 cursor-not-allowed" />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400">TC Kimlik No (KABİS)</label>
                      <input required type="text" placeholder="2255889966" value={rentForm.tcNo} onChange={e => setRentForm({...rentForm, tcNo: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white mt-1" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button type="button" onClick={() => setShowRentModal(false)} className="px-3 py-1.5 bg-slate-800 text-white rounded text-xs cursor-pointer">İptal</button>
                <button type="submit" className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold cursor-pointer">Kiraya Çek</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showCompanyDocModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Building2 className="text-indigo-400" size={18} />
                Yeni Şirket Evrakı Ekle
              </h3>
              <button onClick={() => setShowCompanyDocModal(false)} className="text-slate-400 hover:text-white cursor-pointer"><X size={18} /></button>
            </div>

<form onSubmit={handleSaveCompanyDoc} className="space-y-3 my-3">
              <div>
                <label className="text-xs text-slate-400">Evrak / Dosya Adı</label>
                <input required type="text" placeholder="Ornek_Sozlesme_2026.pdf" value={companyDocForm.name} onChange={e => setCompanyDocForm({...companyDocForm, name: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white mt-1" />
              </div>
              
              {/* PDF SEÇME ALANI */}
              <div>
                <label className="text-xs text-slate-400 block mb-1">PDF Dosyası Seç</label>
                <label className="w-full bg-slate-950 hover:bg-slate-800 border border-dashed border-slate-700 rounded p-3 flex items-center justify-center gap-2 cursor-pointer text-xs text-cyan-400 transition">
                  <Upload size={16} />
                  <span>{companyDocForm.file ? `Seçilen: ${companyDocForm.file.name}` : 'Bilgisayardan PDF Seç'}</span>
                  <input 
                    type="file" 
                    accept=".pdf" 
                    onChange={e => {
                      const file = e.target.files[0];
                      if (file) {
                        setCompanyDocForm({
                          ...companyDocForm, 
                          file: file,
                          name: companyDocForm.name || file.name // İsim boşsa dosya adını otomatik yazar
                        });
                      }
                    }} 
                    className="hidden" 
                  />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-slate-400">Kategori</label>
                  {/* BURASI DÜZELTİLDİ: Artık doğru şekilde category güncelleniyor */}
                  <select value={companyDocForm.category} onChange={e => setCompanyDocForm({...companyDocForm, category: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white mt-1">
                    <option value="Uzun Vadeli Şirket Sözleşmesi">Uzun Vadeli Sözleşme</option>
                    <option value="Vergi & Resmi Evrak">Vergi & Resmi Evrak</option>
                    <option value="Genel Kurul & Diğer">Genel Kurul & Diğer</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400">İlgili Firma / Kurum</label>
                  <input required type="text" placeholder="ABC Lojistik A.Ş." value={companyDocForm.company} onChange={e => setCompanyDocForm({...companyDocForm, company: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white mt-1" />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400">Bitiş / Geçerlilik Tarihi</label>
                <input required type="date" value={companyDocForm.expiry} onChange={e => setCompanyDocForm({...companyDocForm, expiry: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white mt-1" />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button type="button" onClick={() => setShowCompanyDocModal(false)} className="px-3 py-1.5 bg-slate-800 text-white rounded text-xs cursor-pointer">İptal</button>
                <button type="submit" className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-semibold cursor-pointer">Evrakı Kaydet</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showTireModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <HardDrive className="text-emerald-400" size={18} />
                {editingTireId ? 'Lastik Bilgilerini Düzenle' : 'Araca Yeni Lastik Ekle'}
              </h3>
              <button onClick={() => setShowTireModal(false)} className="text-slate-400 hover:text-white cursor-pointer"><X size= {18} /></button>
            </div>

            <form onSubmit={handleSaveTire} className="space-y-3 my-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-slate-400">Takılı/Depo Konumu</label>
                  <select value={tireForm.position} onChange={e => setTireForm({...tireForm, position: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white mt-1">
                    <option value="Üzerinde Takılı">Üzerinde Takılı</option>
                    <option value="Yedek Depo">Yedek Depo</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400">Lastik Tipi</label>
                  <select value={tireForm.type} onChange={e => setTireForm({...tireForm, type: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white mt-1">
                    <option value="Yazlık">Yazlık</option>
                    <option value="Kışlık">Kışlık</option>
                    <option value="4 Mevsim">4 Mevsim</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400">Marka ve Ebat</label>
                <input required type="text" placeholder="Michelin 205/55 R16" value={tireForm.brand} onChange={e => setTireForm({...tireForm, brand: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white mt-1" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-slate-400">Seri / DOT No</label>
                  <input type="text" placeholder="DOT-2026" value={tireForm.serialNo} onChange={e => setTireForm({...tireForm, serialNo: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white mt-1" />
                </div>
                <div>
                  <label className="text-xs text-slate-400">Diş Derinliği</label>
                  <input required type="text" placeholder="7.5mm" value={tireForm.depth} onChange={e => setTireForm({...tireForm, depth: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white mt-1" />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400">Saklama Konumu / Depo Adı</label>
                <input required type="text" placeholder="Örn: Araç Üzerinde Veya Lastik Oteli" value={tireForm.location} onChange={e => setTireForm({...tireForm, location: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white mt-1" />
              </div>

              <div>
                <label className="text-xs text-slate-400">Depo İletişim Telefonu</label>
                <input type="text" placeholder="0212 555..." value={tireForm.phone} onChange={e => setTireForm({...tireForm, phone: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white mt-1" />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button type="button" onClick={() => setShowTireModal(false)} className="px-3 py-1.5 bg-slate-800 text-white rounded text-xs cursor-pointer">İptal</button>
                <button type="submit" className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold cursor-pointer">Kaydet</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
