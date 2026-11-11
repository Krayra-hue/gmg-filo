const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Gizli JWT anahtarı
const JWT_SECRET = process.env.JWT_SECRET || 'gmg_grup_gizli_anahtar_2026';

// ---------------------------------------------------------
// UPLOADS KLASÖRÜ VE MULTER YAPILANDIRMASI
// ---------------------------------------------------------
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Statik dosya erişimi (Yüklenen dosyalara URL üzerinden erişebilmek için)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ---------------------------------------------------------
// SQLITE VERİTABANI BAĞLANTISI VE TABLO OLUŞTURMA
// ---------------------------------------------------------
const db = new sqlite3.Database('./gmg_filo.db', (err) => {
  if (err) {
    console.error('Veritabanına bağlanırken hata oluştu:', err.message);
  } else {
    console.log('SQLite veritabanına başarıyla bağlanıldı (gmg_filo.db).');
    initDatabase();
  }
});

function initDatabase() {
  db.serialize(() => {
    // 1. Kullanıcılar Tablosu
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT,
      role TEXT,
      name TEXT,
      permissions TEXT,
      actions TEXT
    )`);

    // 2. Araçlar Tablosu
    db.run(`CREATE TABLE IF NOT EXISTS vehicles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      plate TEXT,
      brand TEXT,
      model TEXT,
      year INTEGER,
      status TEXT,
      currentKm INTEGER,
      nextMaintenanceKm INTEGER,
      inspectionDate TEXT,
      insuranceDate TEXT,
      insurancePolicyNo TEXT,
      cascoDate TEXT,
      cascoPolicyNo TEXT,
      kabisStatus TEXT,
      kabisIdentityNo TEXT,
      financials TEXT,
      tires TEXT,
      driver TEXT,
      contract TEXT,
      documents TEXT
    )`);

    // 3. Bakım Geçmişi Tablosu
    db.run(`CREATE TABLE IF NOT EXISTS maintenance (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vehicleId INTEGER,
      plate TEXT,
      date TEXT,
      km INTEGER,
      type TEXT,
      cost REAL,
      service TEXT,
      note TEXT
    )`);

    // 4. Sürücüler Tablosu
    db.run(`CREATE TABLE IF NOT EXISTS drivers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      phone TEXT,
      licenseClass TEXT,
      srcType TEXT,
      srcExpiryDate TEXT,
      psychotechnicalDate TEXT,
      documents TEXT
    )`);

    // 5. Şirket Evrakları Tablosu
    db.run(`CREATE TABLE IF NOT EXISTS company_docs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      category TEXT,
      company TEXT,
      date TEXT,
      expiry TEXT,
      fileUrl TEXT
    )`);
  });
}

// GÜVENLİK BEKÇİSİ (JWT Middleware)
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Erişim reddedildi. Lütfen giriş yapın.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Oturum süresi dolmuş veya geçersiz token.' });
    }
    req.user = user;
    next();
  });
};

// 1. GİRİŞ ENDPOINT'İ
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  db.get(`SELECT * FROM users WHERE LOWER(username) = ?`, [username?.trim().toLowerCase()], (err, user) => {
    if (err || !user || user.password !== password) {
      return res.status(401).json({ error: 'Kullanıcı adı veya şifre hatalı!' });
    }

    const token = jwt.sign({ username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '8h' });
    const { password: _, ...userData } = user;
    userData.permissions = JSON.parse(userData.permissions || '[]');
    userData.actions = JSON.parse(userData.actions || '{}');

    res.json({ message: 'Giriş başarılı', token, user: userData });
  });
});

// 2. KULLANICILAR ENDPOINT'İ
app.get('/api/users', authenticateToken, (req, res) => {
  db.all(`SELECT id, username, role, name, permissions, actions FROM users`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const users = rows.map(u => ({
      ...u,
      permissions: JSON.parse(u.permissions || '[]'),
      actions: JSON.parse(u.actions || '{}')
    }));
    res.json(users);
  });
});

app.post('/api/users', authenticateToken, (req, res) => {
  const { username, password, role, permissions, actions, name } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Kullanıcı adı ve şifre zorunludur!' });

  const permStr = JSON.stringify(permissions || ['vehicles']);
  const actStr = JSON.stringify(actions || { create: true, edit: true, delete: false });
  const realName = name || username;
  const userRole = role || 'user';

  db.run(`INSERT INTO users (username, password, role, name, permissions, actions) VALUES (?, ?, ?, ?, ?, ?)`,
    [username.toLowerCase().trim(), password, userRole, realName, permStr, actStr],
    function(err) {
      if (err) return res.status(400).json({ error: 'Bu kullanıcı adı zaten kullanımda.' });
      res.status(201).json({
        message: 'Kullanıcı oluşturuldu!',
        user: { id: this.lastID, username: username.toLowerCase().trim(), role: userRole, name: realName, permissions: JSON.parse(permStr), actions: JSON.parse(actStr) }
      });
    }
  );
});

app.put('/api/users/:id', authenticateToken, (req, res) => {
  const id = req.params.id;
  const { permissions, actions } = req.body;

  const permStr = JSON.stringify(permissions || []);
  const actStr = JSON.stringify(actions || {});

  db.run(`UPDATE users SET permissions = ?, actions = ? WHERE id = ?`,
    [permStr, actStr, id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Kullanıcı yetkileri başarıyla güncellendi' });
    }
  );
});

app.delete('/api/users/:id', authenticateToken, (req, res) => {
  const id = req.params.id;

  db.get(`SELECT username FROM users WHERE id = ?`, [id], (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (user && user.username === 'admin') {
      return res.status(403).json({ error: 'Ana admin kullanıcısı silinemez!' });
    }

    db.run(`DELETE FROM users WHERE id = ?`, [id], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Kullanıcı başarıyla silindi' });
    });
  });
});

// 3. ARAÇLAR (VEHICLES) ENDPOINT'LERİ
app.get('/api/vehicles', authenticateToken, (req, res) => {
  db.all(`SELECT * FROM vehicles`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const vehicles = rows.map(v => ({
      ...v,
      financials: v.financials ? JSON.parse(v.financials) : {},
      tires: v.tires ? JSON.parse(v.tires) : [],
      driver: v.driver ? JSON.parse(v.driver) : null,
      contract: v.contract ? JSON.parse(v.contract) : null,
      documents: v.documents ? JSON.parse(v.documents) : []
    }));
    res.json(vehicles);
  });
});

app.post('/api/vehicles', authenticateToken, (req, res) => {
  const { plate, brand, model, year, status, currentKm, nextMaintenanceKm, inspectionDate, insuranceDate, insurancePolicyNo, cascoDate, cascoPolicyNo, kabisStatus, kabisIdentityNo, financials, tires, driver, contract, documents } = req.body;
  
  db.run(`INSERT INTO vehicles (plate, brand, model, year, status, currentKm, nextMaintenanceKm, inspectionDate, insuranceDate, insurancePolicyNo, cascoDate, cascoPolicyNo, kabisStatus, kabisIdentityNo, financials, tires, driver, contract, documents) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      plate, brand, model, year, status || 'Available', currentKm || 0, nextMaintenanceKm || 0,
      inspectionDate, insuranceDate, insurancePolicyNo, cascoDate, cascoPolicyNo,
      kabisStatus || 'Pending', kabisIdentityNo,
      JSON.stringify(financials || {}), JSON.stringify(tires || []),
      JSON.stringify(driver || null), JSON.stringify(contract || null), JSON.stringify(documents || [])
    ],
    function(err) {
      if (err) return res.status(400).json({ error: err.message });
      res.status(201).json({ message: 'Araç başarıyla eklendi', id: this.lastID });
    }
  );
});

// Tek ve optimize edilmiş Araç Güncelleme Rota Endpoint'i (Dosya temizleme destekli)
app.put('/api/vehicles/:id', authenticateToken, (req, res) => {
  const id = req.params.id;
  const v = req.body;

  db.get(`SELECT * FROM vehicles WHERE id = ?`, [id], (err, oldVehicle) => {
    if (!err && oldVehicle) {
      try {
        const oldDocs = JSON.parse(oldVehicle.documents || '[]');
        const newDocs = v.documents || [];
        const deletedDocs = oldDocs.filter(oldDoc => !newDocs.some(newDoc => newDoc.id === oldDoc.id));

        const oldDriver = oldVehicle.driver ? JSON.parse(oldVehicle.driver) : {};
        const oldDriverDocs = oldDriver.documents || [];
        const newDriver = v.driver || {};
        const newDriverDocs = newDriver.documents || [];
        const deletedDriverDocs = oldDriverDocs.filter(oldDoc => !newDriverDocs.some(newDoc => newDoc.id === oldDoc.id));

        const allDeleted = [...deletedDocs, ...deletedDriverDocs];

        allDeleted.forEach(doc => {
          if (doc.fileUrl && doc.fileUrl.includes('/uploads/')) {
            const filename = doc.fileUrl.split('/uploads/')[1];
            const filePath = path.join(__dirname, 'uploads', filename);
            if (fs.existsSync(filePath)) {
              try {
                fs.unlinkSync(filePath);
              } catch (e) {
                console.error('Dosya diskten silinirken hata oluştu:', e);
              }
            }
          }
        });
      } catch (e) {
        console.error('Eski belgeler taranırken hata:', e);
      }
    }

    const financialsStr = JSON.stringify(v.financials || {});
    const tiresStr = JSON.stringify(v.tires || []);
    const driverStr = JSON.stringify(v.driver || null);
    const contractStr = JSON.stringify(v.contract || null);
    const docsStr = JSON.stringify(v.documents || []);

    db.run(
      `UPDATE vehicles SET plate = ?, brand = ?, model = ?, year = ?, status = ?, currentKm = ?, nextMaintenanceKm = ?, inspectionDate = ?, insuranceDate = ?, insurancePolicyNo = ?, cascoDate = ?, cascoPolicyNo = ?, kabisStatus = ?, kabisIdentityNo = ?, financials = ?, tires = ?, driver = ?, contract = ?, documents = ? WHERE id = ?`,
      [
        v.plate, v.brand, v.model, v.year, v.status, v.currentKm, v.nextMaintenanceKm,
        v.inspectionDate, v.insuranceDate, v.insurancePolicyNo, v.cascoDate, v.cascoPolicyNo,
        v.kabisStatus, v.kabisIdentityNo, financialsStr, tiresStr, driverStr, contractStr, docsStr, id
      ],
      function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Araç ve evrakları başarıyla güncellendi', vehicle: { id: Number(id), ...v } });
      }
    );
  });
});

app.delete('/api/vehicles/:id', authenticateToken, (req, res) => {
  const id = req.params.id;
  db.run(`DELETE FROM vehicles WHERE id = ?`, [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Araç veritabanından silindi' });
  });
});

// 4. BAKIM GEÇMİŞİ ENDPOINT'LERİ
app.delete('/api/maintenance/:id', authenticateToken, (req, res) => {
  const id = req.params.id;
  db.run(`DELETE FROM maintenance WHERE id = ?`, [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Bakım kaydı silindi' });
  });
});

app.get('/api/maintenance', authenticateToken, (req, res) => {
  db.all(`SELECT * FROM maintenance`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/maintenance', authenticateToken, (req, res) => {
  const r = req.body;
  db.run(`INSERT INTO maintenance (vehicleId, plate, date, km, type, cost, service, note) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [r.vehicleId, r.plate, r.date, r.km, r.type, r.cost, r.service, r.note],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: 'Bakım kaydı eklendi', record: { id: this.lastID, ...r } });
    }
  );
});

// 5. SÜRÜCÜLER ENDPOINT'LERİ
app.get('/api/drivers', authenticateToken, (req, res) => {
  db.all(`SELECT * FROM drivers`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const drivers = rows.map(d => ({
      ...d,
      documents: JSON.parse(d.documents || '[]')
    }));
    res.json(drivers);
  });
});

app.put('/api/drivers/:id', authenticateToken, (req, res) => {
  const id = req.params.id;
  const d = req.body;

  db.get(`SELECT * FROM drivers WHERE id = ?`, [id], (err, oldDriver) => {
    if (!err && oldDriver) {
      try {
        const oldDocs = JSON.parse(oldDriver.documents || '[]');
        const newDocs = d.documents || [];

        const deletedDocs = oldDocs.filter(oldDoc => !newDocs.some(newDoc => newDoc.id === oldDoc.id));
        deletedDocs.forEach(doc => {
          if (doc.fileUrl && doc.fileUrl.includes('/uploads/')) {
            const filename = doc.fileUrl.split('/uploads/')[1];
            const filePath = path.join(__dirname, 'uploads', filename);
            if (fs.existsSync(filePath)) {
              try {
                fs.unlinkSync(filePath);
              } catch (e) {
                console.error('Sürücü dosyası silinirken hata:', e);
              }
            }
          }
        });
      } catch (e) {
        console.error('Sürücü eski belgeleri taranırken hata:', e);
      }
    }

    const docsStr = JSON.stringify(d.documents || []);
    db.run(`UPDATE drivers SET name = ?, phone = ?, licenseClass = ?, srcType = ?, srcExpiryDate = ?, psychotechnicalDate = ?, documents = ? WHERE id = ?`,
      [d.name, d.phone, d.licenseClass, d.srcType, d.srcExpiryDate, d.psychotechnicalDate, docsStr, id],
      function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Sürücü başarıyla güncellendi' });
      }
    );
  });
});

app.post('/api/drivers', authenticateToken, (req, res) => {
  const d = req.body;
  const docsStr = JSON.stringify(d.documents || []);
  db.run(`INSERT INTO drivers (name, phone, licenseClass, srcType, srcExpiryDate, psychotechnicalDate, documents) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [d.name, d.phone, d.licenseClass, d.srcType, d.srcExpiryDate, d.psychotechnicalDate, docsStr],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: 'Sürücü eklendi', driver: { id: this.lastID, documents: [], ...d } });
    }
  );
});

app.delete('/api/drivers/:id', authenticateToken, (req, res) => {
  const id = req.params.id;
  db.run(`DELETE FROM drivers WHERE id = ?`, [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Sürücü silindi' });
  });
});

// 6. ŞİRKET EVRAKLARI ENDPOINT'LERİ
app.get('/api/company-docs', authenticateToken, (req, res) => {
  db.all(`SELECT * FROM company_docs`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/company-docs', authenticateToken, (req, res) => {
  const doc = req.body;
  db.run(`INSERT INTO company_docs (name, category, company, date, expiry, fileUrl) VALUES (?, ?, ?, ?, ?, ?)`,
    [doc.name, doc.category, doc.company, doc.date, doc.expiry, doc.fileUrl || '#'],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: 'Şirket evrakı eklendi', doc: { id: this.lastID, ...doc } });
    }
  );
});

app.delete('/api/company-docs/:id', authenticateToken, (req, res) => {
  const id = req.params.id;

  db.get(`SELECT * FROM company_docs WHERE id = ?`, [id], (err, doc) => {
    if (err) return res.status(500).json({ error: err.message });

    if (doc && doc.fileUrl && doc.fileUrl.includes('/uploads/')) {
      const filename = doc.fileUrl.split('/uploads/')[1];
      const filePath = path.join(__dirname, 'uploads', filename);

      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (e) {
          console.error('Dosya silinirken hata oluştu:', e);
        }
      }
    }

    db.run(`DELETE FROM company_docs WHERE id = ?`, [id], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Şirket evrakı ve dosyası başarıyla silindi' });
    });
  });
});

// 7. DOSYA YÜKLEME ENDPOINT'İ (Dinamik Host Desteği ile - Render Uyumlu)
app.post('/api/upload', authenticateToken, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Dosya yüklenemedi!' });
  }

  const originalName = Buffer.from(req.file.originalname, 'latin1').toString('utf8');
  
  // Render veya Localhost ortamına göre dinamik URL oluşturma
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const fileUrl = `${baseUrl}/uploads/${req.file.filename}`;

  res.json({
    message: 'Dosya başarıyla yüklendi',
    fileUrl: fileUrl,
    fileName: originalName
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend sunucusu ${PORT} portunda SQLite ve Multer destekli olarak çalışıyor...`);
});
