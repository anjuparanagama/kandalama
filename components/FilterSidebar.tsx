'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState, useMemo, useRef, useEffect } from 'react';
import { getDistrictsByLanguage } from '@/constant/district';
import { propertyTypes } from '@/constant/property-Types';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';

// Searchable District Select component (must be top-level, not inside FilterSidebar)
function DistrictSelect() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const districts = useMemo(() => getDistrictsByLanguage(), []);
  const filtered = search.trim()
    ? districts.filter(d => d.toLowerCase().includes(search.trim().toLowerCase()))
    : districts;

  return (
    <Select open={open} onOpenChange={setOpen}>
      <SelectTrigger>
        <SelectValue placeholder="All Districts" />
      </SelectTrigger>
      <SelectContent>
        <div className="px-2 py-1">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search districts..."
            className="w-full px-2 py-1 border rounded text-sm mb-2"
            autoFocus
            onClick={e => e.stopPropagation()}
            onKeyDown={e => e.stopPropagation()}
          />
        </div>
        <SelectItem value="all">All Districts</SelectItem>
        {filtered.map((district) => (
          <SelectItem key={district.toLowerCase()} value={district.toLowerCase()}>{district}</SelectItem>
        ))}
        {filtered.length === 0 && (
          <div className="px-2 py-2 text-sm text-gray-500">No districts found</div>
        )}
      </SelectContent>
    </Select>
  );
}

export default function FilterSidebar({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
  const { t } = useTranslation();
  const [priceRange, setPriceRange] = useState([0, 100000000]);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close sidebar
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        onClose?.();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  return (
    <aside ref={sidebarRef}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>Filters</CardTitle>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-md transition-colors lg:hidden"
              aria-label="Close filters"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Listing Type</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="sale">For Sale</SelectItem>
                <SelectItem value="rent">For Rent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Property Type</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="All Properties" />
              </SelectTrigger>
              <SelectContent>
                {propertyTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Location</Label>
            <Input placeholder="Enter city or district" />
          </div>


          <div className="space-y-2">
            <Label>District</Label>
            <DistrictSelect />
          </div>


          <div className="space-y-4">
            <Label>
              Price Range: LKR {priceRange[0].toLocaleString()} - LKR{' '}
              {priceRange[1].toLocaleString()}
            </Label>
            <Slider
              min={0}
              max={100000000}
              step={1000000}
              value={priceRange}
              onValueChange={setPriceRange}
              className="w-full"
              minStepsBetweenThumbs={1}
            />
          </div>

          <div className="space-y-2">
            <Label>Bedrooms</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="1">1+</SelectItem>
                <SelectItem value="2">2+</SelectItem>
                <SelectItem value="3">3+</SelectItem>
                <SelectItem value="4">4+</SelectItem>
                <SelectItem value="5">5+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Bathrooms</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="1">1+</SelectItem>
                <SelectItem value="2">2+</SelectItem>
                <SelectItem value="3">3+</SelectItem>
                <SelectItem value="4">4+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3 pt-4">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              Apply Filters
            </Button>
            <Button variant="outline" className="w-full">
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>
    </aside>
  );
}
