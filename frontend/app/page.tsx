"use client";

import { useState } from "react";
import { Sparkles, RefreshCw } from "lucide-react";
import Navbar from "@/components/Navbar";
import SitePreview from "@/components/SitePreview";
import LandingPage from "@/components/LandingPage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@clerk/nextjs";

export default function Home() {
  const { isLoaded, isSignedIn, user } = useUser();
  
  const [formData, setFormData] = useState({
    brand_name: "", 
    category: "", 
    tone: "", 
    intro: "", 
    products: "", 
    price_range: "Mid-range",
  });

  const [feedback, setFeedback] = useState("");
  const [result, setResult] = useState<{ compiled_html?: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, user_id: user?.id || "anonymous", feedback: "" }),
      });

      if (res.status === 403) {
        alert("Max retries reached!");
        setLoading(false);
        return;
      }

      if (!res.ok) throw new Error("Generation failed");
      const data = await res.json();
      setResult(data);
    } catch (err) {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRefineSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;
    setLoading(true);

    try {
      const res = await fetch("/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, user_id: user?.id || "anonymous", feedback: feedback }),
      });

      if (res.status === 403) {
        alert("Max refinement limits reached!");
        setLoading(false);
        return;
      }

      if (!res.ok) throw new Error("Refinement failed");
      const data = await res.json();
      setResult(data);
      setFeedback("");
    } catch (err) {
      alert("Failed to inject structural context modifications.");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-muted-foreground">
        <RefreshCw className="h-8 w-8 animate-spin mb-2 text-primary" />
        <p className="text-sm font-medium">Loading session parameters...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 flex flex-col">
        {!isSignedIn ? (
          <LandingPage />
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 w-full animate-in fade-in duration-300">
            
            <div className="w-full lg:w-1/3 space-y-6">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-md font-bold">Configuration Model</CardTitle>
                  <CardDescription>Define specifications for layout generation models.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Brand Name</label>
                      <Input
                        required
                        placeholder="e.g. Acme Studio"
                        value={formData.brand_name}
                        onChange={(e) => setFormData({ ...formData, brand_name: e.target.value })}
                      />
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Category</label>
                      <Input
                        required
                        placeholder="e.g. Premium Tech Agency"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Theme Aesthetic</label>
                      <Input
                        required
                        placeholder="e.g. Minimalist Dark Corporate"
                        value={formData.tone}
                        onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Intro Bio Summary</label>
                      <Textarea
                        required
                        rows={3}
                        placeholder="Summarize core brand values..."
                        className="resize-none"
                        value={formData.intro}
                        onChange={(e) => setFormData({ ...formData, intro: e.target.value })}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Offerings & Services</label>
                      <Input
                        required
                        placeholder="e.g. Cloud Scaling, Core Frontend Engines"
                        value={formData.products}
                        onChange={(e) => setFormData({ ...formData, products: e.target.value })}
                      />
                    </div>

                    <Button type="submit" disabled={loading} className="w-full mt-2 gap-2">
                      {loading && !result ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <Sparkles className="h-4 w-4" />
                      )}
                      {loading && !result ? "Compiling Framework..." : "Build Layout Framework"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {result && (
                <Card className="shadow-sm border-indigo-500/20 dark:border-indigo-400/10 bg-indigo-50/10 dark:bg-indigo-950/5">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-bold">Iterative Adjustments</CardTitle>
                    <CardDescription>Type specific design requests to override layouts.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleRefineSubmit} className="space-y-2">
                      <Textarea
                        rows={2}
                        placeholder="e.g. Turn hero sections dark navy and center text details..."
                        className="text-xs bg-background resize-none"
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                      />
                      <Button
                        type="submit"
                        variant="secondary"
                        disabled={loading || !feedback.trim()}
                        className="w-full text-xs h-9 gap-1.5"
                      >
                        {loading ? (
                          <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Sparkles className="h-3.5 w-3.5" />
                        )}
                        {loading ? "Revising Code Elements..." : "Inject Structural Modification"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="flex-1 min-h-[600px] flex flex-col">
              {loading && !result && (
                <div className="flex-1 flex flex-col items-center justify-center border border-dashed rounded-xl p-8 bg-muted/10">
                  <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mb-4 stroke-1" />
                  <p className="text-sm text-muted-foreground font-medium animate-pulse">
                    Assembling responsive source code parameters...
                  </p>
                </div>
              )}

              {loading && result && (
                <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-indigo-500/30 rounded-xl p-8 bg-indigo-50/10 dark:bg-indigo-950/20">
                  <Sparkles className="h-8 w-8 animate-bounce text-indigo-500 mb-4 stroke-1" />
                  <p className="text-sm text-muted-foreground font-medium animate-pulse">
                    Applying structural adjustments to DOM...
                  </p>
                </div>
              )}

              {!loading && (
                <div className="flex-1 flex flex-col">
                  <SitePreview data={result} />
                </div>
              )}
            </div>

          </div>
        )}

      </main>
    </div>
  );
}