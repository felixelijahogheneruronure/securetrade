
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchFromJsonBin, JSONBIN_CONFIG } from '@/utils/jsonbin-api';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const JsonBinDashboard = () => {
  const [data, setData] = useState<Record<string, any>>({
    users: null,
    wallets: null,
    kyc: null,
    notifications: null,
    transactions: null,
    messages: null
  });
  
  const [loading, setLoading] = useState<Record<string, boolean>>({
    users: true,
    wallets: true,
    kyc: true,
    notifications: true,
    transactions: true,
    messages: true
  });
  
  const [error, setError] = useState<Record<string, string | null>>({
    users: null,
    wallets: null,
    kyc: null,
    notifications: null,
    transactions: null,
    messages: null
  });

  useEffect(() => {
    const fetchData = async () => {
      const sections = [
        { key: 'users', url: JSONBIN_CONFIG.BINS.USERS },
        { key: 'wallets', url: JSONBIN_CONFIG.BINS.WALLETS },
        { key: 'kyc', url: JSONBIN_CONFIG.BINS.KYC },
        { key: 'notifications', url: JSONBIN_CONFIG.BINS.NOTIFICATIONS },
        { key: 'transactions', url: JSONBIN_CONFIG.BINS.TRANSACTIONS },
        { key: 'messages', url: JSONBIN_CONFIG.BINS.MESSAGES }
      ];

      sections.forEach(async ({ key, url }) => {
        try {
          const response = await fetchFromJsonBin(url);
          setData(prev => ({ ...prev, [key]: response.record }));
          setError(prev => ({ ...prev, [key]: null }));
        } catch (err) {
          console.error(`Failed to fetch ${key}:`, err);
          setError(prev => ({ ...prev, [key]: err instanceof Error ? err.message : 'Unknown error' }));
        } finally {
          setLoading(prev => ({ ...prev, [key]: false }));
        }
      });
    };

    fetchData();
  }, []);

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">JSONBin Dashboard</h2>
        <p className="text-muted-foreground">
          View and inspect all JSONBin data used by the application
        </p>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid grid-cols-6 w-full mb-4">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="wallets">Wallets</TabsTrigger>
          <TabsTrigger value="kyc">KYC</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
        </TabsList>

        {Object.entries(data).map(([key, value]) => (
          <TabsContent key={key} value={key} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getTabIcon(key)} {key.charAt(0).toUpperCase() + key.slice(1)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading[key] ? (
                  <div className="flex justify-center p-8">
                    <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
                  </div>
                ) : error[key] ? (
                  <div className="text-destructive p-4 bg-destructive/10 rounded-md">
                    Error: {error[key]}
                  </div>
                ) : (
                  <pre className="bg-muted p-4 rounded-md overflow-auto max-h-[600px]">
                    {JSON.stringify(value, null, 2)}
                  </pre>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

function getTabIcon(type: string) {
  switch (type) {
    case 'users':
      return <span className="text-xl">👤</span>;
    case 'wallets':
      return <span className="text-xl">💰</span>;
    case 'kyc':
      return <span className="text-xl">📄</span>;
    case 'notifications':
      return <span className="text-xl">🔔</span>;
    case 'transactions':
      return <span className="text-xl">📊</span>;
    case 'messages':
      return <span className="text-xl">✉️</span>;
    default:
      return <span className="text-xl">📁</span>;
  }
}

export default JsonBinDashboard;
