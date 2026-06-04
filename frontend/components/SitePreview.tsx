import React from 'react';

interface SiteData {
  hero_title: string;
  hero_subtitle: string;
  about_text: string;
  products: string[];
  color_palette: string;
}

export default function SitePreview({ data }: { data: SiteData }) {
  return (
    <div className="w-full bg-white text-gray-900 font-sans">
        
      <section className="py-20 px-6 text-center bg-gray-50">
        <h1 className="text-5xl font-extrabold mb-4">{data.hero_title}</h1>
        <p className="text-xl text-gray-600">{data.hero_subtitle}</p>
      </section>

      <section className="py-16 px-6 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">About Us</h2>
        <p className="text-lg leading-relaxed">{data.about_text}</p>
      </section>

      <section className="py-16 px-6 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Our Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.products.map((product, idx) => (
              <div key={idx} className="p-6 border border-gray-700 rounded-lg">
                {product}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}