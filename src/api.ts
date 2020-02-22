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
  status: string;
};

export type Types = {
  id: string;
  title: string;
};

export const API = {
  login: (b: Login) => request(b, "login"),
  checkSession: () => request({}, "check"),
  getChats: () => request<{ result: Chat[] }>({}, "get_chat_user"),
  getUser: () => request<{ result: User }>({}, "user"),
  getTypes: () => request<Types[]>({}, "type"),
  addChat: () => request({}, "add_chat"),
  editChat: (b: {
    id: string;
    title: string;
    about: string;
    end_event: string;
    type: string;
  }) => request(b, "edit_chat"),
  createUser: (b: {
    login: string;
    password: string;
    status: "0";
    type: string;
  }) => request(b, "sig_in")
};
