import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, AlertTriangle, Download } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function SecurityLogs() {
  const logs = [
    { time: '2025-11-02 07:15', user: 'admin@luststory.com', action: 'Login Success', ip: '192.168.1.1', severity: 'info' },
    { time: '2025-11-02 06:45', user: 'sarah.j@email.com', action: 'Failed Login Attempt', ip: '203.45.67.89', severity: 'warning' },
    { time: '2025-11-02 06:30', user: 'mike.c@email.com', action: 'Password Changed', ip: '192.168.1.50', severity: 'info' },
    { time: '2025-11-02 05:20', user: 'suspicious@email.com', action: 'Multiple Failed Logins', ip: '45.67.89.123', severity: 'critical' },
    { time: '2025-11-02 04:15', user: 'emma.d@email.com', action: 'Account Verified', ip: '192.168.1.75', severity: 'info' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-zinc-900 border-pink-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-pink-300">Security Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pink-100">1,247</div>
            <p className="text-xs text-pink-400">Last 24 hours</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-pink-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-pink-300">Failed Logins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-400">23</div>
            <p className="text-xs text-pink-400">Requires attention</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-pink-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-pink-300">Blocked IPs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pink-500">8</div>
            <p className="text-xs text-pink-400">Active blocks</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-zinc-900 border-pink-500/30">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-pink-300">Activity Logs</CardTitle>
            <Button size="sm" variant="outline" className="border-pink-500/50 text-pink-300 hover:bg-pink-500/20">
              <Download className="w-4 h-4 mr-2" />Export Logs
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-pink-500/30">
                <TableHead className="text-pink-300">Time</TableHead>
                <TableHead className="text-pink-300">User</TableHead>
                <TableHead className="text-pink-300">Action</TableHead>
                <TableHead className="text-pink-300">IP Address</TableHead>
                <TableHead className="text-pink-300">Severity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log, idx) => (
                <TableRow key={idx} className="border-pink-500/20">
                  <TableCell className="font-mono text-xs text-pink-200">{log.time}</TableCell>
                  <TableCell className="text-pink-100">{log.user}</TableCell>
                  <TableCell className="text-pink-100">{log.action}</TableCell>
                  <TableCell className="font-mono text-xs text-pink-200">{log.ip}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs flex items-center gap-1 w-fit ${
                      log.severity === 'critical' ? 'bg-pink-600/20 text-pink-300' :
                      log.severity === 'warning' ? 'bg-purple-500/20 text-purple-300' :
                      'bg-pink-500/20 text-pink-300'
                    }`}>
                      {log.severity === 'critical' && <AlertTriangle className="w-3 h-3" />}
                      {log.severity === 'warning' && <Shield className="w-3 h-3" />}
                      {log.severity}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
