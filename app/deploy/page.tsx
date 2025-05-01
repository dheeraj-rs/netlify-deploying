"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { 
  CloudUploadIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  RefreshCwIcon,
  LinkIcon,
  CopyIcon,
  AlertCircleIcon,
  FolderIcon
} from "lucide-react";
import DeploymentHistory from "@/components/deploy/deployment-history";
import SiteSettings from "@/components/deploy/site-settings";
import { deployToNetlify, getDeploymentStatus } from "@/lib/netlify";

export default function DeployPage() {
  const [activeTab, setActiveTab] = useState("deploy");
  const [token, setToken] = useState("");
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentProgress, setDeploymentProgress] = useState(0);
  const [deploymentStatus, setDeploymentStatus] = useState<"idle" | "building" | "success" | "error">("idle");
  const [deploymentUrl, setDeploymentUrl] = useState("");
  const [siteId, setSiteId] = useState("");
  const [deployId, setDeployId] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleDeploy = async () => {
    if (!token) {
      toast.error("Please enter your Netlify personal access token");
      return;
    }
    
    try {
      setIsDeploying(true);
      setDeploymentStatus("building");
      setDeploymentProgress(10);
      
      // Get selected files
      const files = fileInputRef.current?.files;
      
      // Start deployment process
      const result = await deployToNetlify(token, files);
      
      // Update with deployment info
      setSiteId(result.siteId);
      setDeployId(result.deployId);
      
      // Poll for deployment status
      let status;
      const statusInterval = setInterval(async () => {
        setDeploymentProgress((prev) => Math.min(prev + 5, 90));
        
        status = await getDeploymentStatus(token, result.deployId);
        if (status.state === "ready") {
          clearInterval(statusInterval);
          setDeploymentStatus("success");
          setDeploymentProgress(100);
          setDeploymentUrl(status.deploy_url);
          toast.success("Deployment successful!");
        } else if (status.state === "error") {
          clearInterval(statusInterval);
          setDeploymentStatus("error");
          toast.error("Deployment failed. Please check logs.");
        }
      }, 3000);
      
    } catch (error) {
      console.error("Deployment error:", error);
      setDeploymentStatus("error");
      toast.error("Deployment failed. Please check your token and try again.");
    } finally {
      setIsDeploying(false);
    }
  };
  
  const copyUrl = () => {
    navigator.clipboard.writeText(deploymentUrl);
    toast.success("URL copied to clipboard!");
  };
  
  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-8">Deploy to Netlify</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Tabs defaultValue="deploy" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="deploy">Deploy</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="deploy">
              <Card>
                <CardHeader>
                  <CardTitle>Deploy Your Site</CardTitle>
                  <CardDescription>
                    Upload and deploy your website files directly to Netlify.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="token">Netlify Personal Access Token</Label>
                      <Input
                        id="token"
                        type="password"
                        placeholder="Enter your Netlify token"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                      />
                      <p className="text-sm text-muted-foreground">
                        You can create a token in your{" "}
                        <a 
                          href="https://app.netlify.com/user/applications#personal-access-tokens" 
                          target="_blank" 
                          rel="noreferrer"
                          className="underline text-primary"
                        >
                          Netlify account settings
                        </a>
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="files">Website Files</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="files"
                          type="file"
                          ref={fileInputRef}
                          webkitdirectory="true"
                          multiple
                          className="hidden"
                          onChange={(e) => {
                            const files = e.target.files;
                            if (files && files.length > 0) {
                              toast.success(`Selected ${files.length} files`);
                            }
                          }}
                        />
                        <Button
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full"
                        >
                          <FolderIcon className="mr-2 h-4 w-4" />
                          Choose Website Folder
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Select the folder containing your website files
                      </p>
                    </div>
                    
                    {deploymentStatus !== "idle" && (
                      <div className="space-y-4 py-2">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label>Deployment Progress</Label>
                            <span className="text-sm text-muted-foreground">{deploymentProgress}%</span>
                          </div>
                          <Progress value={deploymentProgress} className="h-2" />
                        </div>
                        
                        <div className="rounded-md border p-4">
                          <div className="flex items-center space-x-2">
                            {deploymentStatus === "building" && (
                              <ClockIcon className="h-5 w-5 text-yellow-500 animate-pulse" />
                            )}
                            {deploymentStatus === "success" && (
                              <CheckCircleIcon className="h-5 w-5 text-green-500" />
                            )}
                            {deploymentStatus === "error" && (
                              <XCircleIcon className="h-5 w-5 text-red-500" />
                            )}
                            
                            <div className="font-medium">
                              {deploymentStatus === "building" && "Building and deploying..."}
                              {deploymentStatus === "success" && "Deployment successful!"}
                              {deploymentStatus === "error" && "Deployment failed"}
                            </div>
                          </div>
                        </div>
                        
                        {deploymentStatus === "success" && deploymentUrl && (
                          <Alert>
                            <LinkIcon className="h-4 w-4" />
                            <AlertTitle>Deployment URL</AlertTitle>
                            <AlertDescription className="flex items-center justify-between">
                              <a 
                                href={deploymentUrl} 
                                target="_blank" 
                                rel="noreferrer"
                                className="text-primary underline"
                              >
                                {deploymentUrl}
                              </a>
                              <Button variant="outline" size="icon" onClick={copyUrl}>
                                <CopyIcon className="h-4 w-4" />
                              </Button>
                            </AlertDescription>
                          </Alert>
                        )}
                        
                        {deploymentStatus === "error" && (
                          <Alert variant="destructive">
                            <AlertCircleIcon className="h-4 w-4" />
                            <AlertTitle>Deployment Error</AlertTitle>
                            <AlertDescription>
                              There was an error deploying your site. Please check your token and try again.
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setDeploymentStatus("idle");
                      setDeploymentProgress(0);
                      setDeploymentUrl("");
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                    }}
                    disabled={isDeploying}
                  >
                    Reset
                  </Button>
                  <Button 
                    onClick={handleDeploy} 
                    disabled={isDeploying || !token}
                    className="flex items-center gap-2"
                  >
                    {isDeploying ? (
                      <>
                        <RefreshCwIcon className="h-4 w-4 animate-spin" />
                        Deploying...
                      </>
                    ) : (
                      <>
                        <CloudUploadIcon className="h-4 w-4" />
                        Deploy to Netlify
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="history">
              <DeploymentHistory siteId={siteId} token={token} />
            </TabsContent>
            
            <TabsContent value="settings">
              <SiteSettings siteId={siteId} token={token} />
            </TabsContent>
          </Tabs>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Deployment Guide</CardTitle>
              <CardDescription>Follow these steps to deploy your site</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <div className="bg-primary text-primary-foreground rounded-full h-6 w-6 flex items-center justify-center text-sm shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="font-medium">Create a Netlify token</h3>
                    <p className="text-sm text-muted-foreground">
                      Generate a personal access token from your Netlify account settings.
                    </p>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <div className="bg-primary text-primary-foreground rounded-full h-6 w-6 flex items-center justify-center text-sm shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="font-medium">Select your website folder</h3>
                    <p className="text-sm text-muted-foreground">
                      Choose the folder containing your website files to deploy.
                    </p>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <div className="bg-primary text-primary-foreground rounded-full h-6 w-6 flex items-center justify-center text-sm shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="font-medium">Enter your token</h3>
                    <p className="text-sm text-muted-foreground">
                      Paste your token in the field and click Deploy.
                    </p>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <div className="bg-primary text-primary-foreground rounded-full h-6 w-6 flex items-center justify-center text-sm shrink-0">
                    4
                  </div>
                  <div>
                    <h3 className="font-medium">Monitor deployment</h3>
                    <p className="text-sm text-muted-foreground">
                      Track the progress of your deployment in real-time.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}