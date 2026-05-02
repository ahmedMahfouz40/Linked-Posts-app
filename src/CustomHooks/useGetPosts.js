import axios from "axios";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import getHeaderObject from "../utils/headerObject";

function useGet(
  queryKey,
  endPoint,
  isEnabled = true,
  staleTime = 1000 * 60 * 5,
  options = {},
) {
  const { data, isError, isFetched, isLoading, isFetching } = useQuery({
    queryKey,
    queryFn: () =>
      axios.get(
        `https://route-posts.routemisr.com/${endPoint}`,
        getHeaderObject(),
      ),
    enabled: isEnabled,
    refetchOnWindowFocus: false,
    staleTime,
    placeholderData: keepPreviousData,
    ...options,
  });

  return { data, isError, isFetched, isLoading, isFetching };
}

export default useGet;
