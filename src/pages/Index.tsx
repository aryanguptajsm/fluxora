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
  const [generatedImages, setGeneratedImages] = useState<Array<{ url: string }>>([]);

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
        setGeneratedImages(Array.isArray(data.images) ? data.images : [data.images]);
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
        <div className="absolute inset-0 bg-gradient-hero opacity-20"></div>
        <div className="relative container mx-auto px-4 py-20 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-card border border-primary/30 mb-8 shadow-glow">
            <Wand2 className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-sm font-semibold text-primary">AI-Powered Image Generation</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-extrabold mb-6 bg-gradient-primary bg-clip-text text-transparent leading-tight">
            Fluxora Studio
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-4 leading-relaxed">
            Transform your imagination into stunning visuals with cutting-edge AI technology
          </p>
          <p className="text-sm text-muted-foreground/80">
            Powered by Bria FIBO AI Model
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Prompt Input Section */}
        <Card className="p-8 md:p-10 mb-16 bg-card border-primary/20 shadow-card relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-accent opacity-5"></div>
          <div className="relative space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow">
                <ImageIcon className="h-5 w-5 text-primary-foreground" />
              </div>
              <label className="text-lg font-semibold text-foreground">
                Describe Your Vision
              </label>
            </div>
            <Textarea
              placeholder="A majestic lion made of golden light, standing on a mountain peak at sunset, ethereal and powerful..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[140px] resize-none bg-background border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-base"
            />
            <Button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating}
              className="w-full md:w-auto bg-gradient-primary hover:opacity-90 transition-all shadow-glow hover:shadow-accent-glow disabled:opacity-50 text-base font-semibold px-8"
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
            <h2 className="text-3xl font-bold mb-8 text-foreground flex items-center gap-3">
              <div className="w-1 h-8 bg-gradient-primary rounded-full"></div>
              Your Creations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {generatedImages.map((image, index) => (
                <Card
                  key={index}
                  className="overflow-hidden group hover:shadow-accent-glow transition-all duration-500 border-primary/30 bg-card"
                >
                  <div className="relative aspect-square bg-muted">
                    <img
                      src={image.url}
                      alt={`Generated ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-6">
                      <Button
                        onClick={() => handleDownload(image.url, index)}
                        variant="secondary"
                        size="lg"
                        className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow font-semibold"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
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
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Wand2 className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold text-foreground">Fluxora</span>
            </div>
            <div className="text-center text-sm text-muted-foreground">
              © 2024 Fluxora. Powered by Bria FIBO AI Technology.
            </div>
            <div className="text-sm text-muted-foreground">
              Create • Imagine • Inspire
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
