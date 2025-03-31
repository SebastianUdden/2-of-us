import { useEffect, useRef } from "react";

import { ANIMATION } from "../task-card/constants";

interface CardProps {
  id: string;
  type: "task" | "list";
  children: React.ReactNode;
  isAnimating?: boolean;
  isCollapsed?: boolean;
  onHeightChange?: (height: number) => void;
  className?: string;
  expandedId?: string | null;
  onExpand?: (id: string | null) => void;
}

const Card = ({
  id,
  type,
  children,
  isAnimating = false,
  isCollapsed = false,
  onHeightChange,
  className = "",
  expandedId,
  onExpand,
}: CardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  // Handle height changes
  useEffect(() => {
    if (!isAnimating && cardRef.current && onHeightChange) {
      onHeightChange(cardRef.current.offsetHeight);
    }
  }, [isAnimating, onHeightChange]);

  // Handle auto-scrolling when expanded
  useEffect(() => {
    if (expandedId === id && cardRef.current) {
      const card = cardRef.current;
      card.style.scrollMargin = "50vh";
      card.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [expandedId, id]);

  return (
    <div
      ref={cardRef}
      id={id}
      className={`
        border ${
          `${type}-${expandedId}` === id ? "border-gray-600" : "border-gray-700"
        } rounded-lg 
        transition-all duration-${ANIMATION.DURATION} ${ANIMATION.EASING}
        ${isAnimating ? "bg-gray-700" : "bg-gray-800"}
        ${
          `${type}-${expandedId}` === id
            ? "bg-opacity-70 bg-slate-900"
            : "bg-opacity-100"
        }
        ${
          isAnimating
            ? isCollapsed
              ? "animate-collapse"
              : "animate-fade-in"
            : ""
        }
        ${isCollapsed ? "opacity-0" : "opacity-100"}
        mx-auto px-4 py-4
        origin-top
        overflow-hidden
        w-full
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;
