"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { Upload, Save, Loader2, ImageIcon, X } from "lucide-react";

export default function BannersPage() {
  const pageOptions = [
    { key: "home", label: "Home" },
    { key: "about", label: "About Us" },
    { key: "services", label: "Services" },
    { key: "portfolio", label: "Portfolio" },
    { key: "blog", label: "Blog" },
    { key: "careers", label: "Careers" },
    { key: "contact", label: "Contact" },
  ];

  const [pageKey, setPageKey] = useState<string>("home");
  const [status, setStatus] = useState<string>("active");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  
  // For home page - multiple images
  const [homeImages, setHomeImages] = useState<string[]>([]);
  const [homeFiles, setHomeFiles] = useState<(File | null)[]>([null, null, null]);
  
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const homeFileInputRefs = [
    useRef<HTMLInputElement | null>(null),
    useRef<HTMLInputElement | null>(null),
    useRef<HTMLInputElement | null>(null),
  ];

  const fetchBanner = async (key: string) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `/api/admin/banners/${encodeURIComponent(key)}`
      );
      if (res.data?.success && res.data.data) {
        const b = res.data.data as {
          image: string;
          images?: string[];
          status?: string;
        };
        setImageUrl(b.image || "");
        setStatus(b.status || "active");
        
        // For home page, load multiple images and ensure we have 3 slots
        if (key === "home" && b.images && b.images.length > 0) {
          const paddedImages = [...b.images];
          while (paddedImages.length < 3) {
            paddedImages.push("");
          }
          setHomeImages(paddedImages.slice(0, 3));
        } else if (key === "home") {
          setHomeImages(["", "", ""]);
        } else {
          setHomeImages([]);
        }
      } else {
        setImageUrl("");
        setHomeImages(key === "home" ? ["", "", ""] : []);
        setStatus("active");
      }
    } catch (e) {
      setImageUrl("");
      setHomeImages(key === "home" ? ["", "", ""] : []);
      setStatus("active");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanner(pageKey);
    // Reset files when changing page
    setFile(null);
    setHomeFiles([null, null, null]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageKey]);

  const onChooseImage = () => {
    fileInputRef.current?.click();
  };

  const onChooseHomeImage = (index: number) => {
    homeFileInputRefs[index].current?.click();
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f || null);
    if (f) {
      setImageUrl(URL.createObjectURL(f));
    }
  };

  const onHomeFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const f = e.target.files?.[0] || null;
    const newFiles = [...homeFiles];
    newFiles[index] = f;
    setHomeFiles(newFiles);

    if (f) {
      const newImages = [...homeImages];
      newImages[index] = URL.createObjectURL(f);
      setHomeImages(newImages);
    }
  };

  const removeHomeImage = (index: number) => {
    const newFiles = [...homeFiles];
    newFiles[index] = null;
    setHomeFiles(newFiles);

    const newImages = [...homeImages];
    newImages[index] = "";
    setHomeImages(newImages);
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("admin_token");
      if (!token) {
        toast({
          title: "Authentication Error",
          description: "Please login again to continue.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      const form = new FormData();
      form.append("pageKey", pageKey);
      form.append("status", status);

      if (pageKey === "home") {
        // For home page, send existing images that should be preserved
        // Filter out blob URLs (newly selected files) and empty strings
        const existingImagesOnly = homeImages.filter(
          (img) => img && !img.startsWith("blob:")
        );
        
        if (existingImagesOnly.length > 0) {
          form.append("existingImages", JSON.stringify(existingImagesOnly));
        }
        
        // Send new files
        homeFiles.forEach((file, index) => {
          if (file) {
            form.append(`image${index + 1}`, file);
          }
        });
      } else {
        // For other pages, single image
        if (imageUrl && !file) {
          form.append("existingImage", imageUrl);
        }
        if (file) {
          form.append("image", file);
        }
      }

      const res = await axios.post(`/api/admin/banners`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data?.success) {
        toast({ title: "Saved", description: "Banner saved successfully." });
        fetchBanner(pageKey);
        setFile(null);
        setHomeFiles([null, null, null]);
      } else {
        toast({
          title: "Error",
          description: res.data?.message || "Failed to save banner",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description:
          err?.response?.data?.message ||
          err?.message ||
          "Failed to save banner",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#014a74]">
            Banner Manager
          </h1>
          <p className="text-gray-600 mt-1">
            Manage hero banners for each page
          </p>
        </div>
      </div>

      <Card className="border-0 shadow-lg">
        <CardContent className="p-6 space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div>
                <Label className="font-semibold">Page</Label>
                <Select value={pageKey} onValueChange={(v) => setPageKey(v)}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select Page" />
                  </SelectTrigger>
                  <SelectContent>
                    {pageOptions.map((p) => (
                      <SelectItem key={p.key} value={p.key}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="font-semibold">Status</Label>
                <Select value={status} onValueChange={(v) => setStatus(v)}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {pageKey !== "home" && (
                <>
                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      onClick={onChooseImage}
                      className="bg-[#f58420] hover:bg-[#d97419] text-white"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Choose Image
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={onFileChange}
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Tip: If you don't select a new image, the existing banner
                    image will be kept.
                  </p>
                </>
              )}

              <Button
                type="button"
                onClick={handleSave}
                disabled={loading}
                className="w-full bg-[#014a74] hover:bg-[#012d47] text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" /> Save Banner
                  </>
                )}
              </Button>
            </div>

            <div className="md:col-span-2">
              <Label className="font-semibold">Preview</Label>

              {pageKey === "home" ? (
                <div className="mt-2 space-y-4">
                  <p className="text-sm text-gray-600">
                    Upload banner image for the home page
                  </p>
                  {[0].map((index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Banner Image</Label>
                        {homeImages[index] && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeHomeImage(index)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                        )}
                      </div>
                      <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-100 border">
                        {homeImages[index] ? (
                          <Image
                            src={homeImages[index]}
                            alt={`Home banner ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                            <ImageIcon className="h-8 w-8 mb-2" />
                            <p className="text-sm">No image selected</p>
                          </div>
                        )}
                      </div>
                      <Button
                        type="button"
                        onClick={() => onChooseHomeImage(index)}
                        variant="outline"
                        size="sm"
                        className="w-full"
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Choose Banner Image
                      </Button>
                      <input
                        ref={homeFileInputRefs[index]}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => onHomeFileChange(e, index)}
                      />
                    </div>
                  ))}
                  
                  {/* 
                    Commented out - Additional image slots not needed
                    
                    {[1, 2].map((index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">Image {index + 1}</Label>
                          {homeImages[index] && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeHomeImage(index)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <X className="h-4 w-4 mr-1" />
                              Remove
                            </Button>
                          )}
                        </div>
                        <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-100 border">
                          {homeImages[index] ? (
                            <Image
                              src={homeImages[index]}
                              alt={`Home banner ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                              <ImageIcon className="h-8 w-8 mb-2" />
                              <p className="text-sm">No image selected</p>
                            </div>
                          )}
                        </div>
                        <Button
                          type="button"
                          onClick={() => onChooseHomeImage(index)}
                          variant="outline"
                          size="sm"
                          className="w-full"
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Choose Image {index + 1}
                        </Button>
                        <input
                          ref={homeFileInputRefs[index]}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => onHomeFileChange(e, index)}
                        />
                      </div>
                    ))}
                  */}
                </div>
              ) : (
                <div className="mt-2 relative w-full h-64 rounded-lg overflow-hidden bg-gray-100 border">
                  {imageUrl ? (
                    <>
                      <Image
                        src={imageUrl}
                        alt={pageKey}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30" />
                      {pageKey ? (
                        <div className="absolute bottom-4 left-4 right-4">
                          <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm mb-2">
                            {
                              pageOptions.find((p) => p.key === pageKey)
                                ?.label
                            }
                          </Badge>
                        </div>
                      ) : null}
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                      <ImageIcon className="h-8 w-8 mb-2" />
                      No image selected
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
