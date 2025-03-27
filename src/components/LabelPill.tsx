import { LabelState } from "../types/LabelState";

interface LabelPillProps {
  label: string;
  onClick?: () => void;
  state: LabelState;
  count?: number;
}

export const LabelPill = ({ label, onClick, state, count }: LabelPillProps) => {
  const getStateStyles = () => {
    switch (state) {
      case LabelState.SHOW_ONLY:
        return "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30";
      case LabelState.SHOW_OTHERS:
        return "bg-purple-500/20 text-purple-400 hover:bg-purple-500/30";
      default:
        return "bg-gray-700/50 text-gray-300 hover:bg-gray-600/70";
    }
  };

  return (
    <button
      onClick={onClick}
      className={`px-2 py-1 text-xs font-medium rounded-lg transition-colors flex items-center gap-1 ${getStateStyles()}`}
    >
      {label}
      {count !== undefined && (
        <span className="text-xs opacity-75">({count})</span>
      )}
    </button>
  );
};
