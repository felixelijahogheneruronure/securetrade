
// JSONBin API configuration and utility functions
export const JSONBIN_CONFIG = {
  // API keys
  MASTER_KEY: '$2a$10$a93Wz14f/5DUCwACUbuF6eLnVRO4UhHPzsOg38B1qo9ikgHYFHRtG',
  ACCESS_KEY: '$2a$10$ZBvH0BxKCETxq1zcx60ufuO/YIMH63mLSnUcAIxa5sp1DZ72ZDnNS',
  
  // Bin URLs
  BINS: {
    USERS: 'https://api.jsonbin.io/v3/b/6818865b8a456b796697f195',
    WALLETS: 'https://api.jsonbin.io/v3/b/6818867e8561e97a500e1d4d',
    KYC: 'https://api.jsonbin.io/v3/b/681886a98a456b796697f1de',
    NOTIFICATIONS: 'https://api.jsonbin.io/v3/b/681886c68960c979a593b1c6',
    TRANSACTIONS: 'https://api.jsonbin.io/v3/b/68188bc48561e97a500e203a',
    MESSAGES: 'https://api.jsonbin.io/v3/b/68188c258960c979a593b49a'
  }
};

/**
 * Fetches data from JSONBin
 * @param binUrl - The JSONBin URL to fetch data from
 * @returns The JSON response data
 */
export const fetchFromJsonBin = async (binUrl: string) => {
  const response = await fetch(`${binUrl}/latest`, {
    headers: {
      'X-Master-Key': JSONBIN_CONFIG.MASTER_KEY,
      'X-Access-Key': JSONBIN_CONFIG.ACCESS_KEY,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch from JSONBin: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
};

/**
 * Updates data in JSONBin
 * @param binUrl - The JSONBin URL to update
 * @param data - The data to update
 * @returns The JSON response data
 */
export const updateJsonBin = async (binUrl: string, data: any) => {
  const response = await fetch(binUrl, {
    method: 'PUT',
    headers: {
      'X-Master-Key': JSONBIN_CONFIG.MASTER_KEY,
      'X-Access-Key': JSONBIN_CONFIG.ACCESS_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error(`Failed to update JSONBin: ${response.status} ${response.statusText}`);
  }

  return response.json();
};
