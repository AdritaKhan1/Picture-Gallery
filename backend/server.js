const express  = require('express');
const cors     = require('cors');
const path     = require('path');
const fs       = require('fs');
const multer   = require('multer');

const mongoose = require('mongoose');
const Item     = require('./models/Item');   //importing the file and the info

const PORT          = 8080;
const DATABASE_HOST = 'localhost';
const DATABASE_PORT = 27017;

//auth variables
const AUTH_USERNAME = process.env.AUTH_USERNAME;
const AUTH_PASSWORD = process.env.AUTH_PASSWORD;
const AUTH_TOKEN    = process.env.AUTH_TOKEN;

//uploaded pics
const UPLOAD_DIR = path.join(__dirname, 'uploads');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const app = express();
app.use(cors());
app.use('/uploads', express.static(UPLOAD_DIR));   // serve images at /uploads/<filename>

// multer saves each upload with a unique filename (keeping its extension)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename:    (req, file, cb) =>
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1e6) + path.extname(file.originalname))
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// database connect
const dbURL = `mongodb://${DATABASE_HOST}:${DATABASE_PORT}/pics_app`;
mongoose.connect(dbURL);

const db = mongoose.connection;
db.on('error', (e) => { console.log('connection error:' + e); process.exit(1); });
db.once('open', () => console.log('Database connected!'));

// --- tiny authorization middleware for protected routes ---
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization header missing or invalid' });
  }
  const token = authHeader.substring(7);   // extract token after "Bearer "
  if (token !== AUTH_TOKEN) {
    return res.status(401).json({ error: 'Invalid auth token' });
  }
  next();
}

/*************************/
/*  AUTH: login          */
/*************************/
// check username/password, hand back the token used for protected actions
app.post('/api/auth/login', express.json(), (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  if (username === AUTH_USERNAME && password === AUTH_PASSWORD) {
    return res.status(200).json({ message: 'Login successful', token: AUTH_TOKEN });
  }
  return res.status(401).json({ error: 'Invalid username or password' });
});

/*************************/
/*  READ: all items      */
/*************************/
app.get('/api/items', (req, res) => {
  Item.find().sort({ _id: -1 })          // newest first
    .then(items => res.json(items))
    .catch(err => { console.error(err); res.status(500).json({ error: 'Internal server error' }); });
});

/*************************/
/*  CREATE: upload item  */
/*************************/
// `upload.single('image')` reads one image file; title/info come in as text fields
app.post('/api/items', requireAuth, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'An image is required' });
  if (!req.body.title) {
    fs.unlink(path.join(UPLOAD_DIR, req.file.filename), () => {});   // drop the orphan file
    return res.status(400).json({ error: 'A title is required' });
  }

  const item = new Item({
    title: req.body.title,
    info:  req.body.info || '',
    image: req.file.filename
  });
  item.save()
    .then(saved => res.status(201).json(saved))
    .catch(err => { console.error(err); res.status(500).json({ error: 'Internal server error' }); });
});

/*************************/
/*  UPDATE: edit item    */
/*************************/
// edit the title/info, and optionally replace the picture
app.patch('/api/items/:id', requireAuth, upload.single('image'), async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    if (req.body.title !== undefined) item.title = req.body.title;
    if (req.body.info  !== undefined) item.info  = req.body.info;

    if (req.file) {                                   // a new picture was uploaded
      fs.unlink(path.join(UPLOAD_DIR, item.image), () => {});   // remove the old one
      item.image = req.file.filename;
    }

    await item.save();
    res.status(200).json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/*************************/
/*  DELETE: remove item  */
/*************************/
app.delete('/api/items/:id', requireAuth, async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    fs.unlink(path.join(UPLOAD_DIR, item.image), () => {});   // delete the picture file too
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => console.log('Server started on port: ' + PORT));

module.exports = app;
