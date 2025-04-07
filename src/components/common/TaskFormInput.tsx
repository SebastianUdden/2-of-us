interface TaskFormInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: "text" | "textarea";
  rows?: number;
  ref?: React.RefObject<HTMLInputElement | HTMLTextAreaElement>;
  autoFocus?: boolean;
}

const TaskFormInput = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  rows = 4,
  ref,
  autoFocus,
}: TaskFormInputProps) => {
  const commonClasses =
    "mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2";

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-300 mb-2"
      >
        {label}
      </label>
      {type === "textarea" ? (
        <textarea
          ref={ref as React.RefObject<HTMLTextAreaElement>}
          id={id}
          rows={rows}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={commonClasses}
          placeholder={placeholder}
          autoFocus={autoFocus}
        />
      ) : (
        <input
          ref={ref as React.RefObject<HTMLInputElement>}
          type="text"
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={commonClasses}
          placeholder={placeholder}
          autoFocus={autoFocus}
        />
      )}
    </div>
  );
};

export default TaskFormInput;
