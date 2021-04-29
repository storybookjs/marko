import { document } from 'global';
import { parse } from 'qs';

export const getQueryParams = () => {
  // document.location is not defined in react-native
  if (document && document.location && document.location.search) {
    return parse(document.location.search, { ignoreQueryPrefix: true });
  }
  return {};
};

export const getQueryParam = (key: string) => {
  const params = getQueryParams();

  return params[key];
};
