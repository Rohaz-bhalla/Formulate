"use client";

import React, { useState } from "react";
import { Maximize2, Minimize2, FileCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface SiteData {
  compiled_html?: string;
}

interface SitePreviewProps {
  data: SiteData | null;
}

export default function SitePreview({ data }: SitePreviewProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!data || !data.compiled_html) {
    return (
      <div className="flex flex-col items-center justify-center border-2 border-dashed border-muted bg-muted/20 text-muted-foreground rounded-xl p-12 min-h-[450px]">
        <FileCode className="h-10 w-10 mb-4 stroke-1 animate-pulse" />
        <p className="text-center font-medium text-sm">
          Fill out the configuration parameters to generate your website preview canvas.
        </p>
      </div>
    );
  }

  return (
    <Card 
      className={`w-full flex flex-col overflow-hidden border transition-all duration-200 bg-background ${
        isFullscreen ? "fixed inset-0 z-50 rounded-none h-screen m-0 border-none" : "min-h-[600px] flex-1 shadow-xl"
      }`}
    >
      {/* Mock Browser Header Component using Shadcn structures */}
      <CardHeader className="bg-muted/40 border-b px-4 py-3 flex flex-row items-center justify-between space-y-0 select-none">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 bg-destructive/70 rounded-full inline-block"></span>
            <span className="w-3 h-3 bg-yellow-400 rounded-full inline-block"></span>
            <span className="w-3 h-3 bg-green-400 rounded-full inline-block"></span>
          </div>
          <div className="bg-background text-muted-foreground text-xs py-1 px-4 rounded-md ml-4 w-48 sm:w-64 truncate border font-mono shadow-sm">
            index.html
          </div>
        </div>

        {/* Dynamic Screen Size Utility Toggle Controls */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="h-8 gap-1.5 text-xs font-medium"
        >
          {isFullscreen ? (
            <>
              <Minimize2 className="h-3.5 w-3.5" />
              Exit Fullscreen
            </>
          ) : (
            <>
              <Maximize2 className="h-3.5 w-3.5" />
              View Fullscreen
            </>
          )}
        </Button>
      </CardHeader>

      {/* Main Render Output Viewport frame */}
      <CardContent className="p-0 w-full flex-1 relative bg-white">
        <iframe
          title="Generated Website Preview"
          srcDoc={data.compiled_html}
          className="w-full h-full absolute inset-0 border-none"
          sandbox="allow-scripts"
        />
      </CardContent>
    </Card>
  );
}