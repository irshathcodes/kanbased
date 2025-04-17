export async function get(url: string) {
  return fetch(`${import.meta.env.CLIENT_MY_API_BASE_URL}${url}`, {
    credentials: "include",
  });
}

export function post(url: string, body: unknown) {
  return fetch(`${import.meta.env.CLIENT_MY_API_BASE_URL}${url}`, {
    credentials: "include",
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });
}
