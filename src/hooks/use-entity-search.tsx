import { PAGINATION } from "@/config/constants";
import { use, useEffect, useState } from "react";
import { set } from "zod";

interface UseEntitySearchProps<T extends {
  search: string;
  page: number;
}> {
  params: T;
  setParams: (params: T) => void;
  debounceMs?: number;
}

export function useEntitySearch<T extends {
  search: string;
  page: number;
}> ({
  params,
  setParams,
  debounceMs = 500
}: UseEntitySearchProps<T>) {
  const [localearch, setLocalSearch] = useState(params.search);

  useEffect(() => {
    if(localearch === "" && params.search !== ""){
      setParams({
        ...params,
        search: "",
        page: PAGINATION.DEFAULT_PAGE
      })
      return;
    }

    const timer = setTimeout(() => {
      if(localearch !== params.search){
        setParams({
          ...params,
          search: localearch,
          page: PAGINATION.DEFAULT_PAGE
        })
      }
    }, debounceMs)

    return () => clearTimeout(timer);
  }, [localearch, params, setParams, debounceMs]);

  useEffect(() => {
    setLocalSearch(params.search);
  }, [params.search]);

  return {
    searchValue: localearch,
    onSearchChange:setLocalSearch
  }
}