interface TitleEditFormProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  placeholder?: string;
}

export const TitleEditForm = ({
  value,
  onChange,
  onSubmit,
  placeholder = "Välj en titel...",
}: TitleEditFormProps) => {
  return (
    <form onSubmit={onSubmit} className="flex-1 flex gap-2 mr-6">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
        placeholder={placeholder}
      />
    </form>
  );
};
