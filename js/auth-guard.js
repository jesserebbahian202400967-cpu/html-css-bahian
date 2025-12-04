// Auth Guard - Protects pages requiring authentication

async function requireAuth() {
  try {
    const { data: { user } } = await supabaseClient.auth.getUser();
    
    if (!user) {
      // Not authenticated, redirect to login
      window.location.href = 'login.html';
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Auth check error:', error);
    window.location.href = 'login.html';
    return false;
  }
}

// Check if user is authenticated (without redirecting)
async function isAuthenticated() {
  try {
    const { data: { user } } = await supabaseClient.auth.getUser();
    return user !== null;
  } catch (error) {
    console.error('Auth check error:', error);
    return false;
  }
}

// Logout function
async function logout() {
  try {
    await supabaseClient.auth.signOut();
    window.location.href = 'login.html';
  } catch (error) {
    console.error('Logout error:', error);
    alert('Logout failed');
  }
}

// Get current user email
async function getCurrentUserEmail() {
  try {
    const { data: { user } } = await supabaseClient.auth.getUser();
    return user ? user.email : null;
  } catch (error) {
    console.error('Error getting user email:', error);
    return null;
  }
}

// Get current user ID
async function getCurrentUserId() {
  try {
    const { data: { user } } = await supabaseClient.auth.getUser();
    return user ? user.id : null;
  } catch (error) {
    console.error('Error getting user ID:', error);
    return null;
  }
}

// Listen for logout links
document.addEventListener('DOMContentLoaded', function() {
  const logoutLinks = document.querySelectorAll('a[href="login.html"]');
  
  logoutLinks.forEach(link => {
    // Check if this is in the navbar (likely the logout link)
    if (link.closest('nav') || link.textContent.toLowerCase().includes('log out')) {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        logout();
      });
    }
  });
});
