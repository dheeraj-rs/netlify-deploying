"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { formatDistance } from "date-fns";
import { RefreshCwIcon, ExternalLinkIcon, ChevronRightIcon } from "lucide-react";
import { getDeploymentHistory, triggerNewDeploy } from "@/lib/netlify";

interface DeploymentHistoryProps {
  siteId: string;
  token: string;
}

export default function DeploymentHistory({ siteId, token }: DeploymentHistoryProps) {
  const [deployments, setDeployments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRedeploying, setIsRedeploying] = useState(false);

  useEffect(() => {
    if (siteId && token) {
      loadDeployments();
    }
  }, [siteId, token]);

  const loadDeployments = async () => {
    if (!siteId || !token) {
      return;
    }

    setIsLoading(true);
    try {
      const history = await getDeploymentHistory(token, siteId);
      setDeployments(history);
    } catch (error) {
      console.error("Failed to load deployment history:", error);
      toast.error("Failed to load deployment history");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRedeploy = async (deployId: string) => {
    if (!token || !siteId) {
      toast.error("Missing site information. Please deploy first.");
      return;
    }

    setIsRedeploying(true);
    try {
      await triggerNewDeploy(token, siteId, deployId);
      toast.success("Redeployment triggered");
      loadDeployments();
    } catch (error) {
      console.error("Redeployment failed:", error);
      toast.error("Failed to trigger redeployment");
    } finally {
      setIsRedeploying(false);
    }
  };

  if (!siteId || !token) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Deployment History</CardTitle>
          <CardDescription>
            You need to deploy your site first to view deployment history.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <p className="text-muted-foreground">No deployment history available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Deployment History</CardTitle>
          <CardDescription>
            View and manage your recent deployments
          </CardDescription>
        </div>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={loadDeployments}
          disabled={isLoading}
        >
          <RefreshCwIcon className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span className="sr-only">Refresh</span>
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-4 py-3">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ))}
          </div>
        ) : deployments.length === 0 ? (
          <div className="flex justify-center py-8">
            <p className="text-muted-foreground">No deployments found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {deployments.map((deploy) => (
              <div 
                key={deploy.id} 
                className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg"
              >
                <div className="space-y-1 mb-3 md:mb-0">
                  <div className="flex items-center space-x-2">
                    <span 
                      className={`w-3 h-3 rounded-full ${
                        deploy.state === "ready" 
                          ? "bg-green-500" 
                          : deploy.state === "error" 
                          ? "bg-red-500" 
                          : "bg-yellow-500"
                      }`} 
                    />
                    <h3 className="font-medium">{deploy.state === "ready" ? "Published" : deploy.state === "error" ? "Failed" : "Building"}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {formatDistance(new Date(deploy.created_at), new Date(), { addSuffix: true })}
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2">
                  {deploy.state === "ready" && (
                    <Button variant="outline" size="sm" className="flex items-center gap-1" asChild>
                      <a href={deploy.deploy_url} target="_blank" rel="noreferrer">
                        <ExternalLinkIcon className="h-3.5 w-3.5" />
                        View
                      </a>
                    </Button>
                  )}
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="flex items-center gap-1"
                    onClick={() => handleRedeploy(deploy.id)}
                    disabled={isRedeploying}
                  >
                    <RefreshCwIcon className={`h-3.5 w-3.5 ${isRedeploying ? 'animate-spin' : ''}`} />
                    Redeploy
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}