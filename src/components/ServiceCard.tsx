import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { ThumbsUp } from 'lucide-react';

interface ServiceCardProps {
  service: {
    id: string;
    name: string;
    description: string;
    price: number;
    is_public: boolean;
    popularity_percentage: number;
    booking_count: number;
  };
  onUpdate: (id: string, updates: any) => void;
  onRemove: (id: string) => void;
}

export const ServiceCard = ({ service, onUpdate, onRemove }: ServiceCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(service.description);

  const handleSave = () => {
    onUpdate(service.id, { description });
    setIsEditing(false);
  };

  return (
    <Card className="p-4 border-2 border-pink-200 bg-white">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-pink-600">{service.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <ThumbsUp className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              {service.popularity_percentage}% ({service.booking_count})
            </span>
          </div>
          <p className="text-lg font-bold text-gray-800 mt-1">${service.price} p/h</p>
        </div>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              checked={service.is_public}
              onChange={() => onUpdate(service.id, { is_public: true })}
              className="text-pink-600"
            />
            Public
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              checked={!service.is_public}
              onChange={() => onUpdate(service.id, { is_public: false })}
              className="text-pink-600"
            />
            Subscription
          </label>
        </div>
      </div>

      {isEditing ? (
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mb-3 border-gray-300"
          placeholder="Description"
        />
      ) : (
        <p className="text-gray-600 mb-3 min-h-[60px]">{service.description}</p>
      )}

      <div className="flex gap-2">
        <Button
          variant="outline"
          className="flex-1 border-pink-300 text-pink-600 hover:bg-pink-50"
          onClick={() => onRemove(service.id)}
        >
          Remove
        </Button>
        <Button
          variant="outline"
          className="flex-1 border-pink-300 text-pink-600 hover:bg-pink-50"
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
        >
          {isEditing ? 'Save' : 'Edit'}
        </Button>
      </div>
    </Card>
  );
};
