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
  expandAll?: boolean;
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
  expandAll,
}: CardProps) => {
  const typeId = `${type}-${expandedId}`;
  const cardRef = useRef<HTMLDivElement>(null);

  // Handle height changes
  useEffect(() => {
    if (!isAnimating && cardRef.current && onHeightChange) {
      onHeightChange(cardRef.current.offsetHeight);
    }
  }, [isAnimating, onHeightChange]);

  // Handle auto-scrolling when expanded
  useEffect(() => {
    if (!expandAll && typeId === id && cardRef.current) {
      const card = cardRef.current;
      card.style.scrollMargin = "50vh";
      card.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [typeId, id, expandAll]);

  return (
    <div
      ref={cardRef}
      id={id}
      className={`
        border ${
          typeId === id ? "border-gray-600" : "border-gray-700"
        } rounded-lg 
        transition-all duration-${ANIMATION.DURATION} ${ANIMATION.EASING}
        ${isAnimating ? "bg-gray-700" : "bg-gray-800"}
        ${typeId === id ? "bg-opacity-70 bg-slate-900" : "bg-opacity-100"}
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
