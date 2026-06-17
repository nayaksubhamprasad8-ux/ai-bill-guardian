import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'data', 'db.json');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Set up file uploading
const upload = multer({ dest: 'uploads/' });

// Read DB Helper
const readDB = () => {
  try {
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database file:', error);
    return { profile: {}, bills: [], recommendations: [], alerts: [], tickets: [] };
  }
};

// Write DB Helper
const writeDB = (data) => {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing to database file:', error);
  }
};

// API: Get user profile
app.get('/api/profile', (req, res) => {
  const db = readDB();
  res.json(db.profile);
});

// API: Update user profile
app.put('/api/profile', (req, res) => {
  const db = readDB();
  db.profile = { ...db.profile, ...req.body };
  writeDB(db);
  res.json(db.profile);
});

// API: Get all bills
app.get('/api/bills', (req, res) => {
  const db = readDB();
  // Sort bills descending by billingDate
  const sortedBills = [...db.bills].sort((a, b) => new Date(b.billingDate) - new Date(a.billingDate));
  res.json(sortedBills);
});

// API: Add new bill manually
app.post('/api/bills', (req, res) => {
  const db = readDB();
  const newBill = {
    id: `bill-${Date.now()}`,
    ...req.body,
  };
  db.bills.push(newBill);
  
  // Re-run anomaly checks
  checkAnomaliesForBill(db, newBill);
  
  writeDB(db);
  res.status(201).json(newBill);
});

// API: Edit an extracted or existing bill
app.put('/api/bills/:id', (req, res) => {
  const db = readDB();
  const index = db.bills.findIndex(b => b.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Bill not found' });
  }
  
  db.bills[index] = { ...db.bills[index], ...req.body };
  
  // Re-run anomaly detection
  checkAnomaliesForBill(db, db.bills[index]);
  
  writeDB(db);
  res.json(db.bills[index]);
});

// API: Delete a bill
app.delete('/api/bills/:id', (req, res) => {
  const db = readDB();
  db.bills = db.bills.filter(b => b.id !== req.params.id);
  // Also clean up alerts associated with this bill
  db.alerts = db.alerts.filter(a => a.billId !== req.params.id);
  writeDB(db);
  res.json({ message: 'Bill deleted successfully' });
});

// API: Mock OCR Upload
app.post('/api/bills/upload', upload.single('billFile'), (req, res) => {
  // Extract info based on file name/metadata or simulate a random bill
  const originalName = req.file ? req.file.originalname.toLowerCase() : 'bill.pdf';
  
  let type = 'electricity';
  let provider = 'State Electricity Board';
  let units = 480;
  let tariffRate = 8.5;
  let tax = 800;
  let amount = 4880;
  let usagePeriod = 'May 2026';
  
  if (originalName.includes('water') || originalName.includes('municipal')) {
    type = 'water';
    provider = 'Municipal Water Dept';
    units = 35;
    tariffRate = 25;
    tax = 85;
    amount = 960;
  } else if (originalName.includes('broadband') || originalName.includes('wifi') || originalName.includes('internet') || originalName.includes('fiber')) {
    type = 'broadband';
    provider = 'FiberNet Corp';
    units = 1;
    tariffRate = 1016;
    tax = 183;
    amount = 1199;
  } else if (originalName.includes('mobile') || originalName.includes('phone') || originalName.includes('telecom')) {
    type = 'mobile';
    provider = 'Telecom India';
    units = 1;
    tariffRate = 677;
    tax = 122;
    amount = 799;
  } else if (originalName.includes('gas')) {
    type = 'gas';
    provider = 'Indane Gas';
    units = 2; // Cylinders or units
    tariffRate = 950;
    tax = 50;
    amount = 1000;
  }

  // Generate dynamic dates (usually due date is ~20 days from billing date)
  const billingDate = new Date().toISOString().split('T')[0];
  const dueDateObj = new Date();
  dueDateObj.setDate(dueDateObj.getDate() + 20);
  const dueDate = dueDateObj.toISOString().split('T')[0];

  const extractedData = {
    id: `bill-extracted-${Date.now()}`,
    type,
    amount,
    billingDate,
    dueDate,
    units,
    tariffRate,
    tax,
    status: 'unpaid',
    provider,
    usagePeriod,
    fileName: req.file ? req.file.originalname : 'Uploaded_Bill.pdf'
  };

  // Do not write to DB yet; user must verify and hit "Save" on OCR details page!
  res.json({
    message: 'OCR Extraction complete',
    data: extractedData
  });
});

// API: Get savings recommendations
app.get('/api/recommendations', (req, res) => {
  const db = readDB();
  res.json(db.recommendations);
});

// API: Toggle/apply recommendation
app.put('/api/recommendations/:id', (req, res) => {
  const db = readDB();
  const index = db.recommendations.findIndex(r => r.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Recommendation not found' });
  }
  
  db.recommendations[index].applied = req.body.applied ?? !db.recommendations[index].applied;
  writeDB(db);
  res.json(db.recommendations[index]);
});

// API: Get active alerts
app.get('/api/alerts', (req, res) => {
  const db = readDB();
  res.json(db.alerts.filter(a => !a.resolved));
});

// API: Resolve/dismiss alert
app.put('/api/alerts/:id', (req, res) => {
  const db = readDB();
  const index = db.alerts.findIndex(a => a.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Alert not found' });
  }
  db.alerts[index].resolved = true;
  writeDB(db);
  res.json(db.alerts[index]);
});

// API: Generate predictions / forecasts
app.get('/api/predictions', (req, res) => {
  const db = readDB();
  const bills = db.bills;
  
  // Group bills by type and predict next 1, 3, 6 months
  const types = ['electricity', 'water', 'broadband', 'mobile', 'gas'];
  const forecasts = {};

  types.forEach(type => {
    const typeBills = bills.filter(b => b.type === type).sort((a, b) => new Date(a.billingDate) - new Date(b.billingDate));
    
    if (typeBills.length === 0) {
      forecasts[type] = { m1: 0, m3: 0, m6: 0, historicalAverage: 0, data: [] };
      return;
    }
    
    const amounts = typeBills.map(b => b.amount);
    const avg = amounts.reduce((a, b) => a + b, 0) / amounts.length;
    
    // Quick seasonal calculation
    // If trend is rising (like electricity in summer), project the rise
    let slope = 0;
    if (typeBills.length >= 2) {
      const first = typeBills[0].amount;
      const last = typeBills[typeBills.length - 1].amount;
      slope = (last - first) / (typeBills.length - 1);
    }
    
    // Limit slope to avoid runaway predictions
    const maxSlope = avg * 0.15;
    const minSlope = -avg * 0.15;
    slope = Math.max(minSlope, Math.min(maxSlope, slope));

    const m1 = Math.round(Math.max(avg * 0.5, typeBills[typeBills.length - 1].amount + slope * 1));
    const m3 = Math.round(Math.max(avg * 0.5, typeBills[typeBills.length - 1].amount + slope * 3));
    const m6 = Math.round(Math.max(avg * 0.5, typeBills[typeBills.length - 1].amount + slope * 6));
    
    forecasts[type] = {
      m1,
      m3,
      m6,
      historicalAverage: Math.round(avg),
      data: typeBills.map(b => ({ date: b.billingDate, amount: b.amount }))
    };
  });

  res.json(forecasts);
});

// API: Get admin dashboard analytics
app.get('/api/admin/stats', (req, res) => {
  const db = readDB();
  const bills = db.bills;
  
  const totalBillsAnalyzed = bills.length;
  const totalUsers = 1248; // Simulated static count
  const revenueUSD = 345000; // Simulated monthly revenue in INR/USD equivalent
  
  // Calculate average confidence score and AI usage
  const aiTokensUsed = bills.length * 12500 + 450000; // Formula
  const activeAlerts = db.alerts.filter(a => !a.resolved).length;
  
  res.json({
    totalUsers,
    totalBillsAnalyzed,
    monthlyRevenue: `₹${revenueUSD.toLocaleString('en-IN')}`,
    aiTokensUsed,
    activeAlerts,
    tickets: db.tickets
  });
});

// API: Submit a ticket (Admin Support)
app.post('/api/admin/tickets', (req, res) => {
  const db = readDB();
  const newTicket = {
    id: `tkt-${Date.now()}`,
    userEmail: req.body.email || 'guest@example.com',
    subject: req.body.subject || 'General Query',
    message: req.body.message || '',
    status: 'Open',
    createdAt: new Date().toISOString()
  };
  db.tickets = db.tickets || [];
  db.tickets.push(newTicket);
  writeDB(db);
  res.status(201).json(newTicket);
});

// Helper function to check anomalies when a bill is added/updated
function checkAnomaliesForBill(db, bill) {
  // Find past bills of this type
  const pastBills = db.bills
    .filter(b => b.type === bill.type && b.id !== bill.id)
    .sort((a, b) => new Date(b.billingDate) - new Date(a.billingDate));
    
  if (pastBills.length === 0) return;
  
  const prevBill = pastBills[0];
  const percentChange = ((bill.amount - prevBill.amount) / prevBill.amount) * 100;
  
  // 1. Check for Sudden Spike (e.g. > 40% increase)
  if (percentChange > 40) {
    const alertId = `alert-spike-${bill.id}`;
    // Remove duplicate alert if exists
    db.alerts = db.alerts.filter(a => a.id !== alertId);
    db.alerts.unshift({
      id: alertId,
      type: 'anomaly',
      level: percentChange > 80 ? 'High' : 'Medium',
      title: `${bill.type.charAt(0).toUpperCase() + bill.type.slice(1)} Spike Detected`,
      description: `Your ${bill.type} bill spike of ${percentChange.toFixed(1)}% compared to last cycle is anomalous. AI is checking for utility leaks or rate updates.`,
      billId: bill.id,
      date: new Date().toISOString().split('T')[0],
      resolved: false
    });
  }

  // 2. Check for subscription creep
  if (bill.type === 'broadband' || bill.type === 'mobile') {
    if (bill.amount > prevBill.amount && percentChange < 15) {
      const alertId = `alert-creep-${bill.id}`;
      db.alerts = db.alerts.filter(a => a.id !== alertId);
      db.alerts.unshift({
        id: alertId,
        type: 'anomaly',
        level: 'Low',
        title: 'Possible Subscription Creep',
        description: `Your ${bill.type} bill increased slightly by ${percentChange.toFixed(1)}% (₹${bill.amount - prevBill.amount}). Verify if hidden fees or tariff changes were added.`,
        billId: bill.id,
        date: new Date().toISOString().split('T')[0],
        resolved: false
      });
    }
  }
}

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
