import { useState } from "react";
import { Wand2, Loader2, Image as ImageIcon, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Index = () => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<Array<{ url: string; prompt: string; timestamp: number }>>([]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }
    
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: { prompt }
      });

      if (error) throw error;

      if (data?.images) {
        const newImages = (Array.isArray(data.images) ? data.images : [data.images]).map(img => ({
          ...img,
          prompt: prompt,
          timestamp: Date.now()
        }));
        setGeneratedImages(prev => [...newImages, ...prev]);
        toast.success("Image generated successfully!");
      } else {
        throw new Error("No images returned");
      }
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error(error.message || "Failed to generate image");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = (imageUrl: string, index: number) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `fluxora-${Date.now()}-${index}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <header className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-hero opacity-10"></div>
        <div className="relative container mx-auto px-4 py-16 md:py-24 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-card border border-primary/40 mb-8 shadow-glow backdrop-blur-sm hover:border-primary/60 transition-all">
            <Wand2 className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-sm font-semibold bg-gradient-primary bg-clip-text text-transparent">Powered by FLUX.1-Schnell</span>
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-extrabold mb-6 bg-gradient-primary bg-clip-text text-transparent leading-tight tracking-tight">
            Fluxora Studio
          </h1>
          <p className="text-lg md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-3 leading-relaxed">
            Transform your imagination into stunning visuals with AI
          </p>
          <p className="text-sm text-muted-foreground/70 flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            Lightning-fast generation • Professional quality
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Prompt Input Section */}
        <Card className="p-6 md:p-10 mb-12 bg-card border-primary/30 shadow-card relative overflow-hidden hover:shadow-accent-glow transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-accent opacity-5"></div>
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-primary opacity-10 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="relative space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
                <ImageIcon className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <label className="text-xl font-bold text-foreground block">
                  Describe Your Vision
                </label>
                <p className="text-sm text-muted-foreground">Be as detailed as you like</p>
              </div>
            </div>
            <Textarea
              placeholder="A majestic golden lion standing on a mountain peak at sunset, digital art style, cinematic lighting, highly detailed..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[160px] resize-none bg-background/70 border-border hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-base leading-relaxed"
            />
            <div className="flex items-center gap-4">
              <Button
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
                className="flex-1 md:flex-initial bg-gradient-primary hover:opacity-90 transition-all shadow-glow hover:shadow-accent-glow disabled:opacity-50 text-base font-bold px-10 h-12"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creating Magic...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-5 w-5" />
                    Generate Image
                  </>
                )}
              </Button>
              {generatedImages.length > 0 && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setGeneratedImages([]);
                    setPrompt("");
                  }}
                  className="border-primary/30 hover:bg-primary/10"
                >
                  Clear All
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Loading Animation */}
        {isGenerating && (
          <div className="flex flex-col items-center justify-center py-24 animate-fade-in">
            <div className="relative">
              <div className="w-24 h-24 border-4 border-primary/20 border-t-primary rounded-full animate-spin shadow-glow"></div>
              <Wand2 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-10 w-10 text-primary animate-pulse" />
            </div>
            <p className="mt-8 text-lg font-medium text-muted-foreground">Crafting your vision...</p>
            <p className="mt-2 text-sm text-muted-foreground/70">This may take a moment</p>
          </div>
        )}

        {/* Generated Images Grid */}
        {generatedImages.length > 0 && !isGenerating && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <div className="w-1.5 h-8 bg-gradient-primary rounded-full"></div>
                Your Creations
                <span className="text-sm font-normal text-muted-foreground">({generatedImages.length})</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              {generatedImages.map((image, index) => (
                <Card
                  key={index}
                  className="overflow-hidden group hover:shadow-accent-glow transition-all duration-500 border-primary/30 bg-card"
                >
                  <div className="relative aspect-square bg-muted/30">
                    <img
                      src={image.url}
                      alt={`Generated ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-6">
                      <div className="flex gap-3 w-full">
                        <Button
                          onClick={() => handleDownload(image.url, index)}
                          className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow font-semibold"
                          size="lg"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                      </div>
                    </div>
                    <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-border">
                      <span className="text-xs font-medium text-foreground">#{index + 1}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Features Section */}
        {generatedImages.length === 0 && !isGenerating && (
          <div className="mt-20">
            <h2 className="text-3xl font-bold mb-12 text-center text-foreground">
              Powerful AI Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Text to Image",
                  description: "Transform your ideas into stunning visuals with advanced AI",
                  icon: Wand2,
                },
                {
                  title: "Style Control",
                  description: "Fine-tune artistic styles and visual aesthetics",
                  icon: ImageIcon,
                },
                {
                  title: "High Resolution",
                  description: "Generate premium quality images ready for any use",
                  icon: Wand2,
                },
              ].map((feature, index) => (
                <Card
                  key={index}
                  className="p-8 bg-card border-primary/20 hover:border-primary/40 transition-all hover:shadow-card group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-primary opacity-5 rounded-full -mr-16 -mt-16"></div>
                  <div className="relative">
                    <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center mb-6 shadow-glow group-hover:shadow-accent-glow transition-all">
                      <feature.icon className="h-7 w-7 text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-foreground">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-32 py-12 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow">
                <Wand2 className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <span className="text-lg font-bold text-foreground block">Fluxora</span>
                <span className="text-xs text-muted-foreground">AI Image Studio</span>
              </div>
            </div>
            <div className="text-center text-sm text-muted-foreground">
              <p>© 2025 Fluxora. Powered by FLUX.1-Schnell Technology.</p>
              <p className="text-xs mt-1">Create stunning images with lightning-fast AI</p>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                Active
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
