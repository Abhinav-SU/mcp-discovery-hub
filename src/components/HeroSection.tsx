const HeroSection = () => {
  return (
    <div className="gradient-hero py-20 px-4 text-center border-b border-border">
      <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
        MCP Hub
      </h1>
      <p className="text-xl md:text-2xl text-muted-foreground">
        Discover the best MCP servers for Claude
      </p>
    </div>
  );
};

export default HeroSection;
