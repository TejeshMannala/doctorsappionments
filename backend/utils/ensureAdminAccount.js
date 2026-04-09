const User = require('../models/User');

const ensureAdminAccount = async () => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminName = process.env.ADMIN_NAME || 'System Admin';

  if (!adminEmail || !adminPassword) {
    console.warn('Admin credentials are not set in .env. Skipping admin bootstrap.');
    return;
  }

  const existingAdmin = await User.findOne({ email: adminEmail }).select('+password');

  if (!existingAdmin) {
    await User.create({
      fullName: adminName,
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
    });
    console.log(`Admin account created for ${adminEmail}`);
    return;
  }

  existingAdmin.fullName = adminName;
  existingAdmin.role = 'admin';

  if (adminPassword) {
    existingAdmin.password = adminPassword;
  }

  await existingAdmin.save();
  console.log(`Admin account ensured for ${adminEmail}`);
};

module.exports = ensureAdminAccount;
