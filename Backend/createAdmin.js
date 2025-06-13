// backend/createAdmin.js

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const User     = require('./models/User');

async function createAdmin() {
  // 1. Ligação ao MongoDB
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  console.log('✔ MongoDB conectado');

  // 2. Dados do admin a criar
  const name     = 'Admin Principal';
  const email    = 'teste@cedteam.com';
  const password = '123';  // altere para a password que desejar

  // 3. Verificar se já existe um utilizador com esse email
  let user = await User.findOne({ email });
  if (user) {
    console.log(`⚠ Utilizador com email "${email}" já existe. Role atual: ${user.role}`);
    process.exit(0);
  }

  // 4. Gerar hash da password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 5. Criar e guardar o novo admin
  user = new User({
    name,
    email,
    password: hashedPassword,
    role: 'admin'
  });
  await user.save();

  console.log('✅ Admin criado com sucesso:');
  console.log(`   _id:  ${user._id}`);
  console.log(`   name: ${user.name}`);
  console.log(`   email:${user.email}`);
  console.log(`   role: ${user.role}`);
  console.log(`   password em texto claro (para login): ${password}`);

  process.exit(0);
}

createAdmin().catch(err => {
  console.error('❌ Erro ao criar admin:', err);
  process.exit(1);
});
