function httpClient<TData>(
  path: string, body?: any, additionalHeaders?: HeadersInit
): Promise<TData> {
  const headers = {
    ...additionalHeaders,
    'content-type': 'application/json',
    'X-Proxy': 'API',
  };

  return fetch(path, {
    method: 'POST',
    body: JSON.stringify(body || {}),
    headers: headers,
  }).then((response) => {
    if (response.status === 401) {
      alert('当前会话已失效，请重新登录!');
      window.location.href = window.location.href;
      return Promise.reject(new Error('当前会话已失效，请重新登录!'));
    }
    return response.json();
  }).then((resp) => {
    const { code, msg, data } = resp;
    if (code !== 0) {
      return Promise.reject(new Error(msg));
    }

    return data as TData;
  });
}

export default httpClient;
