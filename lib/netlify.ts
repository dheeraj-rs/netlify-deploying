/**
 * Netlify API Client
 * 
 * A set of functions to interact with the Netlify API for deploying,
 * monitoring, and managing deployments.
 */

// Base API URL for Netlify
const NETLIFY_API_URL = "https://api.netlify.com/api/v1";

/**
 * Deploy a site to Netlify
 * @param token Personal access token
 * @param files Array of files to deploy
 * @returns Object containing site ID and deploy ID
 */
export async function deployToNetlify(token: string, files?: FileList) {
  try {
    if (!files || files.length === 0) {
      throw new Error("Please select a folder to deploy");
    }

    // First, create the site if it doesn't exist
    const site = await createNetlifySite(token);
    
    // Create a zip file containing all the files
    const zipBlob = await createZipArchive(files);
    
    // Deploy the zip file
    const deploy = await deployZipFile(token, site.id, zipBlob);
    
    return {
      siteId: site.id,
      deployId: deploy.id,
    };
  } catch (error: any) {
    console.error("Deployment error:", error);
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      "Failed to deploy to Netlify"
    );
  }
}

/**
 * Create a zip archive from files
 * @param files Files to include in the archive
 * @returns Blob containing the zip file
 */
async function createZipArchive(files: FileList): Promise<Blob> {
  // Import JSZip dynamically to avoid server-side issues
  const JSZip = (await import('jszip')).default;
  const zip = new JSZip();

  // Add each file to the zip
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const relativePath = file.webkitRelativePath || file.name;
    zip.file(relativePath, file);
  }

  // Generate zip file
  return await zip.generateAsync({ type: "blob" });
}

/**
 * Deploy a zip file to Netlify
 * @param token Personal access token
 * @param siteId Site ID
 * @param zipFile Zip file to deploy
 * @returns Deploy object
 */
async function deployZipFile(token: string, siteId: string, zipFile: Blob) {
  try {
    const formData = new FormData();
    formData.append("file", zipFile, "site.zip");

    const response = await fetch(`${NETLIFY_API_URL}/sites/${siteId}/deploys`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || 
        `Failed to deploy files: ${response.statusText}`
      );
    }

    return response.json();
  } catch (error: any) {
    console.error("File deployment error:", error);
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      "Failed to upload files to Netlify"
    );
  }
}

/**
 * Create a new Netlify site
 * @param token Personal access token
 * @returns Created site object
 */
async function createNetlifySite(token: string) {
  try {
    const response = await fetch(`${NETLIFY_API_URL}/sites`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: `site-${Date.now()}`,
        ssl: true,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || 
        `Failed to create site: ${response.statusText}`
      );
    }

    return response.json();
  } catch (error: any) {
    console.error("Site creation error:", error);
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      "Failed to create Netlify site"
    );
  }
}

/**
 * Get the status of a deployment
 * @param token Personal access token
 * @param deployId ID of the deployment to check
 * @returns Deployment status object
 */
export async function getDeploymentStatus(token: string, deployId: string) {
  try {
    const response = await fetch(`${NETLIFY_API_URL}/deploys/${deployId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || 
        `Failed to get deployment status: ${response.statusText}`
      );
    }

    return response.json();
  } catch (error: any) {
    console.error("Status check error:", error);
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      "Failed to get deployment status"
    );
  }
}

/**
 * Get the deployment history for a site
 * @param token Personal access token
 * @param siteId ID of the site
 * @returns Array of deployment objects
 */
export async function getDeploymentHistory(token: string, siteId: string) {
  try {
    const response = await fetch(`${NETLIFY_API_URL}/sites/${siteId}/deploys`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || 
        `Failed to get deployment history: ${response.statusText}`
      );
    }

    return response.json();
  } catch (error: any) {
    console.error("History retrieval error:", error);
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      "Failed to get deployment history"
    );
  }
}

/**
 * Get site details
 * @param token Personal access token
 * @param siteId ID of the site
 * @returns Site details object
 */
export async function getSiteDetails(token: string, siteId: string) {
  try {
    const response = await fetch(`${NETLIFY_API_URL}/sites/${siteId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || 
        `Failed to get site details: ${response.statusText}`
      );
    }

    return response.json();
  } catch (error: any) {
    console.error("Site details error:", error);
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      "Failed to get site details"
    );
  }
}

/**
 * Update site settings
 * @param token Personal access token
 * @param siteId ID of the site
 * @param settings Settings object to update
 * @returns Updated site object
 */
export async function updateSiteSettings(token: string, siteId: string, settings: any) {
  try {
    const response = await fetch(`${NETLIFY_API_URL}/sites/${siteId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(settings),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || 
        `Failed to update site settings: ${response.statusText}`
      );
    }

    return response.json();
  } catch (error: any) {
    console.error("Settings update error:", error);
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      "Failed to update site settings"
    );
  }
}