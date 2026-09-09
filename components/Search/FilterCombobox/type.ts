export interface FilterComboboxOption {
  label: string;
  value: string;
}

export interface FilterComboboxProps {
  label: string;
  value: string;
  options: FilterComboboxOption[];

  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;

  onChange: (value: string) => void;
}

export interface UseFilterComboboxProps {
  value: string;
  options: FilterComboboxOption[];
  onChange: (value: string) => void;
}