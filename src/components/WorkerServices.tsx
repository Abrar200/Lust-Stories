import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Plus, ThumbsUp } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface Category {
  id: string;
  name: string;
  discount_percentage: number;
}

interface Service {
  id: string;
  category_id: string;
  name: string;
  description: string;
  price: number;
  is_public: boolean;
  popularity_percentage: number;
  booking_count: number;
}

export const WorkerServices = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [discountValue, setDiscountValue] = useState('');
  const [newService, setNewService] = useState({
    name: '',
    price: '',
    description: '',
    is_public: true
  });
  const { toast } = useToast();

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (activeCategory) {
      loadServices(activeCategory);
    }
  }, [activeCategory]);

  const loadCategories = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('service_categories')
      .select('*')
      .eq('worker_id', user.id)
      .order('created_at');

    if (data && data.length > 0) {
      setCategories(data);
      setActiveCategory(data[0].id);
    }
  };

  const loadServices = async (categoryId: string) => {
    const { data } = await supabase
      .from('worker_services')
      .select('*')
      .eq('category_id', categoryId)
      .order('created_at');

    if (data) setServices(data);
  };

  const addCategory = async () => {
    if (!newCategoryName.trim()) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('service_categories')
      .insert({ worker_id: user.id, name: newCategoryName })
      .select()
      .single();

    if (data) {
      setCategories([...categories, data]);
      setNewCategoryName('');
      setShowNewCategory(false);
      toast({ title: 'Category created' });
    }
  };

  const applyDiscount = async () => {
    if (!activeCategory || !discountValue) return;

    await supabase
      .from('service_categories')
      .update({ discount_percentage: parseInt(discountValue) })
      .eq('id', activeCategory);

    setCategories(categories.map(c => 
      c.id === activeCategory ? { ...c, discount_percentage: parseInt(discountValue) } : c
    ));
    toast({ title: 'Discount applied' });
  };

  const addService = async () => {
    if (!newService.name || !newService.price || !activeCategory) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from('worker_services').insert({
      worker_id: user.id, category_id: activeCategory, name: newService.name,
      price: parseFloat(newService.price), description: newService.description,
      is_public: newService.is_public
    }).select().single();
    if (data) {
      setServices([...services, data]);
      setNewService({ name: '', price: '', description: '', is_public: true });
      toast({ title: 'Service added' });
    }
  };

  const updateService = async (id: string, updates: any) => {
    await supabase.from('worker_services').update(updates).eq('id', id);
    setServices(services.map(s => s.id === id ? { ...s, ...updates } : s));
    toast({ title: 'Service updated' });
  };

  const removeService = async (id: string) => {
    await supabase.from('worker_services').delete().eq('id', id);
    setServices(services.filter(s => s.id !== id));
    toast({ title: 'Service removed' });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Services</h1>
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map(cat => (
          <Button key={cat.id} variant={activeCategory === cat.id ? 'default' : 'outline'}
            className={activeCategory === cat.id ? 'bg-pink-600 hover:bg-pink-700' : 'border-pink-300 text-pink-600'}
            onClick={() => setActiveCategory(cat.id)}>{cat.name}</Button>
        ))}
        {showNewCategory ? (
          <div className="flex gap-2">
            <Input value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Category name" className="w-40" />
            <Button onClick={addCategory} className="bg-pink-600">Add</Button>
          </div>
        ) : (
          <Button variant="outline" className="border-pink-300 text-pink-600"
            onClick={() => setShowNewCategory(true)}>
            <Plus className="w-4 h-4 mr-1" /> New Category
          </Button>
        )}
      </div>

      {/* Discount Section */}
      <Card className="p-4 bg-pink-50 border-pink-200 mb-6">
        <div className="flex items-center gap-3">
          <span className="text-gray-700 font-medium">Discount Entire Category</span>
          <Input value={discountValue} onChange={(e) => setDiscountValue(e.target.value)}
            placeholder="%" className="w-20" type="number" />
          <Button onClick={applyDiscount} className="bg-pink-600 hover:bg-pink-700">Apply</Button>
        </div>
      </Card>

      {/* Add Service Form */}
      <Card className="p-4 border-2 border-pink-200 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Plus className="w-5 h-5 text-pink-600" />
          <h2 className="text-lg font-semibold text-gray-800">Add Service</h2>
        </div>
        <div className="grid gap-3">
          <Input value={newService.name} onChange={(e) => setNewService({...newService, name: e.target.value})}
            placeholder="Name" className="border-gray-300" />
          <Input value={newService.price} onChange={(e) => setNewService({...newService, price: e.target.value})}
            placeholder="$0.00" type="number" className="border-gray-300" />
          <Textarea value={newService.description}
            onChange={(e) => setNewService({...newService, description: e.target.value})}
            placeholder="Description" className="border-gray-300" />
          <div className="flex items-center justify-between">
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input type="radio" checked={newService.is_public}
                  onChange={() => setNewService({...newService, is_public: true})}
                  className="text-pink-600" />
                <span className="text-sm">Public</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" checked={!newService.is_public}
                  onChange={() => setNewService({...newService, is_public: false})}
                  className="text-pink-600" />
                <span className="text-sm">Subscription</span>
              </label>
            </div>
            <Button onClick={addService} className="bg-pink-600 hover:bg-pink-700">Post</Button>
          </div>
        </div>
      </Card>

      {/* Services List */}
      <div className="space-y-4">
        {services.map(service => (
          <Card key={service.id} className="p-4 border-2 border-pink-200 bg-white">
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
                  <input type="radio" checked={service.is_public}
                    onChange={() => updateService(service.id, { is_public: true })} />
                  Public
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="radio" checked={!service.is_public}
                    onChange={() => updateService(service.id, { is_public: false })} />
                  Subscription
                </label>
              </div>
            </div>
            <p className="text-gray-600 mb-3">{service.description}</p>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 border-pink-300 text-pink-600 hover:bg-pink-50"
                onClick={() => removeService(service.id)}>Remove</Button>
              <Button variant="outline" className="flex-1 border-pink-300 text-pink-600 hover:bg-pink-50">
                Discount
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
