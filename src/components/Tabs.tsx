import { useEffect, useRef, useState } from "react";

import { ANIMATION } from "./task-card/constants";
import { ArchiveIcon } from "./icons/ArchiveIcon";
import { CheckmarkIcon } from "./icons/CheckmarkIcon";
import { DocumentIcon } from "./icons/DocumentIcon";
import { useAuth } from "../context/AuthContext";

interface TabsProps {
  view: "todos" | "archive" | "lists" | "docs";
  onViewChange: (view: "todos" | "archive" | "lists" | "docs") => void;
  counts: {
    todos: number;
    archive: number;
    lists: number;
    docs: number;
  };
}

const Tabs = ({ view, onViewChange, counts }: TabsProps) => {
  const { user } = useAuth();
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const index =
      view === "todos" ? 0 : view === "archive" ? 1 : view === "lists" ? 2 : 3;
    setActiveTabIndex(index);
  }, [view]);

  return (
    <div className="relative flex border-b border-gray-700">
      <div
        className="absolute bottom-0 h-0.5 bg-blue-400 transition-all duration-300 ease-in-out"
        style={{
          width: tabsRef.current[activeTabIndex]?.offsetWidth || 0,
          left: tabsRef.current[activeTabIndex]?.offsetLeft || 0,
        }}
      />
      {user && (
        <button
          ref={(el) => {
            tabsRef.current[0] = el;
          }}
          onClick={() => onViewChange("todos")}
          className={`
          mr-4 py-2 text-sm font-medium transition-colors duration-${
            ANIMATION.DURATION
          } ${ANIMATION.EASING}
          flex items-center gap-2 justify-start
          ${
            view === "todos"
              ? "text-blue-400"
              : "text-gray-400 hover:text-gray-300"
          }
        `}
        >
          <CheckmarkIcon className="w-5 h-5" />
          <span>Att göra</span>
          <span className="text-xs bg-gray-700 px-2 py-0.5 rounded-full">
            {counts.todos}
          </span>
        </button>
      )}
      {user && (
        <button
          ref={(el) => {
            tabsRef.current[1] = el;
          }}
          onClick={() => onViewChange("archive")}
          className={`
          mr-4 py-2 text-sm font-medium transition-colors duration-${
            ANIMATION.DURATION
          } ${ANIMATION.EASING}
          flex items-center gap-2 justify-start
          ${
            view === "archive"
              ? "text-blue-400"
              : "text-gray-400 hover:text-gray-300"
          }
        `}
        >
          <ArchiveIcon className="w-5 h-5" />
          <span>Arkiv</span>
          <span className="text-xs bg-gray-700 px-2 py-0.5 rounded-full">
            {counts.archive}
          </span>
        </button>
      )}
      {/* <button
        ref={(el) => {
          tabsRef.current[2] = el;
        }}
        onClick={() => onViewChange("lists")}
        className={`
          mr-4 py-2 text-sm font-medium transition-colors duration-${
            ANIMATION.DURATION
          } ${ANIMATION.EASING}
          flex items-center gap-2 justify-start
          ${
            view === "lists"
              ? "text-blue-400"
              : "text-gray-400 hover:text-gray-300"
          }
        `}
      >
        <ListIcon className="w-4 h-4" />
        <span>Listor</span>
        <span className="text-xs bg-gray-700 px-2 py-0.5 rounded-full">
          {counts.lists}
        </span>
      </button> */}
      <button
        ref={(el) => {
          tabsRef.current[3] = el;
        }}
        onClick={() => onViewChange("docs")}
        className={`
          py-2 text-sm font-medium transition-colors duration-${
            ANIMATION.DURATION
          } ${ANIMATION.EASING}
          flex items-center gap-2 justify-start
          ${
            view === "docs"
              ? "text-blue-400"
              : "text-gray-400 hover:text-gray-300"
          }
        `}
      >
        <DocumentIcon className="w-4 h-4" />
        <span>Docs</span>
      </button>
    </div>
  );
};

export default Tabs;
