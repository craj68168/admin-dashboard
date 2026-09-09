import { ChangeEvent } from "react";

interface UseSearchInputProps {
  onChange: (value: string) => void;
}

export const useSearchInput = ({
  onChange,
}: UseSearchInputProps) => {
  const handleChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    onChange(event.target.value);
  };

  return {
    handleChange,
  };
};