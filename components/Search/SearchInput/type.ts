export interface SearchInputProps {
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}