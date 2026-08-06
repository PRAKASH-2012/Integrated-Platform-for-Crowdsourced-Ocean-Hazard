/* ==========================================================================
   OceanShield AI - Authentication & Role Permission Engine
   ========================================================================== */

class AuthEngine {
  constructor() {
    this.currentUser = Storage.getCurrentUser();
  }

  login(email, password, role) {
    const users = Storage.getUsers();
    const matchedUser = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.role === role);

    if (matchedUser) {
      Storage.setCurrentUser(matchedUser);
      this.currentUser = matchedUser;
      showToast(`Welcome back, ${matchedUser.name} (${matchedUser.role})`, 'success');
      return true;
    } else {
      // Create flexible fallback session
      const newUser = {
        id: `USR-${Date.now().toString().slice(-4)}`,
        name: email.split('@')[0].toUpperCase(),
        email: email,
        role: role,
        district: 'Chennai',
        state: 'Tamil Nadu',
        points: 100,
        badge: 'First Responder',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        phone: '+91 98765 43210'
      };
      Storage.setCurrentUser(newUser);
      this.currentUser = newUser;
      showToast(`New ${role} Session Created!`, 'success');
      return true;
    }
  }

  signup(userData) {
    const users = Storage.getUsers();
    const newUser = {
      id: `USR-${Date.now().toString().slice(-4)}`,
      ...userData,
      points: 50,
      badge: 'Ocean Scout',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
    };
    users.push(newUser);
    Storage.setData(STORAGE_KEYS.USERS, users);
    Storage.setCurrentUser(newUser);
    this.currentUser = newUser;
    showToast('Account registered successfully!', 'success');
    return true;
  }

  switchRole(newRole) {
    const users = Storage.getUsers();
    const matched = users.find(u => u.role === newRole);
    if (matched) {
      Storage.setCurrentUser(matched);
      this.currentUser = matched;
    } else if (this.currentUser) {
      this.currentUser.role = newRole;
      Storage.setCurrentUser(this.currentUser);
    }
    showToast(`Switched active role to: ${newRole}`, 'info');
    window.location.reload();
  }

  logout() {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    showToast('Logged out of OceanShield AI', 'info');
    window.location.href = 'index.html';
  }

  sendOTPSimulated(phoneOrEmail) {
    const otp = Math.floor(100000 + Math.random() * 900000);
    showToast(`🔑 OTP Sent to ${phoneOrEmail}: [ ${otp} ]`, 'info', 'fa-key');
    return otp;
  }
}

const Auth = new AuthEngine();
