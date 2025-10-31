import { useState, useRef } from "react";
import { Upload, AlertCircle, CheckCircle2, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ status: string; confidence: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Configure your backend API URL here
  const API_URL = "http://localhost:8000/predict";

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    setSelectedImage(file);
    setResult(null);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const detectDefect = async () => {
    if (!selectedImage) {
      toast({
        title: "No image selected",
        description: "Please upload an image first",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedImage);

      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
      
      toast({
        title: "Analysis complete",
        description: `Confidence: ${(data.confidence * 100).toFixed(1)}%`,
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to analyze image. Please check if the backend is running.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setPreviewUrl("");
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/30">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-primary mb-4 shadow-elevated">
            <AlertCircle className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-3">
            Pipe Defect Detection System
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Advanced AI-powered analysis for industrial pipe X-ray inspection
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Upload Section */}
          <Card className="shadow-card border-border/50 animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-primary" />
                Upload X-ray Image
              </CardTitle>
              <CardDescription>
                Drag and drop an X-ray image or click to browse
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`relative border-2 border-dashed rounded-lg p-8 transition-all ${
                  isDragging
                    ? "border-primary bg-primary/5 scale-[1.02]"
                    : "border-border hover:border-primary/50 hover:bg-muted/30"
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                
                <div className="text-center">
                  <Upload className={`w-12 h-12 mx-auto mb-4 transition-colors ${
                    isDragging ? "text-primary" : "text-muted-foreground"
                  }`} />
                  <p className="text-sm text-foreground font-medium mb-1">
                    {isDragging ? "Drop image here" : "Click to upload or drag and drop"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG, JPEG up to 10MB
                  </p>
                </div>
              </div>

              {selectedImage && (
                <div className="mt-4 flex items-center justify-between p-3 bg-secondary rounded-lg animate-fade-in">
                  <span className="text-sm font-medium truncate flex-1">
                    {selectedImage.name}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearImage}
                    className="ml-2"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Preview Section */}
          {previewUrl && (
            <Card className="shadow-card border-border/50 animate-slide-up">
              <CardHeader>
                <CardTitle>Image Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative rounded-lg overflow-hidden bg-secondary/30 border border-border">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-auto max-h-96 object-contain"
                  />
                </div>
                
                <Button
                  onClick={detectDefect}
                  disabled={isLoading}
                  className="w-full mt-4 bg-gradient-primary hover:opacity-90 transition-opacity"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-5 h-5 mr-2" />
                      Detect Defect
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Loading State */}
          {isLoading && (
            <Card className="shadow-elevated border-primary/20 animate-slide-up">
              <CardContent className="py-12">
                <div className="text-center">
                  <div className="relative w-20 h-20 mx-auto mb-4">
                    <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin"></div>
                  </div>
                  <p className="text-lg font-medium">Processing image...</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    AI is analyzing the X-ray for defects
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Result Section */}
          {result && !isLoading && (
            <Card className={`shadow-elevated animate-slide-up ${
              result.status === "defect detected" 
                ? "border-destructive/50 bg-destructive/5" 
                : "border-success/50 bg-success/5"
            }`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  {result.status === "defect detected" ? (
                    <>
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-destructive/10">
                        <AlertCircle className="w-6 h-6 text-destructive" />
                      </div>
                      <span className="text-destructive">Defective Pipe Detected</span>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-success/10">
                        <CheckCircle2 className="w-6 h-6 text-success" />
                      </div>
                      <span className="text-success">No Defect Detected</span>
                    </>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Confidence Level</span>
                    <span className="text-lg font-bold">
                      {(result.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-1000 ease-out ${
                        result.status === "defect detected" 
                          ? "bg-gradient-to-r from-destructive to-destructive/80" 
                          : "bg-gradient-to-r from-success to-success/80"
                      }`}
                      style={{ width: `${result.confidence * 100}%` }}
                    />
                  </div>
                </div>

                <div className={`p-4 rounded-lg ${
                  result.status === "defect detected" 
                    ? "bg-destructive/10 border border-destructive/20" 
                    : "bg-success/10 border border-success/20"
                }`}>
                  <p className="text-sm">
                    {result.status === "defect detected" 
                      ? "⚠️ The AI model has detected potential defects in the pipe. Further inspection is recommended."
                      : "✅ The pipe appears to be in good condition with no significant defects detected."}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Footer Info */}
        <div className="text-center mt-12 text-sm text-muted-foreground">
          <p>Powered by PyTorch AI Model • Real-time Analysis</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
