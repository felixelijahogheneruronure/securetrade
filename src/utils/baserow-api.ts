
// Baserow API configuration and utility functions
export const BASEROW_CONFIG = {
  API_BASE_URL: 'https://api.baserow.io/api',
  API_TOKEN: 'Fs9f11ckIZvi4fHOn818XSj9KuxcyCmy',
  TABLE_ID: '556062',
  TABLE_NAME: 'UserAccounts'
};

export type BaserowUser = {
  id: number;
  username: string;
  email: string;
  password: string;
  role: string;
  tier: string;
  account_status: string;
  wallets: string; // JSON string in Baserow
};

export type UserWallet = {
  id: string;
  name: string;
  symbol: string;
  balance: string;
  value: number;
  change: string;
};

export type User = {
  id: string;
  username: string;
  email: string;
  role: string;
  tier: number;
  account_status: string;
  wallets: UserWallet[];
  isAdmin: boolean;
};

// Default welcome bonus wallet
export const WELCOME_BONUS_WALLET: UserWallet = {
  id: "welcome_bonus",
  name: "Welcome Bonus",
  symbol: "USD",
  balance: "100.00",
  value: 100.00,
  change: "0%"
};

/**
 * Makes authenticated requests to Baserow API
 */
const makeBaserowRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${BASEROW_CONFIG.API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Token ${BASEROW_CONFIG.API_TOKEN}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Baserow API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

/**
 * Transforms Baserow user data to application user format
 */
const transformBaserowUser = (baserowUser: BaserowUser): User => {
  let wallets: UserWallet[] = [];
  
  try {
    if (baserowUser.wallets) {
      const parsedWallets = JSON.parse(baserowUser.wallets);
      wallets = parsedWallets.map((wallet: any, index: number) => ({
        id: wallet.id || `wallet_${index}`,
        name: wallet.name,
        symbol: wallet.symbol,
        balance: wallet.balance,
        value: typeof wallet.value === 'string' ? parseFloat(wallet.value.replace(/[$,]/g, '')) || 0 : wallet.value,
        change: wallet.change
      }));
    }
  } catch (error) {
    console.error('Error parsing wallets JSON:', error);
    wallets = [WELCOME_BONUS_WALLET];
  }

  return {
    id: baserowUser.id.toString(),
    username: baserowUser.username,
    email: baserowUser.email,
    role: baserowUser.role,
    tier: parseInt(baserowUser.tier) || 1,
    account_status: baserowUser.account_status,
    wallets,
    isAdmin: baserowUser.role === 'Admin'
  };
};

/**
 * Fetches all users from Baserow
 */
export const fetchUsers = async (): Promise<User[]> => {
  try {
    const response = await makeBaserowRequest(`/database/rows/table/${BASEROW_CONFIG.TABLE_ID}/`);
    return response.results.map(transformBaserowUser);
  } catch (error) {
    console.error('Error fetching users from Baserow:', error);
    throw error;
  }
};

/**
 * Finds a user by email and password
 */
export const authenticateUser = async (email: string, password: string): Promise<User | null> => {
  try {
    const response = await makeBaserowRequest(
      `/database/rows/table/${BASEROW_CONFIG.TABLE_ID}/?filter__field_email__equal=${encodeURIComponent(email)}`
    );
    
    const user = response.results.find((u: BaserowUser) => u.password === password);
    return user ? transformBaserowUser(user) : null;
  } catch (error) {
    console.error('Error authenticating user:', error);
    throw error;
  }
};

/**
 * Creates a new user in Baserow
 */
export const createUser = async (userData: {
  username: string;
  email: string;
  password: string;
  role?: string;
  tier?: string;
}): Promise<User> => {
  try {
    const newUser = {
      username: userData.username,
      email: userData.email,
      password: userData.password,
      role: userData.role || 'User',
      tier: userData.tier || '1',
      account_status: 'Active',
      wallets: JSON.stringify([WELCOME_BONUS_WALLET])
    };

    const response = await makeBaserowRequest(`/database/rows/table/${BASEROW_CONFIG.TABLE_ID}/`, {
      method: 'POST',
      body: JSON.stringify(newUser)
    });

    return transformBaserowUser(response);
  } catch (error) {
    console.error('Error creating user in Baserow:', error);
    throw error;
  }
};

/**
 * Updates user wallets in Baserow
 */
export const updateUserWallets = async (userId: string, wallets: UserWallet[]): Promise<boolean> => {
  try {
    await makeBaserowRequest(`/database/rows/table/${BASEROW_CONFIG.TABLE_ID}/${userId}/`, {
      method: 'PATCH',
      body: JSON.stringify({
        wallets: JSON.stringify(wallets)
      })
    });
    return true;
  } catch (error) {
    console.error('Error updating user wallets:', error);
    return false;
  }
};

/**
 * Updates user tier in Baserow
 */
export const updateUserTier = async (userId: string, tier: number): Promise<boolean> => {
  try {
    await makeBaserowRequest(`/database/rows/table/${BASEROW_CONFIG.TABLE_ID}/${userId}/`, {
      method: 'PATCH',
      body: JSON.stringify({
        tier: tier.toString()
      })
    });
    return true;
  } catch (error) {
    console.error('Error updating user tier:', error);
    return false;
  }
};
