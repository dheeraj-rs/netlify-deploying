"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { getSiteDetails, updateSiteSettings } from "@/lib/netlify";

interface SiteSettingsProps {
  siteId: string;
  token: string;
}

export default function SiteSettings({ siteId, token }: SiteSettingsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState({
    name: "",
    url: "",
    ssl: true,
    https_only: true,
    build_image: "",
    processing_settings: {
      html: {
        pretty_urls: true,
      },
    },
  });

  useEffect(() => {
    if (siteId && token) {
      loadSiteSettings();
    }
  }, [siteId, token]);

  const loadSiteSettings = async () => {
    if (!siteId || !token) {
      return;
    }

    setIsLoading(true);
    try {
      const siteDetails = await getSiteDetails(token, siteId);
      setSettings({
        name: siteDetails.name || "",
        url: siteDetails.url || "",
        ssl: siteDetails.ssl || true,
        https_only: siteDetails.https_only || true,
        build_image: siteDetails.build_image || "",
        processing_settings: siteDetails.processing_settings || {
          html: {
            pretty_urls: true,
          },
        },
      });
    } catch (error) {
      console.error("Failed to load site settings:", error);
      toast.error("Failed to load site settings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!siteId || !token) {
      toast.error("Missing site information. Please deploy first.");
      return;
    }

    setIsSaving(true);
    try {
      await updateSiteSettings(token, siteId, settings);
      toast.success("Site settings updated successfully");
    } catch (error) {
      console.error("Failed to update site settings:", error);
      toast.error("Failed to update site settings");
    } finally {
      setIsSaving(false);
    }
  };

  if (!siteId || !token) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Site Settings</CardTitle>
          <CardDescription>
            You need to deploy your site first to configure settings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <p className="text-muted-foreground">No site settings available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Site Settings</CardTitle>
        <CardDescription>
          Configure your Netlify site settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-6 w-[200px]" />
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <Label htmlFor="site-name">Site Name</Label>
              <Input
                id="site-name"
                value={settings.name}
                onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                placeholder="Site name"
              />
              <p className="text-sm text-muted-foreground">
                This will change the subdomain of your Netlify site
              </p>
            </div>

            <div className="space-y-2">
              <Label>Site URL</Label>
              <div className="h-10 px-3 py-2 border rounded-md bg-muted text-muted-foreground flex items-center">
                {settings.url || "Your site URL will appear here after deployment"}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="ssl-toggle" className="flex flex-col space-y-1">
                  <span>SSL</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Enable SSL for your site
                  </span>
                </Label>
                <Switch
                  id="ssl-toggle"
                  checked={settings.ssl}
                  onCheckedChange={(checked) => setSettings({ ...settings, ssl: checked })}
                />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="https-toggle" className="flex flex-col space-y-1">
                  <span>HTTPS Only</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Redirect all HTTP requests to HTTPS
                  </span>
                </Label>
                <Switch
                  id="https-toggle"
                  checked={settings.https_only}
                  onCheckedChange={(checked) => setSettings({ ...settings, https_only: checked })}
                />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="pretty-urls-toggle" className="flex flex-col space-y-1">
                  <span>Pretty URLs</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Remove trailing .html extensions from URLs
                  </span>
                </Label>
                <Switch
                  id="pretty-urls-toggle"
                  checked={settings.processing_settings?.html?.pretty_urls}
                  onCheckedChange={(checked) => 
                    setSettings({ 
                      ...settings, 
                      processing_settings: {
                        ...settings.processing_settings,
                        html: {
                          ...settings.processing_settings.html,
                          pretty_urls: checked
                        }
                      }
                    })
                  }
                />
              </div>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleSaveSettings}
          disabled={isLoading || isSaving}
          className="ml-auto"
        >
          {isSaving ? "Saving..." : "Save Settings"}
        </Button>
      </CardFooter>
    </Card>
  );
}