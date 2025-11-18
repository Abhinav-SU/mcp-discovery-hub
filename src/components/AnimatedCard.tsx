import { useEffect, useRef, useState } from "react";
import MCPServerCard, { MCPServer } from "./MCPServerCard";

interface AnimatedCardProps {
  server: MCPServer;
  onClick: () => void;
  index: number;
}

const AnimatedCard = ({ server, onClick, index }: AnimatedCardProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className={`transition-all duration-700 ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-8"
      }`}
      style={{
        transitionDelay: `${index * 50}ms`,
      }}
    >
      <MCPServerCard server={server} onClick={onClick} />
    </div>
  );
};

export default AnimatedCard;
