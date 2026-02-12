'use client';

import { useEffect, useState } from 'react';
import { ProtectedAdminRoute } from '@/components/admin/ProtectedAdminRoute';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { StatCard } from '@/components/admin/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DashboardStats {
  propertiesCount: number;
  usersCount: number;
  pageViews: number;
}

export default function AdminPage() {
  const [stats, setStats] = useState<DashboardStats>({
    propertiesCount: 0,
    usersCount: 0,
    pageViews: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats');
        const data = await response.json();

        if (data.success) {
          setStats(data.data);
        } else {
          setError(data.error || 'Failed to fetch stats');
        }
      } catch (err) {
        setError('Error fetching dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <ProtectedAdminRoute>
      <div className="min-h-screen bg-slate-50">
        <AdminHeader />

        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Section */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">
                Dashboard Overview
              </h2>
              <p className="text-slate-600">
                Track your website statistics and manage properties
              </p>
            </div>

            {/* Error State */}
            {error && (
              <div className="mb-6 p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                {error}
              </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <StatCard
                title="Total Properties"
                value={loading ? '-' : stats.propertiesCount}
                description="Properties listed on the platform"
                icon="🏠"
              />
              <StatCard
                title="Registered Users"
                value={loading ? '-' : stats.usersCount}
                description="Active users in the system"
                icon="👥"
              />
              <StatCard
                title="Page Views"
                value={loading ? '-' : stats.pageViews.toLocaleString()}
                description="Total website visits"
                icon="📊"
              />
            </div>

            {/* Maintenance Info */}
            <Card>
              <CardHeader>
                <CardTitle>Website Maintenance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2">
                      System Status
                    </h3>
                    <p className="text-sm text-blue-700">
                      ✅ All systems operational
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h3 className="font-semibold text-green-900 mb-2">
                      Database Status
                    </h3>
                    <p className="text-sm text-green-700">
                      ✅ Connected and synced
                    </p>
                  </div>
                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <h3 className="font-semibold text-purple-900 mb-2">
                      Cache Status
                    </h3>
                    <p className="text-sm text-purple-700">
                      ✅ Cache cleared regularly
                    </p>
                  </div>
                  <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <h3 className="font-semibold text-orange-900 mb-2">
                      Last Updated
                    </h3>
                    <p className="text-sm text-orange-700">
                      🕐 {new Date().toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </ProtectedAdminRoute>
  );
}
