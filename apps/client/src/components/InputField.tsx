type InputFieldProps = {
  label: string;
  id: string;
  name: string;
  type?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
};

const InputField = ({
  label,
  id,
  name,
  type = "text",
  onChange,
  value,
}: InputFieldProps) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        className="mt-1 w-full rounded-md border p-2 text-black transition-colors duration-300 focus:border-gray-200 focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 focus:outline-none"
        id={id}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default InputField;
