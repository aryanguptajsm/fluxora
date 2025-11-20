import { useState } from "react";
import { Wand2, Loader2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

const Index = () => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    // Simulate AI generation delay
    setTimeout(() => {
      setGeneratedImages([
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800",
        "https://images.unsplash.com/photo-1618556450994-a6a128ef0d9d?w=800",
        "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800",
        "https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?w=800",
      ]);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <header className="relative overflow-hidden border-b border-border bg-gradient-hero">
        <div className="absolute inset-0 bg-background/50 backdrop-blur-3xl"></div>
        <div className="relative container mx-auto px-4 py-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 border border-primary/20 mb-6 backdrop-blur-sm">
            <Wand2 className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground">AI-Powered Image Generation</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            Create Stunning Images
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Transform your imagination into reality with advanced AI technology
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Prompt Input Section */}
        <Card className="p-6 md:p-8 mb-12 bg-card/50 backdrop-blur-sm border-primary/20 shadow-card">
          <div className="space-y-4">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-primary" />
              Describe your image
            </label>
            <Textarea
              placeholder="A futuristic city at sunset with flying cars and neon lights..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[120px] resize-none bg-background/50 border-input focus:border-primary focus:ring-primary transition-all"
            />
            <Button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating}
              className="w-full md:w-auto bg-gradient-primary hover:opacity-90 transition-all shadow-glow hover:shadow-accent-glow disabled:opacity-50"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating...
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
          <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              <Wand2 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-primary animate-glow-pulse" />
            </div>
            <p className="mt-6 text-muted-foreground">Creating your masterpiece...</p>
          </div>
        )}

        {/* Generated Images Grid */}
        {generatedImages.length > 0 && !isGenerating && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold mb-6 text-foreground">Generated Images</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {generatedImages.map((image, index) => (
                <Card
                  key={index}
                  className="overflow-hidden group hover:shadow-accent-glow transition-all duration-300 border-primary/20"
                >
                  <div className="relative aspect-square">
                    <img
                      src={image}
                      alt={`Generated ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="bg-card/90 backdrop-blur-sm"
                      >
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {[
              {
                title: "Image Generation",
                description: "Create unique images from text prompts",
                icon: Wand2,
              },
              {
                title: "Image-to-Image",
                description: "Transform existing images with AI",
                icon: ImageIcon,
              },
              {
                title: "Logo Maker",
                description: "Design professional logos instantly",
                icon: Wand2,
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="p-6 bg-card/30 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-all hover:shadow-card group"
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4 shadow-glow group-hover:shadow-accent-glow transition-all">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-20 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2024 Fluxora. Powered by Advanced AI Technology.
        </div>
      </footer>
    </div>
  );
};

export default Index;
