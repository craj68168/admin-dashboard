"use client";

import {
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";

import {
  Locale,
  useLanguage,
} from "@/app/providers/language-provider";

export default function LanguageSwitcher() {
  const { locale, changeLanguage } = useLanguage();

  const handleChange = (event: SelectChangeEvent) => {
    changeLanguage(event.target.value as Locale);
  };

  return (
    <FormControl size="small">
      <Select
        value={locale}
        onChange={handleChange}
      >
        <MenuItem value="en">
          English
        </MenuItem>

        <MenuItem value="ja">
          日本語
        </MenuItem>
      </Select>
    </FormControl>
  );
}
