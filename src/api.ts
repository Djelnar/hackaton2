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
  end_event: string;
  users?: User[];
};

export type User = {
  login: string;
  status: string;
  id: string;
  type: string;
};

export type Types = {
  id: string;
  title: string;
};

export type Message = {
  id: string;
  time: string;
  id_chat: string;
  id_user: string;
  text: string;
  type: string;
};

export const API = {
  login: (b: Login) => request(b, "login"),
  checkSession: () => request({}, "check"),
  getChats: () => request<{ result: Chat[] }>({}, "get_chat_user"),
  getUser: () => request<{ result: User }>({}, "user"),
  getUsers: () => request<{ result: User[] }>({}, "users"),
  editUser: (b: { type?: string; id: string }) => request<User>(b, "edit_user"),
  getTypes: () => request<Types[]>({}, "type"),
  addType: (value: string) => request({ title: value }, "add_type"),
  addChat: () => request({}, "add_chat"),
  sendMessage: (b: { mess: string; id_chat: string; type: string }) =>
    request(b, "send_mess"),
  conn_chat: (b: { id_user: string; id_chat: string }) =>
    request(b, "conn_chat"),
  update: () => request<{ result: Message[] }>({}, "update"),
  editChat: (b: {
    id: string;
    title?: string;
    about?: string;
    end_event?: string;
    type?: string;
    status?: string;
  }) => request(b, "edit_chat"),
  createUser: (b: {
    login: string;
    password: string;
    status: "0";
    type: string;
  }) => request(b, "sig_in")
};
