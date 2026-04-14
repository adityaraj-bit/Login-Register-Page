const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;
const { Storage } = require('@google-cloud/storage');
const bcrypt = require('bcrypt');

const app = express();
const USE_GCP = false; // Set to true to use GCP Cloud Storage
const ALLOWED_DOMAINS = ['gmail.com', 'outlook.com', 'yahoo.com', 'hotmail.com', 'highspring.in'];

let storage, bucket, file;
if (USE_GCP) {
  storage = new Storage();
  bucket = storage.bucket('aditya-login-bucket-storage'); 
  file = bucket.file('users.json');
}

const LOCAL_STORAGE_PATH = path.join(__dirname, 'users.json');

app.use(express.json());
app.use(cors());

// serve frontend
app.use(express.static(path.join(__dirname, '../')));

// ===== helper =====
async function getUsers() {
  try {
    if (USE_GCP) {
      const data = await file.download();
      return JSON.parse(data.toString());
    } else {
      const data = await fs.readFile(LOCAL_STORAGE_PATH, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
  console.error("Error reading users:", err.message);
  return [];
}
}

async function saveUsers(users) {
  const content = JSON.stringify(users, null, 2);
  if (USE_GCP) {
    await file.save(content, {
  contentType: 'application/json'
});
  } else {
    await fs.writeFile(LOCAL_STORAGE_PATH, content, 'utf-8');
  }
}

// ===== API =====

// REGISTER
app.post('/api/register', async (req, res) => {
  console.log("Incoming Register Request:", req.body);
  const { firstName, lastName, age, phone, email, password } = req.body;

  // Basic Backend Validation
  if (!firstName || !lastName || !age || !phone || !email || !password) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  const nameRegex = /^[A-Za-z]+$/;

if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
  return res.status(400).json({ success: false, message: "Name must contain only letters" });
}

  // Email validation (robust and restricted)
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: "Invalid email format" });
  }

  // Domain restriction
  const domain = email.split('@')[1];
  if (!ALLOWED_DOMAINS.includes(domain)) {
    return res.status(400).json({ success: false, message: `Only allowed for: ${ALLOWED_DOMAINS.join(', ')}` });
  }

  // Support international phone format (Optional + followed by country code and digits)
  const phoneRegex = /^\+?\d{10,15}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({ success: false, message: "Invalid phone number format" });
  }

  // Relaxed Age validation (0 to 150)
  const ageNum = parseInt(age);
  if (isNaN(ageNum) || ageNum < 0 || ageNum > 150) {
    return res.status(400).json({ success: false, message: "Age must be between 0 and 150" });
  }

  // Password strength (at least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char)
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({ success: false, message: "Password is too weak (Need A,a,1,@ and 8+ chars)" });
  }

  let users = await getUsers();

  if (users.find(u => u.email === email)) {
    return res.status(400).json({ success: false, message: "User with this email already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

users.push({
  firstName,
  lastName,
  age: ageNum,
  phone,
  email,
  password: hashedPassword,
  createdAt: new Date().toISOString()
});
  await saveUsers(users);

  res.json({ success: true });
});

// LOGIN
app.post('/api/login', async (req, res) => {
  console.log("Incoming Login Request:", req.body);
  const { email, password } = req.body;

  let users = await getUsers();

  const user = users.find(u => u.email === email);

if (!user) {
  return res.json({ success: false, message: "Invalid email or password" });
}

const isMatch = await bcrypt.compare(password, user.password);

if (!isMatch) {
  return res.json({ success: false, message: "Invalid email or password" });
}

const { password: _, ...userProfile } = user;
res.json({ success: true, user: userProfile });

  if (user) {
    const { password, ...userProfile } = user;
    res.json({ success: true, user: userProfile });
  } else {
    res.json({ success: false, message: "Invalid email or password" });
  }
});

// default route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

app.listen(80, () => console.log('Server running on port 80'));