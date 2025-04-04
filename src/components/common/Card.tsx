import { useEffect, useRef } from "react";

import { ANIMATION } from "../task-card/constants";

interface CardProps {
  id: string;
  type: "task" | "list";
  children: React.ReactNode;
  isCollapsed?: boolean;
  className?: string;
  expandedId?: string | null;
  expandAll?: boolean;
}

const Card = ({
  id,
  type,
  children,
  isCollapsed = false,
  className = "",
  expandedId,
  expandAll,
}: CardProps) => {
  const typeId = `${type}-${expandedId}`;
  const cardRef = useRef<HTMLDivElement>(null);

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
        ${
          typeId === id && isCollapsed
            ? "bg-gray-600 bg-opacity-50"
            : "bg-gray-800 bg-opacity-100"
        }
        ${typeId === id ? "bg-opacity-70 bg-slate-900" : "bg-opacity-100"}
        mx-auto p-3
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
