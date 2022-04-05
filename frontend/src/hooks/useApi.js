import { useState } from 'react';
import { getToken } from '../utils/storage';

const URL_BASE = 'https://api.hector.fun';

// serializeForUri({ param0: 'value 0', param1: 'value:1' }) ===
// 'param0=value%200&param1=value%3A1'
function serializeForUri(obj = {}) {
  return Object
    .keys(obj)
    .map((key) => `${encodeURI(key)}=${encodeURI(obj[key])}`)
    .join('&');
}

async function apiFetch({
  body,
  headers,
  method,
  params = {},
  url,
}) {
  let rest = {};
  const token = await getToken();

  if (method === 'POST') {
    rest = { body: JSON.stringify(body) }
  }

  return fetch(`${URL_BASE}/${url}?${serializeForUri(params)} `, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...headers,
    },
    ...rest,
  });
};

const useApiPost = ({ headers = {}, method = "POST", url } = {}) => {
  const [result, setResult] = useState(null);
  const [isLoading, setLoading] = useState(false);
  let wrapperData = {};

  const post = async ({ body, path, params = {} }) => {
    setLoading(true);

    try {
      const request = await apiFetch({
        body,
        headers,
        url: path || url,
        params,
        method,
      });
      const data = request.status === 200 ? await request.json() : null;

      wrapperData = {
        isValid: request.ok,
        status: request.status,
        data,
      };
    } catch (error) {
      wrapperData = {
        data: null,
        message: error.message,
        isValid: false,
        status: 500,
      };
    }

    setLoading(false);
    setResult(wrapperData);

    return wrapperData
  };

  return [result, post, isLoading];
};

const useApiGet = ({ headers = {}, url }) => {
  const [result, setResult] = useState(null);
  const [isLoading, setLoading] = useState(false);
  let wrapperData;

  const get = async ({ params } = {}) => {
    setLoading(true);

    try {
      const request = await apiFetch({ params, headers, url, method: 'GET' });
      const data = request.status === 200 ? await request.json() : null;

      wrapperData = {
        isValid: request.ok,
        status: request.status,
        data,
      };

    } catch (error) {
      wrapperData = {
        data: null,
        isValid: false,
        menssage: error.menssage,
        status: 500,
      };
    }

    setLoading(false);
    setResult(wrapperData);

    return wrapperData;
  };

  return [result, get, isLoading];
};

export { useApiPost, useApiGet };
