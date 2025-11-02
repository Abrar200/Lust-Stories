import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Upload, User } from 'lucide-react';
import { useToast } from './ui/use-toast';

export const CustomerProfile: React.FC = () => {
  const [isPrivate, setIsPrivate] = useState(false);
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [address, setAddress] = useState('');
  const [role, setRole] = useState('daddy');
  const [sex, setSex] = useState('female');
  const [sexuality, setSexuality] = useState('straight');
  const { toast } = useToast();

  const handleSave = () => {
    toast({ title: "Profile Updated", description: "Your changes have been saved successfully" });
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">Profile</h1>
        <p className="text-gray-600 mt-1">Manage your personal information</p>
      </div>

      <Card className="bg-white border-pink-100 p-6">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
          <Label className="text-base font-medium">Private account</Label>
          <Switch checked={isPrivate} onCheckedChange={setIsPrivate} />
        </div>

        <div className="space-y-6">
          <div>
            <Label className="text-sm font-medium mb-2 block">Profile Photo</Label>
            <div className="w-32 h-32 bg-gradient-to-br from-pink-100 to-rose-100 rounded-lg flex items-center justify-center cursor-pointer hover:from-pink-200 hover:to-rose-200 transition-all border-2 border-dashed border-pink-300">
              <Upload className="w-8 h-8 text-pink-600" />
            </div>
          </div>

          <div><Label>Username</Label><Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter username" className="bg-white border-gray-300 focus:border-pink-400" /></div>
          <div><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" className="bg-white border-gray-300 focus:border-pink-400" /></div>
          <div><Label>Bio</Label><Textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell us about yourself" className="bg-white border-gray-300 focus:border-pink-400 min-h-[80px]" /></div>
          <div><Label>Default Address</Label><Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Enter your address" className="bg-white border-gray-300 focus:border-pink-400" /></div>

          <div className="space-y-3 pt-4 border-t border-gray-200">
            <Label className="text-sm font-semibold">Role</Label>
            <RadioGroup value={role} onValueChange={setRole}>
              <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-pink-50 transition-colors">
                <RadioGroupItem value="daddy" id="daddy" className="border-pink-500 text-pink-600" />
                <Label htmlFor="daddy" className="font-normal cursor-pointer">Sugar Daddy</Label>
              </div>
              <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-pink-50 transition-colors">
                <RadioGroupItem value="mummy" id="mummy" className="border-pink-500 text-pink-600" />
                <Label htmlFor="mummy" className="font-normal cursor-pointer">Sugar Mummy</Label>
              </div>
            </RadioGroup>
          </div>

          <Button onClick={handleSave} className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-semibold py-3">
            Save Changes
          </Button>
        </div>
      </Card>
    </div>
  );
};
