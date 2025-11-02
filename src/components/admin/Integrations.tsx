import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Mail, MessageSquare, BarChart3, Cloud, Key, CheckCircle2, XCircle } from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: any;
  enabled: boolean;
  status: 'active' | 'inactive' | 'error';
  apiKey?: string;
  config?: Record<string, string>;
}

export default function Integrations() {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'stripe',
      name: 'Stripe',
      description: 'Payment processing and subscriptions',
      icon: CreditCard,
      enabled: true,
      status: 'active',
      apiKey: 'sk_test_••••••••••••••••',
    },
    {
      id: 'sendgrid',
      name: 'SendGrid',
      description: 'Email delivery service',
      icon: Mail,
      enabled: true,
      status: 'active',
      apiKey: 'SG.••••••••••••••••',
    },
    {
      id: 'twilio',
      name: 'Twilio',
      description: 'SMS and voice communications',
      icon: MessageSquare,
      enabled: false,
      status: 'inactive',
    },
    {
      id: 'analytics',
      name: 'Google Analytics',
      description: 'Web analytics and reporting',
      icon: BarChart3,
      enabled: true,
      status: 'active',
      apiKey: 'G-••••••••••',
    },
    {
      id: 's3',
      name: 'AWS S3',
      description: 'Cloud storage for media files',
      icon: Cloud,
      enabled: true,
      status: 'active',
    },
  ]);

  const toggleIntegration = (id: string) => {
    setIntegrations(prev => prev.map(int => 
      int.id === id ? { ...int, enabled: !int.enabled, status: !int.enabled ? 'active' : 'inactive' } : int
    ));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-pink-400 mb-2">Integrations</h2>
        <p className="text-gray-400">Manage third-party services and API connections</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {integrations.map((integration) => {
          const Icon = integration.icon;
          return (
            <Card key={integration.id} className="bg-zinc-900 border-pink-500/30">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-pink-300">{integration.name}</CardTitle>
                      <CardDescription className="text-gray-400 text-sm">
                        {integration.description}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant={integration.status === 'active' ? 'default' : 'secondary'} 
                    className={integration.status === 'active' ? 'bg-green-500/20 text-green-400 border-green-500/50' : 'bg-gray-500/20 text-gray-400'}>
                    {integration.status === 'active' ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                    {integration.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {integration.apiKey && (
                  <div className="space-y-2">
                    <Label className="text-gray-300 flex items-center gap-2">
                      <Key className="w-4 h-4" />
                      API Key
                    </Label>
                    <Input 
                      type="password" 
                      value={integration.apiKey}
                      className="bg-black border-pink-500/30 text-gray-300"
                      readOnly
                    />
                  </div>
                )}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm text-gray-400">Enable Integration</span>
                  <Switch 
                    checked={integration.enabled}
                    onCheckedChange={() => toggleIntegration(integration.id)}
                    className="data-[state=checked]:bg-purple-600"
                  />

                </div>
                <Button 
                  variant="outline" 
                  className="w-full bg-pink-500/10 border-pink-500/50 text-pink-300 hover:bg-pink-500/20"
                >
                  Configure
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
