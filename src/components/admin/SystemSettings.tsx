import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Save } from 'lucide-react';
import { useState } from 'react';

export default function SystemSettings() {
  const [platformFee, setPlatformFee] = useState([10]);
  const [features, setFeatures] = useState({
    registration: true,
    booking: true,
    messaging: true,
    videoCall: true,
    reviews: true,
  });

  return (
    <div className="space-y-6">
      <Card className="bg-zinc-900 border-pink-500/30">
        <CardHeader>
          <CardTitle className="text-pink-300">Platform Fees</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-pink-300">Commission Rate: {platformFee[0]}%</Label>
            <Slider value={platformFee} onValueChange={setPlatformFee} max={30} step={1} className="mt-2" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-pink-300">Minimum Booking Amount</Label>
              <Input type="number" defaultValue="50" className="bg-black/50 border-pink-500/50 text-pink-100" />
            </div>
            <div>
              <Label className="text-pink-300">Cancellation Fee (%)</Label>
              <Input type="number" defaultValue="15" className="bg-black/50 border-pink-500/50 text-pink-100" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900 border-pink-500/30">
        <CardHeader>
          <CardTitle className="text-pink-300">Feature Flags</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(features).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <Label className="capitalize text-pink-200">{key.replace(/([A-Z])/g, ' $1')}</Label>
              <Switch checked={value} onCheckedChange={(checked) => setFeatures({...features, [key]: checked})} />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="bg-zinc-900 border-pink-500/30">
        <CardHeader>
          <CardTitle className="text-pink-300">Security Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-pink-300">Session Timeout (minutes)</Label>
            <Input type="number" defaultValue="30" className="bg-black/50 border-pink-500/50 text-pink-100" />
          </div>
          <div>
            <Label className="text-pink-300">Max Login Attempts</Label>
            <Input type="number" defaultValue="5" className="bg-black/50 border-pink-500/50 text-pink-100" />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-pink-200">Two-Factor Authentication</Label>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
        <Save className="w-4 h-4 mr-2" />Save All Settings
      </Button>
    </div>
  );
}
