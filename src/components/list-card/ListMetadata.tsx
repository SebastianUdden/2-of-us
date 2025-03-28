import { LabelPill } from "../LabelPill";
import { LabelState } from "../../types/LabelState";

interface ListMetadataProps {
  labels?: string[];
  selectedLabel?: string;
  onLabelClick: (label: string) => void;
  createdAt: Date;
  updatedAt: Date;
}

const ListMetadata = ({
  labels,
  selectedLabel,
  onLabelClick,
  createdAt,
  updatedAt,
}: ListMetadataProps) => {
  return (
    <>
      <div className="flex items-center gap-2 mt-2">
        {labels?.map((label) => (
          <LabelPill
            key={label}
            label={label}
            onClick={() => onLabelClick(label)}
            state={
              selectedLabel === label
                ? LabelState.SHOW_ONLY
                : LabelState.SHOW_ALL
            }
          />
        ))}
      </div>
      <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
        <span>Created: {new Date(createdAt).toLocaleDateString()}</span>
        <span>Updated: {new Date(updatedAt).toLocaleDateString()}</span>
      </div>
    </>
  );
};

export default ListMetadata;
