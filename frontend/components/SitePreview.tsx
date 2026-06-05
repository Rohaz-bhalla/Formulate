"use client";

import React from "react";

interface SiteData {
  compiled_html?: string;
}

interface SitePreviewProps {
  data: SiteData | null;
}

export default function SitePreview({ data }: SitePreviewProps) {
  if (!data || !data.compiled_html) {
    return (
      <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 bg-gray-50 text-gray-500 rounded-lg p-12 min-h-[400px]">
        <p className="text-center font-medium text-lg">
          Fill out the form above to generate your website preview.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col bg-white rounded-lg overflow-hidden border border-gray-200 shadow-xl min-h-[600px]">
      
      <div className="bg-gray-100 border-b border-gray-200 px-4 py-3 flex items-center gap-2 select-none">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 bg-red-400 rounded-full inline-block"></span>
          <span className="w-3 h-3 bg-yellow-400 rounded-full inline-block"></span>
          <span className="w-3 h-3 bg-green-400 rounded-full inline-block"></span>
        </div>
        <div className="bg-white text-gray-400 text-xs py-1 px-4 rounded-md ml-4 w-full max-w-md truncate border border-gray-200 shadow-sm font-mono">
          index.html (Live Preview)
        </div>
      </div>

      <div className="w-full flex-1 min-h-[550px] relative bg-white">
        <iframe
          title="Generated Website Preview"
          srcDoc={data.compiled_html}
          className="w-full h-full absolute inset-0 border-none"
          sandbox="allow-scripts"
        />
      </div>
    </div>
  );
}