import fetch, { Response, RequestInfo, RequestInit } from 'node-fetch';

function toJson(response: Response) {
  return response.json();
}

export default async function<R = unknown>(url: RequestInfo, options: RequestInit) {
  const jsonHeaders = { 'Content-Type': 'application/json', Accept: 'application/json' };

  Object.assign(options, { headers: Object.assign(jsonHeaders, options.headers) });
  if (options.body) {
    Object.assign(options, { body: JSON.stringify(options.body) });
  }

  return fetch(url, options).then(toJson) as Promise<R>;
}
