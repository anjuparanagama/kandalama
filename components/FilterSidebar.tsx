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
import { useRouter, useSearchParams } from 'next/navigation';
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  
  const [listingType, setListingType] = useState(searchParams.get('listing_type') || 'all');
  const [propertyType, setPropertyType] = useState(searchParams.get('category') || 'all');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [district, setDistrict] = useState(searchParams.get('district') || 'all');
  const [priceRange, setPriceRange] = useState([
    parseInt(searchParams.get('minPrice') || '0'),
    parseInt(searchParams.get('maxPrice') || '100000000')
  ]);
  const [bedrooms, setBedrooms] = useState(searchParams.get('bedrooms') || 'any');
  const [bathrooms, setBathrooms] = useState(searchParams.get('bathrooms') || 'any');
  
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

  const handleApplyFilters = () => {
    const params = new URLSearchParams();
    
    if (listingType !== 'all') params.set('listing_type', listingType);
    if (propertyType !== 'all') params.set('category', propertyType);
    if (location.trim()) params.set('location', location.trim());
    if (district !== 'all') params.set('district', district);
    if (priceRange[0] > 0) params.set('minPrice', priceRange[0].toString());
    if (priceRange[1] < 100000000) params.set('maxPrice', priceRange[1].toString());
    if (bedrooms !== 'any') params.set('bedrooms', bedrooms);
    if (bathrooms !== 'any') params.set('bathrooms', bathrooms);

    router.push(`/properties?${params.toString()}`);
    onClose?.();
  };

  const handleClearFilters = () => {
    setListingType('all');
    setPropertyType('all');
    setLocation('');
    setDistrict('all');
    setPriceRange([0, 100000000]);
    setBedrooms('any');
    setBathrooms('any');
    router.push('/properties');
    onClose?.();
  };

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
            <Select value={listingType} onValueChange={setListingType}>
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
            <Select value={propertyType} onValueChange={setPropertyType}>
              <SelectTrigger>
                <SelectValue placeholder="All Properties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Properties</SelectItem>
                {propertyTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Location</Label>
            <Input 
              placeholder="Enter city or district" 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>District</Label>
            <Select value={district} onValueChange={setDistrict}>
              <SelectTrigger>
                <SelectValue placeholder="All Districts" />
              </SelectTrigger>
              <SelectContent>
                {/* District select logic here */}
                <SelectItem value="all">All Districts</SelectItem>
                {getDistrictsByLanguage().map((dist) => (
                  <SelectItem key={dist} value={dist}>
                    {dist}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            <Select value={bedrooms} onValueChange={setBedrooms}>
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
            <Select value={bathrooms} onValueChange={setBathrooms}>
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
            <Button onClick={handleApplyFilters} className="w-full bg-blue-600 hover:bg-blue-700">
              Apply Filters
            </Button>
            <Button onClick={handleClearFilters} variant="outline" className="w-full">
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>
    </aside>
  );
}
