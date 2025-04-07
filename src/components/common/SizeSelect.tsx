interface SizeSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const SizeSelect = ({ value, onChange }: SizeSelectProps) => {
  return (
    <div>
      <label
        htmlFor="size"
        className="block text-sm font-medium text-gray-300 mb-2"
      >
        Storlek
      </label>
      <select
        id="size"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
      >
        <option value="">Storlek</option>
        <option value="XS">XS</option>
        <option value="S">S</option>
        <option value="M">M</option>
        <option value="L">L</option>
        <option value="XL">XL</option>
      </select>
    </div>
  );
};

export default SizeSelect;
