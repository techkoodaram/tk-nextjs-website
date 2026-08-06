'use client'

import { useState, useRef, useEffect } from 'react';
import { toPng } from 'html-to-image';
import { Download, Camera, MapPin, Calendar, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

interface RegistrationBannerProps {
  eventName: string;
  eventDate: string;
  venue: string;
  initialName?: string;
  initialRole?: string;
  initialPhoto?: string | null;
}

export default function RegistrationBanner({
  eventName,
  eventDate,
  venue,
  initialName = '',
  initialRole = '',
  initialPhoto = null,
}: RegistrationBannerProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [copied, setCopied] = useState(false);

  const bannerRef = useRef<HTMLDivElement>(null);

  const platformDimensions = {
    linkedin: { width: 1200, height: 630 },
  };

  useEffect(() => {
    // Generate the preview image once mounted
    const generatePreview = async () => {
      if (!bannerRef.current) return;
      
      try {
        setLoading(true);
        // Small delay to ensure styles and fonts are loaded
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const dataUrl = await toPng(bannerRef.current, {
          pixelRatio: 2,
        });
        setPreviewUrl(dataUrl);
      } catch (err) {
        console.error('Error generating preview:', err);
        setError('Failed to generate banner preview.');
      } finally {
        setLoading(false);
      }
    };
    
    generatePreview();
  }, []);

  const handleDownload = () => {
    if (!previewUrl) return;

    try {
      const link = document.createElement('a');
      link.download = `attending-${eventName.toLowerCase().replace(/\s+/g, '-')}.png`;
      link.href = previewUrl;
      link.click();
      
      // Show the share dialog after download
      setShowDialog(true);
    } catch (err) {
      console.error('Error downloading:', err);
      setError('Failed to download. Please try again.');
    }
  };

  const shareText = `Hey there, I am attending ${eventName} on ${eventDate} at ${venue}! Can't wait to learn and connect. Join me!`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="w-full mt-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold mb-2 text-green-600 dark:text-green-400">Registration Successful! 🎉</h3>
        <p className="text-muted-foreground">
          Let your network know you're attending by sharing this custom banner!
        </p>
      </div>

      <div className="max-w-2xl mx-auto p-6 bg-card rounded-xl border border-border/50 shadow-sm text-center">
        {error && (
          <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm text-center mb-4">
            {error}
          </div>
        )}
        
        <div className="mb-6 rounded-lg overflow-hidden border border-border/50 bg-muted/5 relative aspect-[1200/630] flex items-center justify-center">
          {loading ? (
             <div className="flex flex-col items-center text-muted-foreground py-20">
               <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
               <p>Generating your personalized banner...</p>
             </div>
          ) : previewUrl ? (
            <img src={previewUrl} alt="Your personalized event banner" className="w-full h-full object-contain" />
          ) : (
             <div className="py-20 text-muted-foreground">Unable to generate preview.</div>
          )}
        </div>

        <Button
          onClick={handleDownload}
          className="w-full sm:w-auto h-12 px-8 text-base font-bold shadow-md"
          disabled={loading || !previewUrl}
        >
          <Download className="w-5 h-5 mr-2" />
          Download Banner
        </Button>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share on Social Media!</DialogTitle>
            <DialogDescription>
              Your banner is downloading. Copy the text below and attach your newly downloaded banner to let your network know you're going!
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col space-y-4 py-4">
            <div className="bg-muted p-4 rounded-md text-sm whitespace-pre-wrap text-foreground">
              {shareText}
            </div>
            <Button onClick={copyToClipboard} variant="secondary" className="w-full">
              {copied ? (
                <><Check className="w-4 h-4 mr-2" /> Copied!</>
              ) : (
                <><Copy className="w-4 h-4 mr-2" /> Copy Text</>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Hidden Banner Render Area for Generation */}
      <div className="fixed top-0 left-0 -z-50 opacity-0 pointer-events-none" style={{ left: '-9999px' }}>
        <div
          ref={bannerRef}
          className="bg-slate-50 overflow-hidden relative flex flex-row items-center font-sans"
          style={{
            width: platformDimensions.linkedin.width,
            height: platformDimensions.linkedin.height
          }}
        >
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-50 rounded-full blur-3xl opacity-50 translate-y-1/3 -translate-x-1/4"></div>

          {/* Left Section: FACE (45%) */}
          <div className="w-[45%] h-full flex items-center justify-center relative z-10 pl-16">
            {/* Circle Container */}
            <div
              className="relative w-[480px] h-[480px] rounded-full overflow-hidden shadow-2xl bg-white flex-shrink-0"
              style={{
                border: '12px solid #593c27',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
              }}
            >
              {initialPhoto ? (
                <img src={initialPhoto} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                  <Camera className="w-32 h-32 text-slate-400" />
                </div>
              )}
            </div>
          </div>

          {/* Right Section: CONTENT (55%) */}
          <div className="flex-1 h-full flex flex-col justify-center items-start pl-12 pr-16 relative z-10">

            {/* 1. Badge / "I'm Attending" */}
            <div className="inline-block px-4 py-2 bg-[#593c27] text-white text-sm font-bold uppercase tracking-widest rounded-lg mb-8 shadow-sm">
              I'm Attending
            </div>

            {/* 2. Name & Role */}
            <div className="mb-10 max-w-full">
              <h2 className="text-6xl font-black text-slate-900 leading-tight mb-2">
                {initialName || "Your Name"}
              </h2>
              {initialRole && (
                <p className="text-3xl text-slate-500 font-medium">{initialRole}</p>
              )}
            </div>

            {/* Divider */}
            <div className="w-24 h-1.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full mb-10"></div>

            {/* 3. Event Details */}
            <div className="space-y-3">
              <h3 className="text-4xl font-bold text-slate-800 leading-tight">
                {eventName}
              </h3>

              <div className="flex flex-col gap-2 mt-4 text-slate-600 font-medium text-xl">
                <div className="flex items-center gap-3">
                  <Calendar className="w-6 h-6 text-[#593c27]" />
                  <span>{eventDate}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-6 h-6 text-[#593c27]" />
                  <span>{venue}</span>
                </div>
              </div>
            </div>

            {/* Logo at bottom right */}
            <div className="absolute bottom-10 right-10 opacity-80">
              <img
                src="/logo.png"
                alt="techKoodaram"
                style={{ height: '32px', width: 'auto' }}
                onError={(e) => {
                  // Fallback if logo doesn't exist
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
