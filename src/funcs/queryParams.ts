import type { useRouter } from "next/navigation";

type RouterMethod = keyof Pick<
  ReturnType<typeof useRouter>,
  "push" | "replace"
>;
type QueryValue = string | number | Array<string | number> | undefined;

type RouterNavigateOptions = Parameters<
  ReturnType<typeof useRouter>["push"]
>[1];

type UpdateQueryParamsArgs = {
  set?: Record<string, QueryValue>;
  delete?: string[];
  method?: RouterMethod;
  options?: RouterNavigateOptions;
};

function getQueryParams(
  searchParams: URLSearchParams,
): Record<string, QueryValue> {
  const result: Record<string, string | string[]> = {};

  for (const [key, value] of searchParams.entries()) {
    if (key in result) {
      const current = result[key];
      result[key] = Array.isArray(current)
        ? [...current, value]
        : [current, value];
    } else {
      result[key] = value;
    }
  }

  return result;
}

function updateQueryParams(
  router: ReturnType<typeof useRouter>,
  pathname: string,
  searchParams: URLSearchParams,
  args: UpdateQueryParamsArgs,
) {
  const {
    set = {},
    delete: deleteKeys = [],
    method = "replace",
    options,
  } = args;

  const params = new URLSearchParams(searchParams.toString());

  deleteKeys.forEach((key) => params.delete(key));

  Object.entries(set).forEach(([key, value]) => {
    params.delete(key);

    if (value == null) return;

    if (Array.isArray(value)) {
      value.forEach((v) => {
        params.append(key, String(v));
      });
    } else {
      params.set(key, String(value));
    }
  });

  const queryString = params.toString();
  const url = queryString ? `${pathname}?${queryString}` : pathname;

  router[method](url, options);
}

export { getQueryParams, updateQueryParams };
