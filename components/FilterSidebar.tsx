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
import { useState } from 'react';

export default function FilterSidebar() {
  const [priceRange, setPriceRange] = useState([0, 100000000]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
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
              <SelectItem value="all">All Properties</SelectItem>
              <SelectItem value="house">Houses</SelectItem>
              <SelectItem value="land">Land</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
              <SelectItem value="room">Rooms</SelectItem>
              <SelectItem value="annex">Annex</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Location</Label>
          <Input placeholder="Enter city or district" />
        </div>

        <div className="space-y-2">
          <Label>District</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="All Districts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Districts</SelectItem>
              <SelectItem value="colombo">Colombo</SelectItem>
              <SelectItem value="gampaha">Gampaha</SelectItem>
              <SelectItem value="kandy">Kandy</SelectItem>
              <SelectItem value="galle">Galle</SelectItem>
              <SelectItem value="matara">Matara</SelectItem>
              <SelectItem value="jaffna">Jaffna</SelectItem>
              <SelectItem value="kurunegala">Kurunegala</SelectItem>
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
  );
}
