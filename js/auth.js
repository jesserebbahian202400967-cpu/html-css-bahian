// Authentication Functions

// Manage recent users in localStorage
function getRecentUsers() {
  try {
    const recent = localStorage.getItem('recentUsers');
    return recent ? JSON.parse(recent) : [];
  } catch (error) {
    console.error('Error getting recent users:', error);
    return [];
  }
}

function addRecentUser(email) {
  try {
    let recentUsers = getRecentUsers();
    // Remove if already exists, then add to top
    recentUsers = recentUsers.filter(e => e !== email);
    recentUsers.unshift(email);
    // Keep only last 10 users
    recentUsers = recentUsers.slice(0, 10);
    localStorage.setItem('recentUsers', JSON.stringify(recentUsers));
  } catch (error) {
    console.error('Error adding recent user:', error);
  }
}

function clearRecentUsers() {
  try {
    localStorage.removeItem('recentUsers');
  } catch (error) {
    console.error('Error clearing recent users:', error);
  }
}

// Check if user is authenticated
async function isUserAuthenticated() {
  try {
    const { data: { user } } = await supabaseClient.auth.getUser();
    return user !== null;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
}

// Get current user
async function getCurrentUser() {
  try {
    const { data: { user } } = await supabaseClient.auth.getUser();
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

// Sign up with email and password
async function signUp(email, password) {
  try {
    const { data, error } = await supabaseClient.auth.signUp({
      email: email,
      password: password
    });
    
    if (error) throw error;
    
    // Store recent user
    addRecentUser(email);
    
    return {
      success: true,
      message: 'Sign up successful! Check your email for verification.',
      user: data.user
    };
  } catch (error) {
    console.error('Sign up error:', error);
    return {
      success: false,
      message: error.message || 'Sign up failed',
      error: error
    };
  }
}

// Login with email and password
async function login(email, password) {
  try {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email: email,
      password: password
    });
    
    if (error) throw error;
    
    // Store recent user
    addRecentUser(email);
    
    return {
      success: true,
      message: 'Login successful!',
      user: data.user,
      session: data.session
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      message: error.message || 'Login failed',
      error: error
    };
  }
}

// Logout
async function logout() {
  try {
    const { error } = await supabaseClient.auth.signOut();
    
    if (error) throw error;
    
    return {
      success: true,
      message: 'Logged out successfully!'
    };
  } catch (error) {
    console.error('Logout error:', error);
    return {
      success: false,
      message: error.message || 'Logout failed',
      error: error
    };
  }
}

// Reset password
async function resetPassword(email) {
  try {
    const { data, error } = await supabaseClient.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password.html`
    });
    
    if (error) throw error;
    
    return {
      success: true,
      message: 'Password reset email sent!',
      data: data
    };
  } catch (error) {
    console.error('Password reset error:', error);
    return {
      success: false,
      message: error.message || 'Password reset failed',
      error: error
    };
  }
}

// Protect pages - redirect to login if not authenticated
async function protectPage() {
  const isAuthenticated = await isUserAuthenticated();
  
  if (!isAuthenticated) {
    window.location.href = 'login.html';
  }
  
  return isAuthenticated;
}

// Listen to auth state changes
function onAuthStateChange(callback) {
  return supabaseClient.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
}
