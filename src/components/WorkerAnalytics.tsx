import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Star } from 'lucide-react';

const monthlyData2024 = [
  { month: 'Mar', earnings: 18500 },
  { month: 'Apr', earnings: 12800 },
  { month: 'May', earnings: 28200 },
  { month: 'Jun', earnings: 24100 },
  { month: 'Jul', earnings: 15300 },
  { month: 'Aug', earnings: 22600 },
  { month: 'Sep', earnings: 34100 },
];

const topServices = [
  { name: 'Blow Job', rating: 4.8, revenue: 9302, services: 3232 },
  { name: 'Sex', rating: 4.8, revenue: 829, services: 434 },
  { name: 'Exclusive Content', rating: 4.8, revenue: 728, services: 893 },
];

const sampleReviews = [
  { name: 'Tom', rating: 5, comment: 'Great!' },
  { name: 'Tom', rating: 5, comment: 'Great!' },
];

export default function WorkerAnalytics() {
  const [selectedYear, setSelectedYear] = useState('2024');
  const [showWeekly, setShowWeekly] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  const years = ['2019', '2020', '2021', '2022', '2023', '2024'];

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Year Selector */}
        <div className="flex gap-2 mb-8 justify-end">
          {years.map((year) => (
            <Button
              key={year}
              onClick={() => setSelectedYear(year)}
              variant={selectedYear === year ? 'default' : 'outline'}
              className={selectedYear === year 
                ? 'bg-gradient-to-r from-pink-400 to-purple-400 text-white border-0 rounded-full px-6' 
                : 'border-pink-300 text-pink-600 hover:bg-pink-50 rounded-full px-6'}
            >
              {year}
            </Button>
          ))}
        </div>

        {/* Earnings Chart */}
        <Card className="bg-white border-gray-200 p-8 mb-6">
          <div className="text-right mb-2">
            <span className="text-2xl font-bold text-gray-800">${monthlyData2024[6].earnings.toLocaleString()}</span>
          </div>
          <ChartContainer config={{ earnings: { label: 'Earnings', color: '#c084fc' } }} className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData2024}>
                <XAxis dataKey="month" stroke="#9ca3af" />
                <Bar dataKey="earnings" fill="#c084fc" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
          <div className="text-center mt-4">
            <Button 
              onClick={() => setShowWeekly(!showWeekly)}
              className="bg-pink-100 text-pink-600 hover:bg-pink-200 rounded-full px-8"
            >
              View weekly breakdown
            </Button>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          <div>
            <p className="text-gray-600 text-sm mb-1">Customers</p>
            <p className="text-2xl font-bold text-gray-800">1902</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm mb-1">Recurring</p>
            <p className="text-2xl font-bold text-gray-800">282</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm mb-1">Rating</p>
            <p className="text-2xl font-bold text-gray-800">4.8 <span className="text-sm text-gray-500 font-normal">(829 ratings)</span></p>
          </div>
        </div>

        {/* Reviews */}
        <Card className="bg-gray-50 border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Reviews (12)</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            {sampleReviews.map((review, idx) => (
              <Card key={idx} className="bg-white p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-gray-800">{review.name}</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-pink-500 text-pink-500" />
                    <span className="text-sm font-medium text-gray-800">{review.rating}</span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">{review.comment}</p>
              </Card>
            ))}
          </div>
          <div className="text-center">
            <Button 
              onClick={() => setShowAllReviews(!showAllReviews)}
              className="bg-pink-100 text-pink-600 hover:bg-pink-200 rounded-full px-8"
            >
              View all reviews
            </Button>
          </div>
        </Card>

        {/* Top Services */}
        <Card className="bg-white border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Services</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-gray-600 font-medium"></th>
                  <th className="text-left py-3 px-4 text-gray-600 font-medium">Rating</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-medium">Revenue</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-medium">Services</th>
                </tr>
              </thead>
              <tbody>
                {topServices.map((service, idx) => (
                  <tr key={idx} className="border-b border-gray-100">
                    <td className="py-3 px-4 text-gray-800">{idx + 1}. {service.name}</td>
                    <td className="py-3 px-4 text-gray-800">{service.rating}</td>
                    <td className="py-3 px-4 text-gray-800">${service.revenue}</td>
                    <td className="py-3 px-4 text-gray-800">{service.services}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
