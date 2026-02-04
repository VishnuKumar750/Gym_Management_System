import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

type TypeaheadSearchProps = {
  onSearch: (value: string) => void;
  placeholder?: string;
  queryKey?: string; // url param key
  debounceMs?: number;
};

export default function TypeaheadSearch({
  onSearch,
  placeholder = "Search...",
  queryKey = "search",
  debounceMs = 400,
}: TypeaheadSearchProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialValue = searchParams.get(queryKey) ?? "";
  const [value, setValue] = useState(initialValue);

  const debouncedValue = useDebounce(value, debounceMs);

  useEffect(() => {
    onSearch(debouncedValue);

    const params = new URLSearchParams(searchParams);

    if (debouncedValue) {
      params.set(queryKey, debouncedValue);
    } else {
      params.delete(queryKey);
    }

    setSearchParams(params, { replace: true });
  }, [debouncedValue]);

  return (
    <div className="relative">
      <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="pl-9"
      />
    </div>
  );
}
