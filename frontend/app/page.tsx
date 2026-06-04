"use client";
import { useState } from 'react';
import SitePreview from '@/components/SitePreview';

export default function Home() {
  const [formData, setFormData] = useState({
    brand_name: "", category: "", tone: "", intro: "", 
    products: "", price_range: "", user_id: "user_123"
  });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          products: formData.products.split(',').map(p => p.trim())
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

  return (
    <main className="max-w-2xl mx-auto p-8">
      {!result && !loading && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            placeholder="Brand Name"
            className="border p-2 w-full"
            onChange={(e) =>
              setFormData({ ...formData, brand_name: e.target.value })
            }
          />
          <input
            placeholder="Category (e.g. AI Consulting)"
            className="border p-2 w-full"
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          />
          <input
            placeholder="Tone (e.g. Professional)"
            className="border p-2 w-full"
            onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
          />
          <textarea
            placeholder="Intro"
            className="border p-2 w-full"
            onChange={(e) =>
              setFormData({ ...formData, intro: e.target.value })
            }
          />
          <input
            placeholder="Products (comma separated)"
            className="border p-2 w-full"
            onChange={(e) =>
              setFormData({ ...formData, products: e.target.value })
            }
          />
          <button type="submit" className="bg-blue-600 text-white p-2 w-full">
            Generate Website
          </button>
        </form>
      )}

      {loading && <div className="text-center">Generating your site...</div>}

      {result && (
        <div className="mt-8 border rounded-lg overflow-hidden shadow-2xl">
          <div className="p-4 bg-gray-100 flex justify-between items-center border-b">
            <span className="font-semibold text-sm">Live Preview</span>
            <button
              onClick={() => setResult(null)}
              className="text-blue-600 underline text-sm"
            >
              Generate Another
            </button>
          </div>
          <SitePreview data={result} />
        </div>
      )}
    </main>
  );
}