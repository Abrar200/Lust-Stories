import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';

interface ReportModalProps {
  open: boolean;
  onClose: () => void;
  reportedUserId: string;
  reportedUserName: string;
}

const REPORT_CATEGORIES = [
  { value: 'harassment', label: 'Harassment or Bullying' },
  { value: 'spam', label: 'Spam or Scam' },
  { value: 'inappropriate_behavior', label: 'Inappropriate Behavior' },
  { value: 'fake_profile', label: 'Fake Profile' },
  { value: 'scam', label: 'Scam or Fraud' },
  { value: 'other', label: 'Other' },
];

export default function ReportModal({ open, onClose, reportedUserId, reportedUserName }: ReportModalProps) {
  const [category, setCategory] = useState('harassment');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!description.trim()) {
      toast({ title: 'Please provide a description', variant: 'destructive' });
      return;
    }

    setSubmitting(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from('reports').insert({
      reporter_id: user.id,
      reported_id: reportedUserId,
      category,
      description: description.trim(),
    });

    setSubmitting(false);

    if (error) {
      toast({ title: 'Failed to submit report', variant: 'destructive' });
    } else {
      toast({ title: 'Report submitted successfully' });
      setDescription('');
      setCategory('harassment');
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Report {reportedUserName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label>Reason for reporting</Label>
            <RadioGroup value={category} onValueChange={setCategory} className="mt-2 space-y-2">
              {REPORT_CATEGORIES.map((cat) => (
                <div key={cat.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={cat.value} id={cat.value} />
                  <Label htmlFor={cat.value} className="font-normal cursor-pointer">
                    {cat.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          <div>
            <Label htmlFor="description">Additional details</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please provide more details about this report..."
              rows={4}
              className="mt-2"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={submitting} className="flex-1">
            {submitting ? 'Submitting...' : 'Submit Report'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
