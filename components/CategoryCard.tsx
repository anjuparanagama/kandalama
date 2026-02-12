'use client';

import Link from 'next/link';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

interface CategoryCardProps {
  title: string;
  icon: LucideIcon;
  count?: number;
  href: string;
}

export default function CategoryCard({
  title,
  icon: Icon,
  count,
  href,
}: CategoryCardProps) {
  const { t } = useTranslation();
  const formatNumber = (n?: number) =>
    typeof n === 'number' ? new Intl.NumberFormat().format(n) : '';
  return (
    <Link href={href}>
      <Card className="w-full hover:shadow-lg transition-all hover:border-blue-600 group cursor-pointer">
        <CardContent className="flex flex-col sm:flex-row items-center p-4 sm:p-3 space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="bg-blue-50 p-3 sm:p-3 rounded-full sm:rounded-md group-hover:bg-blue-600 transition flex items-center justify-center">
            <Icon className="h-8 w-8 sm:h-10 sm:w-10 text-blue-600 group-hover:text-white transition" />
          </div>
          <div className="flex-1 min-w-0">
            <h3>{t('properties.title')}</h3>
            {count !== undefined && (
              <p className="text-[10px] text-gray-400 text-center sm:text-left">{formatNumber(count)} ads</p>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
