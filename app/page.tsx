import Link from "next/link";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/deploy/navbar";
import { ArrowRightIcon, RocketIcon, DatabaseIcon, ServerIcon, CloudIcon } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Deploy your Next.js App to Netlify
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Build and deploy your Next.js applications with a seamless, one-click deployment experience. No CLI or external tools required.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/deploy">
                    <Button size="lg" className="gap-1">
                      Start Deploying
                      <ArrowRightIcon className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/docs">
                    <Button size="lg" variant="outline">Learn More</Button>
                  </Link>
                </div>
              </div>
              <div className="mx-auto lg:mx-0 flex justify-center">
                <div className="relative h-[350px] w-full max-w-[450px] rounded-lg bg-muted p-2 shadow-xl">
                  <div className="absolute inset-0 flex flex-col rounded-md bg-background p-6">
                    <div className="flex items-center gap-2 border-b pb-2">
                      <div className="h-3 w-3 rounded-full bg-red-500" />
                      <div className="h-3 w-3 rounded-full bg-yellow-500" />
                      <div className="h-3 w-3 rounded-full bg-green-500" />
                      <div className="ml-2 text-sm text-muted-foreground">Deployment Console</div>
                    </div>
                    <div className="mt-4 space-y-4 flex-1">
                      <div className="rounded-md bg-muted p-2 text-sm">
                        <span className="text-green-500">✓</span> Initializing deployment...
                      </div>
                      <div className="rounded-md bg-muted p-2 text-sm">
                        <span className="text-green-500">✓</span> Building Next.js application...
                      </div>
                      <div className="rounded-md bg-muted p-2 text-sm">
                        <span className="text-green-500">✓</span> Optimizing assets...
                      </div>
                      <div className="rounded-md bg-muted p-2 text-sm">
                        <span className="text-green-500">✓</span> Uploading to Netlify...
                      </div>
                      <div className="rounded-md bg-muted p-2 text-sm">
                        <span className="text-blue-500 animate-pulse">→</span> Finalizing deployment...
                      </div>
                    </div>
                    <div className="mt-auto rounded-md bg-primary/10 p-3 text-sm">
                      <div className="font-medium">Deployment Status</div>
                      <div className="mt-1 flex items-center text-muted-foreground">
                        <span className="mr-2 h-2 w-2 rounded-full bg-yellow-500"></span>
                        In progress - 75% complete
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                  Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Everything you need to deploy
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform provides all the tools you need to deploy your Next.js applications to Netlify, with no command line required.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-4">
                <div className="rounded-full bg-primary p-2.5">
                  <RocketIcon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold">One-Click Deploy</h3>
                <p className="text-center text-sm text-muted-foreground">
                  Deploy your Next.js app with a single click, no CLI or complex setup required.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-4">
                <div className="rounded-full bg-primary p-2.5">
                  <DatabaseIcon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold">Deployment History</h3>
                <p className="text-center text-sm text-muted-foreground">
                  View and manage your deployment history with easy rollback options.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-4">
                <div className="rounded-full bg-primary p-2.5">
                  <ServerIcon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold">Site Settings</h3>
                <p className="text-center text-sm text-muted-foreground">
                  Configure your site settings including SSL, HTTPS, and pretty URLs.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-4">
                <div className="rounded-full bg-primary p-2.5">
                  <CloudIcon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold">Real-time Status</h3>
                <p className="text-center text-sm text-muted-foreground">
                  Track your deployment progress in real-time with detailed status updates.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="border-t">
        <div className="container flex flex-col gap-2 py-8 md:flex-row md:items-center md:gap-4">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2025 Netlify Deployer. All rights reserved.
          </p>
          <nav className="flex justify-center gap-4 md:ml-auto md:justify-end">
            <Link href="#" className="text-sm text-muted-foreground underline underline-offset-4">
              Terms
            </Link>
            <Link href="#" className="text-sm text-muted-foreground underline underline-offset-4">
              Privacy
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}