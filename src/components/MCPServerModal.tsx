import { useState } from "react";
import { X, Star, Heart, Github, Copy, Check, BadgeCheck, Crown, Package } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MCPServer } from "./MCPServerCard";

interface MCPServerModalProps {
  server: MCPServer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MCPServerModal = ({ server, open, onOpenChange }: MCPServerModalProps) => {
  const [copied, setCopied] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  if (!server) return null;

  // Generate installation code based on available package info
  const packageName = server.npmPackage || `@${server.slug}/mcp-server`;
  const installationCode = `{
  "mcpServers": {
    "${server.slug}": {
      "command": "npx",
      "args": ["-y", "${packageName}"]
    }
  }
}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(installationCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0 gap-0 bg-card border-border">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-card border-b border-border p-6 flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-3xl font-bold text-foreground">{server.name}</h2>
              {server.isVerified && (
                <BadgeCheck className="h-6 w-6 text-primary" title="Verified by Anthropic" />
              )}
              {server.isFeatured && (
                <Crown className="h-6 w-6 text-yellow-500" title="Featured Server" />
              )}
            </div>
            <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
              <span>by {server.author}</span>
              <span>•</span>
              <Badge variant="secondary">{server.category}</Badge>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => window.open(server.githubUrl, '_blank')}
              >
                <Github className="h-4 w-4" />
                GitHub
              </Button>
              {server.npmPackage && (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => window.open(`https://www.npmjs.com/package/${server.npmPackage}`, '_blank')}
                >
                  <Package className="h-4 w-4" />
                  npm
                </Button>
              )}
              {server.repoStars && (
                <div className="flex items-center gap-1 text-sm" title="Stars for the entire MCP servers repository">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <span className="font-semibold">{server.repoStars.toLocaleString()} repo stars</span>
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="gap-2"
                onClick={() => setIsFavorite(!isFavorite)}
              >
                <Heart className={`h-4 w-4 ${isFavorite ? 'fill-destructive text-destructive' : ''}`} />
                {isFavorite ? 'Favorited' : 'Add to favorites'}
              </Button>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="shrink-0"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Description */}
          <div>
            <h3 className="text-xl font-semibold mb-3 text-foreground">About</h3>
            <div className="space-y-3 text-muted-foreground">
              <p>{server.longDescription || server.description}</p>
              {server.tags && server.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {server.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Installation */}
          <div>
            <h3 className="text-xl font-semibold mb-3 text-foreground">Installation</h3>
            <div className="relative">
              <pre className="bg-secondary border border-border rounded-lg p-4 overflow-x-auto text-sm">
                <code className="text-foreground">{installationCode}</code>
              </pre>
              <Button
                variant="outline"
                size="sm"
                className="absolute top-2 right-2 gap-2"
                onClick={handleCopy}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Example Usage */}
          <div>
            <h3 className="text-xl font-semibold mb-3 text-foreground">Example Usage</h3>
            <ul className="space-y-2 text-muted-foreground list-disc list-inside">
              <li>Query and manage your data with natural language commands</li>
              <li>Automate workflows by connecting to external services</li>
              <li>Access real-time information and integrate with your existing tools</li>
              <li>Build custom integrations tailored to your specific needs</li>
              <li>Leverage AI capabilities to enhance productivity and efficiency</li>
            </ul>
          </div>

          {/* User Rating */}
          {server.rating && (
            <div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">User Rating</h3>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= Math.round(server.rating!) ? 'fill-primary text-primary' : 'text-muted-foreground'
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm text-muted-foreground">({server.rating.toFixed(1)} out of 5)</span>
              </div>
            </div>
          )}

          {/* Report Issue */}
          <div className="pt-4 border-t border-border">
            <a
              href={`${server.githubUrl.replace(/\/tree\/.*$/, '')}/issues`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground underline transition-smooth"
            >
              Report an issue with this server
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MCPServerModal;
