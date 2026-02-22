"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase, Property } from "@/lib/supabase";
import { getDistrictsByLanguage } from "../../../constant/district";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import Link from "next/link";

export default function EditAdPage() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const [step, setStep] = useState(1);
  const districts = getDistrictsByLanguage(i18n.language);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [property, setProperty] = useState<Property | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    listing_type: "",
    location: "",
    city: "",
    district: "",
    bedrooms: "",
    bathrooms: "",
    area_sqft: "",
    contact_number: "",
    map_link: "",
    whatsapp_number: "",
  });

  useEffect(() => {
    if (params.id) {
      fetchProperty(params.id as string);
    }
  }, [params.id]);

  async function fetchProperty(id: string) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push(`/login?redirect=/edit-ad/${id}`);
        return;
      }

      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error || !data) {
        throw new Error("Property not found");
      }

      // Check if the logged-in user is the owner
      if ((data as any).user_id !== user.id) {
        router.push("/properties");
        return;
      }

      setProperty(data as any);
      setFormData({
        title: (data as any).title || "",
        description: (data as any).description || "",
        price: (data as any).price?.toString() || "",
        category: (data as any).category || "",
        listing_type: (data as any).listing_type || "",
        location: (data as any).location || "",
        city: (data as any).city || "",
        district: (data as any).district || "",
        bedrooms: (data as any).bedrooms?.toString() || "",
        bathrooms: (data as any).bathrooms?.toString() || "",
        area_sqft: (data as any).area_sqft?.toString() || "",
        contact_number: (data as any).contact_number || "",
        map_link: (data as any).map_link || "",
        whatsapp_number: (data as any).whatsapp_number || "",
      });
    } catch (error) {
      console.error("Error fetching property:", error);
      alert("Failed to load property. Please try again.");
      router.push("/properties");
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await supabase
        .from("properties")
        .update({
          title: formData.title,
          description: formData.description,
          price: parseFloat(formData.price),
          category: formData.category,
          listing_type: formData.listing_type,
          location: formData.location,
          city: formData.city,
          district: formData.district,
          bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : 0,
          bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : 0,
          area_sqft: parseFloat(formData.area_sqft),
          contact_number: formData.contact_number,
          whatsapp_number: formData.whatsapp_number || null,
          map_link: formData.map_link || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", params.id as string);

      if (error) throw error;

      toast.success("Property updated successfully!", { duration: 3000 });
      router.push(`/properties/${params.id}`);
    } catch (error) {
      console.error("Error updating property:", error);
      toast.error("Failed to update property. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Property not found</h2>
          <Link href="/properties">
            <Button>Back to Properties</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 md:py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-5">
          <h1 className="text-lg md:text-2xl font-bold text-blue-900 text-center sm:text-start">
            Edit Your Property
          </h1>
          <p className="text-gray-500 text-xs sm:text-base text-center sm:text-start">
            Update the details of your property listing
          </p>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between px-8 sm:px-0">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-6 h-6 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold ${
                    s <= step
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div
                    className={`h-1 w-20 sm:w-24 md:w-48 mx-2 ${
                      s < step ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm sm:text-base px-4 sm:px-0">
            <span className={step >= 1 ? "text-blue-600 font-semibold" : ""}>
              Basic Info
            </span>
            <span className={step >= 2 ? "text-blue-600 font-semibold" : ""}>
              Details
            </span>
            <span className={step >= 3 ? "text-blue-600 font-semibold" : ""}>
              Contact
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl -mb-3 sm:mb-0 text-center sm:text-left text-blue-950">
                {step === 1 && "Basic Information"}
                {step === 2 && "Property Details"}
                {step === 3 && "Contact Information"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {step === 1 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="title">Property Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Beautiful House in Colombo"
                      value={formData.title}
                      onChange={(e) => updateFormData("title", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Property Type *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        updateFormData("category", value)
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select property type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="house">House</SelectItem>
                        <SelectItem value="land">Land</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                        <SelectItem value="room">Room</SelectItem>
                        <SelectItem value="annex">Annex</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="listing_type">Listing Type *</Label>
                    <Select
                      value={formData.listing_type}
                      onValueChange={(value) =>
                        updateFormData("listing_type", value)
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select listing type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sale">For Sale</SelectItem>
                        <SelectItem value="rent">For Rent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Price (LKR) *</Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="e.g., 15000000"
                      value={formData.price}
                      onChange={(e) => updateFormData("price", e.target.value)}
                      required
                    />
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your property..."
                      rows={6}
                      value={formData.description}
                      onChange={(e) =>
                        updateFormData("description", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bedrooms">Bedrooms</Label>
                      <Input
                        id="bedrooms"
                        type="number"
                        placeholder="e.g., 3"
                        value={formData.bedrooms}
                        onChange={(e) =>
                          updateFormData("bedrooms", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bathrooms">Bathrooms</Label>
                      <Input
                        id="bathrooms"
                        type="number"
                        placeholder="e.g., 2"
                        value={formData.bathrooms}
                        onChange={(e) =>
                          updateFormData("bathrooms", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="area_sqft">Area (sqft)</Label>
                    <Input
                      id="area_sqft"
                      type="number"
                      step="0.01"
                      placeholder="e.g., 2500"
                      value={formData.area_sqft}
                      onChange={(e) =>
                        updateFormData("area_sqft", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location Details *</Label>
                    <Input
                      id="location"
                      placeholder="e.g., Main Street, Kandy"
                      value={formData.location}
                      onChange={(e) =>
                        updateFormData("location", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      placeholder="e.g., Kandy"
                      value={formData.city}
                      onChange={(e) => updateFormData("city", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="district">District *</Label>
                    <Select
                      value={formData.district}
                      onValueChange={(value) =>
                        updateFormData("district", value)
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a district" />
                      </SelectTrigger>
                      <SelectContent>
                        {districts.map((dist) => (
                          <SelectItem key={dist} value={dist}>
                            {dist}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="contact_number">Contact Number *</Label>
                    <Input
                      id="contact_number"
                      type="tel"
                      placeholder="e.g., +94712345678"
                      value={formData.contact_number}
                      onChange={(e) =>
                        updateFormData("contact_number", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="whatsapp_number">WhatsApp Number</Label>
                    <Input
                      id="whatsapp_number"
                      type="tel"
                      placeholder="e.g., +94712345678 (optional)"
                      value={formData.whatsapp_number}
                      onChange={(e) =>
                        updateFormData("whatsapp_number", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="map_link">Google Maps Link</Label>
                    <Input
                      id="map_link"
                      type="url"
                      placeholder="e.g., https://maps.google.com/... (optional)"
                      value={formData.map_link}
                      onChange={(e) =>
                        updateFormData("map_link", e.target.value)
                      }
                    />
                  </div>
                </>
              )}

              <div className="flex justify-between pt-6 border-t">
                {step > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    className="flex items-center"
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                )}
                {step < 3 && (
                  <Button type="button" onClick={nextStep} className=" ml-auto">
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
                {step === 3 && (
                  <Button
                    type="submit"
                    disabled={saving}
                    className="w-full sm:w-auto ml-auto"
                  >
                    {saving ? "Saving..." : "Update Property"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
