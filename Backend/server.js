// backend/server.js
const express     = require('express');
const mongoose    = require('mongoose');
const cors        = require('cors');
require('dotenv').config();

const authRoutes  = require('./routes/auth');
const userRoutes  = require('./routes/users');
const catRoutes   = require('./routes/categories');
const qRoutes     = require('./routes/questions');
const quizRoutes  = require('./routes/quiz');
const auditRoutes = require('./routes/audit');
const authMw      = require('./middlewares/auth');

const app = express();

// Middleware global
app.use(cors());
app.use(express.json());

// Conexão ao MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB conectado'))
.catch(err => console.error('Erro MongoDB:', err));

// Rotas públicas
app.use('/api/auth', authRoutes);

// Rotas protegidas (exigem token)
app.use('/api/users',      authMw, userRoutes);
app.use('/api/categories', authMw, catRoutes);
app.use('/api/questions',  authMw, qRoutes);
app.use('/api/quiz',       authMw, quizRoutes);

// Rota de auditoria (só admins)
app.use('/api/audit', authMw, auditRoutes);

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor a correr na porta ${PORT}`));
