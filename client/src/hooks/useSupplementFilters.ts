import { useSearchParams } from "react-router-dom";

export function useSupplementFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const sort = searchParams.get("sort");
  const status = searchParams.get("status");
  const search = searchParams.get("search");

  const setParam = (key: string, value?: string) => {
    const params = new URLSearchParams(searchParams);

    if (!value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    setSearchParams(params);
  };

  return { sort, status, search, setParam };
}
