import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Github, Twitter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Footer = () => {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast({
        title: "Subscribed!",
        description: "Thanks for subscribing to our newsletter.",
      });
      setEmail("");
    }
  };

  return (
    <footer className="border-t border-border bg-card mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Logo & Description */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">MCP</span>
              </div>
              <span className="text-xl font-bold text-foreground">MCP Hub</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Discover the best Model Context Protocol servers for Claude AI.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-3">Quick Links</h4>
            <div className="flex flex-col gap-2">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-smooth">
                About
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-smooth">
                Submit MCP
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-smooth inline-flex items-center gap-1">
                <Github className="h-3 w-3" />
                GitHub
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-smooth inline-flex items-center gap-1">
                <Twitter className="h-3 w-3" />
                Twitter
              </a>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold text-foreground mb-3">Newsletter</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Get notified about new MCP servers
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-secondary border-border"
                required
              />
              <Button type="submit" size="sm">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} MCP Hub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
