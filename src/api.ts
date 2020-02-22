const apiurl = "/";

const request = <T = any>(body: Object, event: string) =>
  fetch(apiurl, {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      event,
      ...body
    })
  }).then(res => {
    if (!res.ok) {
      return Promise.reject(res);
    }
    return res.json() as Promise<T>;
  });

type Login = {
  login: string;
  password: string;
};
export type Chat = {
  id: string;
  type: string;
  status: string;
  title: string;
  about: string;
};

export type User = {
  login: string;
};

export const API = {
  login: (b: Login) => request(b, "login"),
  checkSession: () => request({}, "check"),
  getChats: () => request<{ result: Chat[] }>({}, "chats"),
  getUser: () => request<{ result: User }>({}, "user")
};
