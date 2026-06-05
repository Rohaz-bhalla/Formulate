"use client";

import { useState } from 'react';
import SitePreview from '@/components/SitePreview';

export default function Home() {
  const [formData, setFormData] = useState({
    brand_name: "", 
    category: "", 
    tone: "", 
    intro: "", 
    products: "", 
    price_range: "Mid-range",
    user_id: "user_123"
  });

  const [feedback, setFeedback] = useState("");
  const [result, setResult] = useState<{ compiled_html?: string } | null>(null);
  const [loading, setLoading] = useState(false);

  // Handles initial form generation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          feedback: ""
        }),
      });

      if (res.status === 403) {
        alert("Max retries reached! Please contact support.");
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
      const res = await fetch('/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          feedback: feedback
        }),
      });

      if (res.status === 403) {
        alert("Max refinement retries reached!");
        setLoading(false);
        return;
      }

      if (!res.ok) throw new Error("Refinement failed");

      const data = await res.json();
      setResult(data);
      setFeedback("");
    } catch (err) {
      alert("Failed to refine design. Please check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-7xl mx-auto p-6 min-h-screen flex flex-col lg:flex-row gap-8">
      
      <div className="w-full lg:w-1/3 space-y-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h1 className="text-xl font-bold text-gray-900 mb-4">Formulate Builder</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Brand Name</label>
              <input
                required
                placeholder="e.g. Acme Tech"
                className="border border-gray-300 p-2.5 rounded-md w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.brand_name}
                onChange={(e) => setFormData({ ...formData, brand_name: e.target.value })}
              />
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Category</label>
              <input
                required
                placeholder="e.g. AI Consulting Services"
                className="border border-gray-300 p-2.5 rounded-md w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Aesthetic Tone</label>
              <input
                required
                placeholder="e.g. Minimalist Dark Corporate"
                className="border border-gray-300 p-2.5 rounded-md w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.tone}
                onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Brief Introduction</label>
              <textarea
                required
                rows={3}
                placeholder="Summarize the core value proposition..."
                className="border border-gray-300 p-2.5 rounded-md w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                value={formData.intro}
                onChange={(e) => setFormData({ ...formData, intro: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Key Offerings / Products</label>
              <input
                required
                placeholder="e.g. Cloud Scaling, Model Fine-Tuning"
                className="border border-gray-300 p-2.5 rounded-md w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.products}
                onChange={(e) => setFormData({ ...formData, products: e.target.value })}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2.5 px-4 rounded-md w-full text-sm transition-colors shadow-sm"
            >
              {loading && !result ? "Generating Site..." : "Generate Website Blueprint"}
            </button>
          </form>
        </div>

        {result && (
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-3">
            <h2 className="text-sm font-bold text-gray-900">Iterative Adjustments</h2>
            <p className="text-xs text-gray-500 leading-relaxed">
              Not exactly what you envisioned? Type specific requests below to recalculate styling patterns or structure updates.
            </p>
            <form onSubmit={handleRefineSubmit} className="space-y-2">
              <textarea
                rows={2}
                placeholder="e.g. Change hero background color to warm orange..."
                className="border border-gray-300 p-2 rounded-md w-full text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
              <button
                type="submit"
                disabled={loading || !feedback.trim()}
                className="bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 text-white font-medium py-1.5 px-3 rounded-md w-full text-xs transition-colors"
              >
                {loading ? "Re-working layout structures..." : "Apply Modification"}
              </button>
            </form>
          </div>
        )}
      </div>

      <div className="flex-1 min-h-[600px] flex flex-col">
        {loading && (
          <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
            <p className="text-sm text-gray-500 font-medium animate-pulse">
              Compiling Tailwind components & layouts...
            </p>
          </div>
        )}

        {!loading && (
          <div className="flex-1 flex flex-col">
            <SitePreview data={result} />
          </div>
        )}
      </div>

    </main>
  );
}