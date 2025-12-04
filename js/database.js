// Database Operations

// Save a calculation to the database
async function saveCalculation(month, previousReading, currentReading, rate, billAmount, kwhUsed) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return {
        success: false,
        message: 'User not authenticated',
        error: null
      };
    }
    
    const { data, error } = await supabaseClient
      .from('calculations')
      .insert([
        {
          user_id: user.id,
          month: month,
          previous_reading: parseFloat(previousReading),
          current_reading: parseFloat(currentReading),
          rate: parseFloat(rate),
          bill_amount: parseFloat(billAmount),
          kwh_used: parseFloat(kwhUsed)
        }
      ])
      .select();
    
    if (error) throw error;
    
    return {
      success: true,
      message: 'Calculation saved successfully!',
      data: data[0]
    };
  } catch (error) {
    console.error('Error saving calculation:', error);
    return {
      success: false,
      message: error.message || 'Failed to save calculation',
      error: error
    };
  }
}

// Get all calculations for current user
async function getUserCalculations() {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return {
        success: false,
        message: 'User not authenticated',
        data: []
      };
    }
    
    const { data, error } = await supabaseClient
      .from('calculations')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return {
      success: true,
      message: 'Calculations retrieved successfully!',
      data: data || []
    };
  } catch (error) {
    console.error('Error retrieving calculations:', error);
    return {
      success: false,
      message: error.message || 'Failed to retrieve calculations',
      data: [],
      error: error
    };
  }
}

// Get last bill amount
async function getLastBillAmount() {
  try {
    const result = await getUserCalculations();
    
    if (!result.success || result.data.length === 0) {
      return 0;
    }
    
    return result.data[0].bill_amount;
  } catch (error) {
    console.error('Error getting last bill amount:', error);
    return 0;
  }
}

// Get last kWh used
async function getLastKwhUsed() {
  try {
    const result = await getUserCalculations();
    
    if (!result.success || result.data.length === 0) {
      return 0;
    }
    
    return result.data[0].kwh_used;
  } catch (error) {
    console.error('Error getting last kWh used:', error);
    return 0;
  }
}

// Update a calculation
async function updateCalculation(id, month, previousReading, currentReading, rate, billAmount, kwhUsed) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return {
        success: false,
        message: 'User not authenticated',
        error: null
      };
    }
    
    const { data, error } = await supabaseClient
      .from('calculations')
      .update({
        month: month,
        previous_reading: parseFloat(previousReading),
        current_reading: parseFloat(currentReading),
        rate: parseFloat(rate),
        bill_amount: parseFloat(billAmount),
        kwh_used: parseFloat(kwhUsed),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select();
    
    if (error) throw error;
    
    return {
      success: true,
      message: 'Calculation updated successfully!',
      data: data[0]
    };
  } catch (error) {
    console.error('Error updating calculation:', error);
    return {
      success: false,
      message: error.message || 'Failed to update calculation',
      error: error
    };
  }
}

// Delete a calculation
async function deleteCalculation(id) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return {
        success: false,
        message: 'User not authenticated',
        error: null
      };
    }
    
    const { error } = await supabaseClient
      .from('calculations')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);
    
    if (error) throw error;
    
    return {
      success: true,
      message: 'Calculation deleted successfully!'
    };
  } catch (error) {
    console.error('Error deleting calculation:', error);
    return {
      success: false,
      message: error.message || 'Failed to delete calculation',
      error: error
    };
  }
}

// Get calculation by ID
async function getCalculationById(id) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return {
        success: false,
        message: 'User not authenticated',
        data: null
      };
    }
    
    const { data, error } = await supabaseClient
      .from('calculations')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();
    
    if (error) throw error;
    
    return {
      success: true,
      message: 'Calculation retrieved successfully!',
      data: data
    };
  } catch (error) {
    console.error('Error retrieving calculation:', error);
    return {
      success: false,
      message: error.message || 'Failed to retrieve calculation',
      data: null,
      error: error
    };
  }
}

// Get calculations for a specific month
async function getCalculationsByMonth(month) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return {
        success: false,
        message: 'User not authenticated',
        data: []
      };
    }
    
    const { data, error } = await supabaseClient
      .from('calculations')
      .select('*')
      .eq('user_id', user.id)
      .eq('month', month)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return {
      success: true,
      message: 'Calculations retrieved successfully!',
      data: data || []
    };
  } catch (error) {
    console.error('Error retrieving calculations by month:', error);
    return {
      success: false,
      message: error.message || 'Failed to retrieve calculations',
      data: [],
      error: error
    };
  }
}

// ============================================
// PROFILE OPERATIONS
// ============================================

// Create or update user profile
async function createOrUpdateProfile(email, fullName = '', phone = '', address = '') {
  try {
    // Get current authenticated user
    const user = await getCurrentUser();
    
    if (!user || !user.id) {
      console.error('❌ No authenticated user found');
      return {
        success: false,
        message: 'User not authenticated',
        error: 'No user ID'
      };
    }

    console.log('✅ Creating profile for user ID:', user.id);
    console.log('   Email:', email);
    
    // Prepare profile data
    const profileData = {
      id: user.id,
      email: email || user.email || '',
      full_name: fullName || email?.split('@')[0] || 'User',
      phone: phone || '',
      address: address || ''
    };

    console.log('✅ Profile data:', profileData);

    // First, try to check if profile exists
    const { data: checkData, error: checkError } = await supabaseClient
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      // PGRST116 means no rows found, which is ok
      console.warn('⚠️  Check error (ignoring if no rows):', checkError);
    }

    if (checkData && checkData.id) {
      // Profile exists, update it
      console.log('✅ Profile exists, updating...');
      
      const { data: updateData, error: updateError } = await supabaseClient
        .from('profiles')
        .update(profileData)
        .eq('id', user.id)
        .select();

      if (updateError) {
        console.error('❌ Update error:', updateError);
        return {
          success: false,
          message: 'Failed to update profile: ' + updateError.message,
          error: updateError
        };
      }

      console.log('✅ Profile updated:', updateData);
      return {
        success: true,
        message: 'Profile updated successfully!',
        data: updateData && updateData[0] ? updateData[0] : null
      };
    } else {
      // Profile doesn't exist, insert it
      console.log('✅ Profile does not exist, inserting...');
      
      const { data: insertData, error: insertError } = await supabaseClient
        .from('profiles')
        .insert([profileData])
        .select();

      if (insertError) {
        console.error('❌ Insert error:', insertError);
        return {
          success: false,
          message: 'Failed to insert profile: ' + insertError.message,
          error: insertError
        };
      }

      console.log('✅ Profile inserted:', insertData);
      return {
        success: true,
        message: 'Profile created successfully!',
        data: insertData && insertData[0] ? insertData[0] : null
      };
    }

  } catch (error) {
    console.error('❌ Profile operation error:', error);
    return {
      success: false,
      message: error.message || 'Failed to create profile',
      error: error
    };
  }
}

// Add recent user to database
async function addRecentUserToDatabase(email) {
  try {
    // Get all existing profiles ordered by most recent
    const { data, error } = await supabaseClient
      .from('profiles')
      .select('email')
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (error) {
      console.warn('Could not fetch recent users:', error);
      return;
    }
    
    // Just ensure profile exists - it's already in profiles table
    console.log('Recent user stored:', email);
  } catch (error) {
    console.error('Error adding recent user:', error);
  }
}

// Get all recent users from database
async function getRecentUsersFromDatabase() {
  try {
    const { data, error } = await supabaseClient
      .from('profiles')
      .select('email')
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (error) throw error;
    
    return {
      success: true,
      data: data ? data.map(profile => profile.email) : []
    };
  } catch (error) {
    console.error('Error fetching recent users from database:', error);
    return {
      success: false,
      data: []
    };
  }
}

// Get user profile
async function getUserProfile() {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return {
        success: false,
        message: 'User not authenticated',
        data: null
      };
    }
    
    const { data, error } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (error) throw error;
    
    return {
      success: true,
      message: 'Profile retrieved successfully!',
      data: data
    };
  } catch (error) {
    console.error('Error retrieving profile:', error);
    return {
      success: false,
      message: error.message || 'Failed to retrieve profile',
      data: null,
      error: error
    };
  }
}

// Update user profile
async function updateUserProfile(fullName = '', phone = '', address = '') {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return {
        success: false,
        message: 'User not authenticated',
        error: null
      };
    }
    
    const { data, error } = await supabaseClient
      .from('profiles')
      .update({
        full_name: fullName,
        phone: phone,
        address: address,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)
      .select();
    
    if (error) throw error;
    
    return {
      success: true,
      message: 'Profile updated successfully!',
      data: data[0]
    };
  } catch (error) {
    console.error('Error updating profile:', error);
    return {
      success: false,
      message: error.message || 'Failed to update profile',
      error: error
    };
  }
}

// Get profile by user ID
async function getProfileByUserId(userId) {
  try {
    const { data, error } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    
    return {
      success: true,
      message: 'Profile retrieved successfully!',
      data: data
    };
  } catch (error) {
    console.error('Error retrieving profile:', error);
    return {
      success: false,
      message: error.message || 'Failed to retrieve profile',
      data: null,
      error: error
    };
  }
}
