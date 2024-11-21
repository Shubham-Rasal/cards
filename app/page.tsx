"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Share2, Plus, Loader2, Wand, CopyCheckIcon, CopyIcon, RefreshCw, Share, X } from "lucide-react";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import { SaasCard } from "@/components/saas-card";
import { formatTime } from "@/lib/utils";
import Link from "next/link";
import { toPng } from 'html-to-image';

export default function ScratchCardGame() {
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [isRevealed, setIsRevealed] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [website, setWebsite] = useState<{ 
    name: string; 
    image: string; 
    rank: string;
    attackPower: number;
    defencePower: number;
    hiddenAdvantage: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [pastCards, setPastCards] = useState<Array<{ 
    name: string; 
    image: string; 
    rank: string;
    attackPower: number;
    defencePower: number;
    hiddenAdvantage: string;
    url: string; 
    description: string; 
    timestamp: number 
  }>>([]);
  const [inputDisabled, setInputDisabled] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Load past cards from localStorage on component mount
  useEffect(() => {
    const savedCards = localStorage.getItem('saas-cards');
    if (savedCards) {
      const cards = JSON.parse(savedCards);
      setPastCards(cards);
    }
  }, []);

  const saveToPastCards = (card: { 
    name: string; 
    image: string; 
    rank: string;
    attackPower: number;
    defencePower: number;
    hiddenAdvantage: string;
    url: string; 
    description: string; 
  }) => {
    const newCard = { ...card, timestamp: Date.now() };
    const updatedCards = [newCard, ...pastCards].slice(0, 10); // Keep only last 10 cards
    setPastCards(updatedCards);
    // Compress and store the cards in localStorage
    try {
      localStorage.setItem('saas-cards', JSON.stringify(updatedCards));
    } catch (e) {
      console.error('Error saving to localStorage:', e);
      toast.error('Failed to save card', {
        description: 'The image might be too large to store. Try with a different website.',
        duration: 3000,
      });
    }
  };



  const getWebsiteScreenshot = async (url: string) => {
    try {
      const startTime = performance.now();
      
      // Encode the URL properly
      const encodedUrl = encodeURIComponent(url);
      const apiUrl = `https://api.screenshotone.com/take?access_key=vO3NeqV9vlvXrQ&url=${encodedUrl}&format=jpg&block_ads=true&block_cookie_banners=true&block_banners_by_heuristics=false&block_trackers=true&delay=0&timeout=60&response_type=by_format&image_quality=80`;

      const response = await fetch(apiUrl);
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      if (!response.ok) {
        throw new Error(`Failed to get screenshot: ${response.statusText}`);
      }

      // Convert the response to base64
      const blob = await response.blob();
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });

      toast.success("Screenshot captured!", {
        description: `Captured in ${formatTime(duration)}`,
        duration: 3000,
      });

      return base64;
    } catch (error) {
      console.error('Error getting screenshot:', error);
      toast.error("Failed to get screenshot", {
        description: "There was an error capturing the website. Please check the URL and try again.",
        duration: 3000,
      });
      return "";
    }
  };

  const generatePower = async (url: string, description: string) => {
    try {
      const response = await fetch('/api/generate-power', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, description }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate power');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error generating power:', error);
      toast.error('Failed to generate power', {
        description: 'Please try again later.',
        duration: 3000,
      });
      return '';
    }
  };

  const normalizeUrl = (url: string): string => {
    // Remove any whitespace
    url = url.trim();
    
    // Check if the URL starts with http:// or https://
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      // Add https:// if no protocol is specified
      url = 'https://' + url;
    }
    
    // Remove trailing slash if present
    return url.replace(/\/$/, '');
  };

  const isValidUrl = (url: string): boolean => {
    try {
      // First normalize the URL
      const normalizedUrl = normalizeUrl(url);
      new URL(normalizedUrl);
      
      // Additional validation for domain format - site.com, http://site.com
      const domainRegex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
      

      return domainRegex.test(normalizedUrl);
    } catch (e) {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValidUrl(url)) {
      toast.error("Invalid URL format", {
        description: "Please enter a valid URL (e.g., site.com or https://site.com)",
        duration: 3000,
      });
      return;
    }

 
    // Reset states
    setIsRevealed(false);
    setIsSubmitted(false);
    setIsLoading(true);
    setInputDisabled(true);

    try {
      const normalizedUrl = normalizeUrl(url);
      // const screenshotUrl = await getWebsiteScreenshot(normalizedUrl);
      const screenshotUrl = 'https://picsum.photos/800/600';
      const powerData = await generatePower(url, description);
      
      setWebsite({
        name: normalizedUrl.replace(/^https?:\/\//, '').replace(/\/$/, ''),
        image: screenshotUrl,
        rank: powerData.rank,
        attackPower: powerData.attackPower,
        defencePower: powerData.defencePower,
        hiddenAdvantage: powerData.hiddenAdvantage
      });
      
      setIsSubmitted(true);
      
      // Show toast notification
      toast.success("Your card is ready! Scratch to reveal!", {
        duration: 4000,
        icon: "✨",
      });

    } catch (error) {
      console.error(error);
      toast.error("Failed to generate card. Please try again.", {
        duration: 3000,
      });
      setInputDisabled(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setUrl("");
    setDescription("");
    setIsRevealed(false);
    setIsDrawing(false);
    setIsSubmitted(false);
    setWebsite(null);
    setIsLoading(false);
    setInputDisabled(false);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#1a1a1a";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // Add subtle pattern
        ctx.strokeStyle = "#2c2c2c";
        for (let i = 0; i < canvas.width; i += 20) {
          for (let j = 0; j < canvas.height; j += 20) {
            ctx.beginPath();
            ctx.moveTo(i, j);
            ctx.lineTo(i + 10, j + 10);
            ctx.stroke();
          }
        }
      }
    }
  }, [url]);

  const handleMouseDown = () => setIsDrawing(true);
  const handleMouseUp = () => setIsDrawing(false);
  const handleMouseMove = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!isDrawing || !isSubmitted) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx) {
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      const radius = 25;
      let offsetX: number, offsetY: number;
      if (e.nativeEvent instanceof MouseEvent) {
        offsetX = e.nativeEvent.offsetX;
        offsetY = e.nativeEvent.offsetY;
      } else if (e.nativeEvent instanceof TouchEvent) {
        const rect = (
          e.nativeEvent.target as HTMLCanvasElement
        ).getBoundingClientRect();
        offsetX = e.nativeEvent.touches[0].clientX - rect.left;
        offsetY = e.nativeEvent.touches[0].clientY - rect.top;
      } else {
        offsetX = 0;
        offsetY = 0;
      }
      ctx.arc(offsetX, offsetY, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    checkRevealPercentage();
  };

  const checkRevealPercentage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixelCount = imageData.width * imageData.height;
      let transparentPixels = 0;
      for (let i = 0; i < pixelCount * 4; i += 4) {
        if (imageData.data[i + 3] === 0) {
          transparentPixels++;
        }
      }
      const percentRevealed = (transparentPixels / pixelCount) * 100;
      if (percentRevealed > 50) {
        setIsRevealed(true);
        if (website) {
          saveToPastCards({
            name: website.name,
            image: website.image,
            rank: website.rank,
            attackPower: website.attackPower,
            defencePower: website.defencePower,
            hiddenAdvantage: website.hiddenAdvantage,
            url: url,
            description: description
          });
        }
      }
    }
  };

  const handleShare = async () => {
    if (!cardRef.current || !website) {
      toast.error("No card to share");
      return;
    }

    setIsCopying(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 2,
        skipAutoScale: true,
        style: {
          transform: 'scale(1)',
          background: 'black',
          width: '100%',
          height: '100%',
          margin: '0',
          padding: '0',
          border: 'none',
          backgroundColor: 'black',
        },
      });

      // Create a temporary canvas to handle the image
      const img = new Image();
      img.src = dataUrl;
      await new Promise((resolve) => (img.onload = resolve));

      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');

      // Draw the image on the canvas
      ctx.drawImage(img, 0, 0);

      // Convert to blob and share
      const blob = await new Promise<Blob>((resolve) => 
        canvas.toBlob((blob) => resolve(blob!), 'image/png', 1)
      );

      if (navigator.share) {
        await navigator.share({
          title: `${website.name} Power Card`,
          text: `Check out this power card for ${website.name}!`,
          files: [
            new File([blob], 'power-card.png', {
              type: 'image/png',
            }),
          ],
        });
        toast.success("Card shared successfully!");
      } else if (navigator.clipboard) {
        // Fallback to copying to clipboard
        const clipboardItem = new ClipboardItem({
          'image/png': blob,
        });
        await navigator.clipboard.write([clipboardItem]);
        toast.success("Card image copied to clipboard!");
      } else {
        // Final fallback - download the image
        const link = document.createElement('a');
        link.download = 'power-card.png';
        link.href = URL.createObjectURL(blob);
        link.click();
        URL.revokeObjectURL(link.href);
        toast.success("Card image downloaded!");
      }
    } catch (error) {
      console.error('Error sharing card:', error);
      toast.error("Failed to share card");
    } finally {
      setIsCopying(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white p-6">
      <div className="max-w-xs mx-auto space-y-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col  items-center justify-center gap-2">
            <Input
              type="text"
              placeholder="Enter your website URL (e.g., site.com)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              pattern="^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$"
              disabled={inputDisabled}
              className={`bg-[#1a1a1a] border-emerald-500/20 text-emerald-50 placeholder:text-emerald-500/50 ${inputDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            />
            <Input
              type="text"
              placeholder="Describe your SaaS in one line"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              disabled={inputDisabled}
              className={`bg-[#1a1a1a] border-emerald-500/20 text-emerald-50 placeholder:text-emerald-500/50 ${inputDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            />
            <Button
              onClick={isSubmitted ? handleReset : handleSubmit}
              disabled={isLoading || !isValidUrl(url) || !description}
              className={`w-full ${isSubmitted ? 'bg-emerald-600 hover:bg-emerald-700' : ''}`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating
                </>
              ) : isSubmitted ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Create New Card
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Card
                </>
              )}
            </Button>
          </div>
        </form>

        <AnimatePresence mode="wait">
          {url && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="relative"
            >
              <div
                ref={cardRef}
                className="w-[320px] h-[460px] rounded-2xl overflow-hidden relative"
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 flex flex-col items-center justify-center text-emerald-100 rounded-2xl bg-[#1a1a1a] border-2 border-emerald-500/20"
                >
                  {website && (
                    <SaasCard
                      name={website.name}
                      imageUrl={website.image}
                      url={url}
                      rank={website.rank}
                      attackPower={website.attackPower}
                      defencePower={website.defencePower}
                      hiddenAdvantage={website.hiddenAdvantage}
                    />
                  )}
                </motion.div>
                {!isRevealed && (
                  <div 
                    className={`absolute inset-0 z-10 ${
                      isSubmitted && !isRevealed 
                        ? '' 
                        : ''
                    }`}
                  >
                    <canvas
                      ref={canvasRef}
                      onMouseDown={isSubmitted ? handleMouseDown : undefined}
                      onMouseUp={isSubmitted ? handleMouseUp : undefined}
                      onMouseMove={isSubmitted ? handleMouseMove : undefined}
                      onTouchStart={isSubmitted ? handleMouseDown : undefined}
                      onTouchEnd={isSubmitted ? handleMouseUp : undefined}
                      onTouchMove={isSubmitted ? handleMouseMove : undefined}
                      className={`w-full h-full cursor-pointer rounded-xl border-2 ${
                        isSubmitted && !isRevealed
                          ? 'border-emerald-500/50 shadow-md'
                          : 'border-emerald-500/20'
                      }`}
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-between mt-4">
                <Button
                  onClick={handleShare}
                  disabled={isCopying || !website}
                  className="px-6 py-2 h-full rounded-xl bg-[#2c2c2c] border-2 border-emerald-500/20 text-emerald-400 hover:border-emerald-500/40 transition-colors duration-200 flex items-center gap-2"
                >
                  {isCopying ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CopyIcon className="w-4 h-4" />
                  )}
                  {isCopying ? "Copying..." : "Copy Card"}
                </Button>
                <Link
                  className="px-6 py-2 rounded-xl bg-[#2c2c2c] border-2 border-emerald-500/20 text-emerald-400 hover:border-emerald-500/40 transition-colors duration-200 flex items-center gap-2"
                  href={`https://twitter.com/intent/tweet?text=Check%20out%20my%20sick%20website%20preview%20card!`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <X className="w-4 h-4" />
                  Share on X
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!url && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="border-2 border-dashed border-emerald-500/20 rounded-2xl p-8 text-center"
          >
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="w-24 h-32 border-2 border-emerald-500/20 rounded-xl absolute -left-16 -rotate-6" />
                <div className="w-24 h-32 border-2 border-emerald-500/20 rounded-xl absolute -right-16 rotate-6" />
                <div className="w-24 h-32 border-2 border-emerald-500/20 rounded-xl relative bg-[#2c2c2c] flex items-center justify-center">
                  <div className="w-24 h-32 rounded-xl bg-[#2c2c2c] border-2 border-emerald-500/20 flex items-center justify-center">
                    <img
                      src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/132.svg"
                      alt="Pokeball"
                      className="w-16 h-16 object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Enter your SaaS URL</h2>
            <p className="text-gray-400">
              Enter the URL of your SaaS and describe it in one line to get started.
            </p>
          </motion.div>
        )}
      </div>

      {/* Past Cards Section */}
      {/* {pastCards.length > 0 && (
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-emerald-400 mb-6">Past Creations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastCards.map((card, index) => (
              <div 
                key={card.timestamp} 
                className="relative bg-[#2c2c2c] rounded-xl border-2 border-emerald-500/20 p-4 hover:border-emerald-500/40 transition-all"
              >
                <div className="aspect-video rounded-lg overflow-hidden mb-4">
                  <img src={card.image} alt={card.name} className="w-full h-full object-cover" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-emerald-300">{card.name}</h3>
                  <p className="text-sm text-emerald-400/80">{card.description}</p>
                  <p className="text-sm italic text-emerald-300">✨ {card.hiddenAdvantage}</p>
                  <div className="flex justify-between items-center mt-4">
                    <a
                      href={card.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                      Visit Site →
                    </a>
                    <span className="text-xs text-emerald-500/50">
                      {new Date(card.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )} */}
    </div>
  );
}
