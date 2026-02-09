import api from "@/axios/axios-api";

// GET SUPPLEMENT
type SupplementQueryParams = {
  sort?: 1 | -1;
  isAvailable?: boolean;
  search?: string;
};

export const fetchSupplements = async ({
  sort,
  status,
  search,
}: {
  sort?: string | null;
  status?: string | null;
  search?: string | null;
}) => {
  const params: SupplementQueryParams = {};

  if (sort) params.sort = sort === "0" ? -1 : 1;
  if (status) params.isAvailable = status === "1";
  if (search) params.search = search;

  const { data } = await api.get("/supplement", {
    params,
    withCredentials: true,
  });

  return data.data;
};
