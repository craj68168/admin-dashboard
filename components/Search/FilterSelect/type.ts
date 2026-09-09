export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterSelectProps {
  label: string;
  value: string;
  options: FilterOption[];
  placeholder?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}

export interface UseFilterSelectProps {
  onChange: (value: string) => void;
}