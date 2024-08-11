import React from "react";

interface InputFormProps {
  addressInput: string;
  errors: string[];
  isLoading: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (event: React.FormEvent) => void;
}

export const InputForm: React.FC<InputFormProps> = ({
  addressInput,
  errors,
  isLoading,
  handleInputChange,
  handleSubmit,
}) => {
  const isInputEmpty = addressInput.trim() === "";

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <input
        type="text"
        placeholder="Please enter address separated by space"
        value={addressInput}
        onChange={handleInputChange}
        className="w-full p-2 border border-gray-300 rounded mb-4 bg-gray-600"
      />
      {errors.length > 0 && (
        <div className="text-red-500 mb-4">
          {errors.map((error, index) => (
            <p key={index}>{error}</p>
          ))}
        </div>
      )}
      <button
        type="submit"
        className={`w-full p-2 rounded ${
          isInputEmpty ? "bg-gray-400" : "bg-blue-500 text-white"
        }`}
        disabled={isInputEmpty || errors.length > 0 || isLoading}
      >
        {isLoading
          ? "Submitting..."
          : isInputEmpty
          ? "Please enter address"
          : "Submit"}
      </button>
    </form>
  );
};
