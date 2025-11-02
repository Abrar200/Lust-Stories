import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Upload, X, Plus } from 'lucide-react';
import { useToast } from './ui/use-toast';

export const WorkerProfileSetup: React.FC = () => {
  const [rate, setRate] = useState('300');
  const [bio, setBio] = useState('');
  const [services, setServices] = useState<string[]>(['Dinner Dates', 'Events', 'Travel']);
  const [newService, setNewService] = useState('');
  const { toast } = useToast();

  const addService = () => {
    if (newService.trim()) {
      setServices([...services, newService.trim()]);
      setNewService('');
    }
  };

  const removeService = (index: number) => {
    setServices(services.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    toast({ title: "Profile Updated", description: "Your changes have been saved" });
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-pink-400 to-purple-600 bg-clip-text text-transparent">Profile Setup</h1>

        <div className="space-y-6">
          <Card className="bg-zinc-900 border-zinc-800 p-6">
            <h2 className="text-xl font-bold text-pink-400 mb-4">Photos</h2>
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="aspect-square bg-zinc-800 rounded-lg flex items-center justify-center cursor-pointer hover:bg-zinc-700 transition-colors">
                  <Upload className="w-8 h-8 text-zinc-600" />
                </div>
              ))}
            </div>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800 p-6">
            <h2 className="text-xl font-bold text-pink-400 mb-4">Pricing</h2>
            <div className="space-y-2">
              <Label htmlFor="rate" className="text-zinc-400">Hourly Rate ($)</Label>
              <Input id="rate" type="number" value={rate} onChange={(e) => setRate(e.target.value)} className="bg-zinc-800 border-zinc-700 text-white" />
            </div>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800 p-6">
            <h2 className="text-xl font-bold text-pink-400 mb-4">Bio</h2>
            <Textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell clients about yourself..." className="bg-zinc-800 border-zinc-700 text-white min-h-[120px]" />
          </Card>

          <Card className="bg-zinc-900 border-zinc-800 p-6">
            <h2 className="text-xl font-bold text-pink-400 mb-4">Services</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {services.map((service, i) => (
                <Badge key={i} className="bg-pink-500/20 text-pink-400 border-pink-500/50 pr-1">
                  {service}
                  <X className="w-3 h-3 ml-2 cursor-pointer" onClick={() => removeService(i)} />
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input value={newService} onChange={(e) => setNewService(e.target.value)} placeholder="Add service..." className="bg-zinc-800 border-zinc-700 text-white" />
              <Button onClick={addService} className="bg-pink-500 hover:bg-pink-600"><Plus className="w-4 h-4" /></Button>
            </div>
          </Card>

          <Button onClick={handleSave} className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-6 text-lg">
            Save Profile
          </Button>
        </div>
      </div>
    </div>
  );
};
