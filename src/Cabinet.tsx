import React, {
  useCallback,
  useState,
  useMemo,
  useEffect,
  useRef
} from "react";
import {
  makeStyles,
  Paper,
  Typography,
  Button,
  DialogTitle,
  Dialog,
  DialogContent,
  TextField,
  DialogActions,
  TableHead,
  TableRow,
  TableCell,
  Table,
  TableBody,
  Checkbox
} from "@material-ui/core";
import fileicon from "./file.png";
import sendicon from "./send.png";
import { useDebouncedValue } from "./useDebouncedValue";
import { API, Chat, User, Types } from "./api";

const WIDTH = 400;

const us = makeStyles(theme => ({
  field: {
    marginBottom: theme.spacing(1)
  },
  splitWrap: {
    display: "flex",
    alignItems: "stretch",
    justifyContent: "flex-start",
    height: "calc(100vh - 64px)"
  },
  chats: {
    overflowY: "auto",
    width: WIDTH,
    flex: `0 0 ${WIDTH}px`,
    borderRight: `1px solid ${theme.palette.primary.light}`,
    backgroundColor: theme.palette.primary.light,
    padding: theme.spacing(11.5, 1, 1),
    // padding: theme.spacing(11.5, 1, 10),
    position: "relative"
  },
  chatCard: {
    padding: theme.spacing(1),
    "&:not(:last-of-type)": {
      marginBottom: theme.spacing(1)
    },
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    cursor: "pointer"
  },
  avatar: {
    width: 48,
    height: 48,
    backgroundColor: theme.palette.error.main,
    borderRadius: 48
  },
  cardText: {
    marginLeft: theme.spacing(2)
  },
  main: {
    flex: `0 0 calc(100% - ${WIDTH}px)`,
    width: `calc(100% - ${WIDTH}px)`
  },
  chatbar: {
    backgroundColor: theme.palette.primary.light,
    padding: theme.spacing(2),
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "flex-start"
  },
  chatbardotdotdot: {
    marginLeft: "auto",
    fontSize: "48px",
    fontWeight: 700,
    lineHeight: "24px",
    alignSelf: "stretch",
    color: "white",
    cursor: "pointer"
  },
  topbarText: {
    marginLeft: theme.spacing(2),
    color: "white"
  },
  topbarTitle: {
    fontWeight: 700
  },
  archive: {
    position: "fixed",
    bottom: 0,
    left: 0,
    width: WIDTH,
    height: theme.spacing(10),
    backgroundColor: theme.palette.primary.dark,
    padding: theme.spacing(1)
  },
  archiveButton: {
    height: "100%",
    fontSize: 28
  },
  textateada: {
    width: "100%",
    resize: "none",
    height: "300px",
    ...theme.typography.body1
  },
  messages: {
    overflowY: "auto",
    padding: theme.spacing(2, 2, 15),
    position: "relative",
    height: "calc(100% - 84px)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start"
  },
  addgroupwrap: {
    display: "flex",
    alignItems: "flex-end",
    marginBottom: theme.spacing(5)
  },
  inputPaper: {
    position: "fixed",
    bottom: theme.spacing(1),
    right: theme.spacing(1),
    height: theme.spacing(6),
    width: `calc(100% - ${WIDTH}px - ${theme.spacing(2)}px)`,
    display: "flex"
  },
  input: {
    border: 0,
    outline: 0,
    fontSize: 22,
    flex: "0 1 100%",
    height: theme.spacing(6),
    padding: theme.spacing(1)
  },
  fileInput: {
    display: "none"
  },
  fileButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    cursor: "pointer"
  },
  sendButton: {
    border: 0,
    outline: 0,
    backgroundColor: "white",
    cursor: "pointer"
  },
  searchWrapper: {
    position: "fixed",
    height: 84,
    left: 0,
    top: 64,
    width: WIDTH,
    backgroundColor: theme.palette.primary.dark,
    padding: theme.spacing(1)
  },
  searchInput: {
    width: "100%",
    height: 68,
    fontSize: 24,
    padding: theme.spacing(0, 1)
  },
  cloud: {
    backgroundColor: "#eee",
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(2),
    minWidth: 200,
    width: "100%",
    maxWidth: 400,
    marginBottom: theme.spacing(2)
  },
  butrtohjsw: {
    position: "fixed",
    bottom: theme.spacing(9),
    right: theme.spacing(1),
    height: theme.spacing(6),
    width: `calc(100% - ${WIDTH}px - ${theme.spacing(2)}px)`,
    display: "flex",
    justifyContent: "space-evenly"
  },
  chbxc: {
    width: 48
  }
}));

const serviceChatsAdmin: Chat[] = [
  {
    id: "li4ny_kabinet_admin",
    title: "Личный кабинет",
    about: "Personal Dashboard",
    status: "999",
    type: "999"
  }
];

type ServiceChatsAdminDataMessagesTypes =
  | "stats"
  | "newUser"
  | "newGroup"
  | "movedUsers";

type ServiceChatsAdminDataMessage = {
  type: ServiceChatsAdminDataMessagesTypes;
  data: any;
  id: string;
};

type ServiceChatsAdminData = {
  [key: string]: {
    messages: ServiceChatsAdminDataMessage[];
  };
};

type Props = {
  user: User;
};

const afsfasf: ServiceChatsAdminData = {
  li4ny_kabinet_admin: {
    messages: [
      {
        type: "stats",
        id: "fevral2020",
        data: {
          date: "Февраль 2020",
          tasksGiven: 1499,
          tasksQualified: 1337
        }
      }
    ]
  }
};

const Cabinet: React.FC<Props> = ({ user }) => {
  const s = us();

  const handleSendMessage = useCallback<
    React.FormEventHandler<HTMLFormElement>
  >(e => {
    e.preventDefault();
  }, []);

  const [search, setSearch] = useState("");

  const debouncedSearch = useDebouncedValue(search, 300);

  const [chatsLoading, setChatsLoading] = useState(true);
  const [chats, setChats] = useState<Chat[]>([]);

  const chatsMap = useMemo(
    () =>
      chats.reduce<{ [key: string]: Chat }>(
        (acc, curr) => ({
          ...acc,
          [curr.id]: curr
        }),
        {}
      ),
    [chats]
  );

  const serviceChatsAdminMap = useMemo(
    () =>
      serviceChatsAdmin.reduce<{ [key: string]: Chat }>(
        (acc, curr) => ({
          ...acc,
          [curr.id]: curr
        }),
        {}
      ),
    []
  );

  const [currentOpen, setCurrentOpen] = useState<string | null>(null);

  const [currentOpenData, setCurrentOpenData] = useState<Chat | null>(null);
  const [currentOpenMessages, setCurrentOpenMessages] = useState<any>(null);
  const scrollref = useRef<HTMLDivElement>(null);

  const [serviceChatsAdminData, setServiceChatsAdminData] = useState<
    ServiceChatsAdminData
  >(afsfasf);

  const updateStats = useCallback(() => {
    setServiceChatsAdminData(s => {
      const lasts = s.li4ny_kabinet_admin.messages.filter(
        v => v.type === "stats"
      );
      const lasss = lasts[lasts.length - 1];

      const lasss2 = JSON.parse(JSON.stringify(lasss));

      lasss2.data = {
        ...lasss2.data,
        tasksGiven: lasss2.data.tasksGiven,
        tasksQualified: lasss2.data.tasksQualified
      };

      s.li4ny_kabinet_admin.messages.push(lasss2);

      const res = JSON.parse(JSON.stringify(s));

      return res;
    });
  }, []);

  useEffect(() => {
    setCurrentOpenData(
      currentOpen
        ? chatsMap[currentOpen] || serviceChatsAdminMap[currentOpen]
        : null
    );
    setCurrentOpenMessages(
      currentOpen ? serviceChatsAdminData[currentOpen] : null
    );
    setTimeout(() => {
      if (scrollref && scrollref.current) {
        scrollref.current!.scrollTo(0, scrollref.current!.scrollHeight);
      }
    }, 0);
  }, [
    chats,
    chatsMap,
    currentOpen,
    serviceChatsAdminData,
    serviceChatsAdminMap
  ]);

  const filteredArr = useMemo(
    () =>
      debouncedSearch
        ? chats.filter(
            v =>
              v.title.includes(debouncedSearch) ||
              v.about.includes(debouncedSearch) ||
              v.id.includes(debouncedSearch)
          )
        : chats,
    [chats, debouncedSearch]
  );

  useEffect(() => {
    setChatsLoading(true);
    API.getChats()
      .then(res => {
        setChats(res.result);
      })
      .finally(() => {
        setChatsLoading(false);
      });
  }, []);

  const [createTaskOpen, setCreateTaskOpen] = useState(false);

  const [types, setTypes] = useState<Types[]>([]);

  useEffect(() => {
    let id: number = -1;

    const cb = () => {
      API.getTypes().then(res => {
        setTypes(res);
      });
    };

    API.getTypes().then(res => {
      setTypes(res);
      id = (setInterval(cb, 3000) as unknown) as number;
    });

    return () => clearInterval(id);
  }, []);

  const [taskToAdd, setTaskToAdd] = useState("");

  const newTask = useCallback(() => {
    API.addChat().then(res => setTaskToAdd(res.result.id));

    setCreateTaskOpen(true);
  }, []);

  const handleSubmitNewTask = useCallback<
    React.FormEventHandler<HTMLFormElement>
  >(
    e => {
      e.preventDefault();
      //@ts-ignore
      const res = [...e.target.elements].map(e => e.value);

      API.editChat({
        id: taskToAdd,
        title: res[0],
        about: res[1],
        type: res[2],
        end_event: String(+new Date(res[3]) / 1000)
      }).then(() => {
        setCreateTaskOpen(false);
        setTaskToAdd("");
      });
    },
    [taskToAdd]
  );

  const [cuo, setCuo] = useState(false);
  const [cuoKey, setCuoKey] = useState(Math.random().toString());

  const closeCu = useCallback(() => {
    setCuo(false);
    setCuoKey(Math.random().toString());
  }, []);

  const handleSubmitNewUser = useCallback<
    React.FormEventHandler<HTMLFormElement>
  >(
    e => {
      e.preventDefault();
      //@ts-ignore
      const res = [...e.target.elements].map(e => e.value);

      API.createUser({
        login: res[0],
        password: res[1],
        type: res[2],
        status: "0"
      }).then(() => {
        setServiceChatsAdminData(s => {
          s.li4ny_kabinet_admin.messages.push({
            id: Math.random().toString(),
            type: "newUser",
            data: {
              login: res[0],
              password: res[1],
              type: res[2],
              status: "0"
            }
          });

          const res2 = JSON.parse(JSON.stringify(s));

          return res2;
        });
        closeCu();
      });
    },
    [closeCu]
  );

  // eslint-disable-next-line
  const mtypes = useMemo(() => types, [types.length]);

  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    API.getUsers().then(res => setUsers(res.result));
  }, []);

  const [ge, setGe] = useState(false);

  const [selectedG, setSelectedG] = useState("");

  useEffect(() => {
    setSelectedG(mtypes[0]?.id);
  }, [mtypes]);

  const selectedUsers = useMemo(
    () =>
      users.filter(
        u => String(u.type) === String(selectedG) && u.login !== "admin"
      ),
    [selectedG, users]
  );

  const rejectedUsers = useMemo(
    () =>
      users.filter(
        u => String(u.type) !== String(selectedG) && u.login !== "admin"
      ),
    [selectedG, users]
  );

  const [addGr, setAddGr] = useState("");

  const handleSubmitAddGr = useCallback(() => {
    API.addType(addGr).then(() => {
      setServiceChatsAdminData(s => {
        s.li4ny_kabinet_admin.messages.push({
          id: Math.random().toString(),
          type: "newGroup",
          data: {
            title: addGr
          }
        });

        const res2 = JSON.parse(JSON.stringify(s));

        return res2;
      });
      setAddGr("");
    });
  }, [addGr]);

  const [addUsersToGroupOpen, _setAddUsersToGroupOpen] = useState(false);

  const isAdmin = currentOpenData && currentOpenData.status === "999";

  const [checked, setChecked] = useState<{ [key: string]: boolean }>({});

  const toggleChecked = useCallback((id: string) => {
    setChecked(s => ({
      ...s,
      [id]: !s[id]
    }));
  }, []);

  const setAddUsersToGroupClosed = useCallback(() => {
    _setAddUsersToGroupOpen(false);
    setChecked({});
  }, []);

  const submitMove = useCallback(async () => {
    const res = Object.entries(checked)
      .filter(([key, value]) => value)
      .map(([key]) => key);

    const res2 = await Promise.all(
      res.map(id => API.editUser({ id, type: selectedG }))
    );

    API.getUsers().then(res => setUsers(res.result));

    setServiceChatsAdminData(s => {
      s.li4ny_kabinet_admin.messages.push({
        id: Math.random().toString(),
        type: "movedUsers",
        data: {
          names: res2.map(u => u.login).join(", "),
          newCat: types.find(t => t.id === selectedG)?.title
        }
      });

      const res3 = JSON.parse(JSON.stringify(s));

      return res3;
    });

    setAddUsersToGroupClosed();
  }, [checked, selectedG, setAddUsersToGroupClosed, types]);

  if (chatsLoading) {
    return null;
  }

  return (
    <>
      <Dialog
        open={addUsersToGroupOpen}
        onClose={setAddUsersToGroupClosed}
        fullWidth
        scroll="body"
      >
        <DialogTitle>
          Перенести пользователей в группу{" "}
          <Typography component="span" color="secondary" variant="h5">
            {types.find(v => v.id === selectedG)?.title}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>ID</TableCell>
                  <TableCell>Логин</TableCell>
                  <TableCell>Группа</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rejectedUsers.map(v => (
                  <TableRow key={v.id}>
                    <TableCell className={s.chbxc}>
                      <Checkbox
                        value={!!checked[v.id]}
                        onChange={() => toggleChecked(v.id)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{v.id}</TableCell>
                    <TableCell>{v.login}</TableCell>
                    <TableCell>
                      {types.find(t => t.id === v.type)?.title}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            onClick={setAddUsersToGroupClosed}
          >
            Отменить
          </Button>
          <Button variant="contained" color="primary" onClick={submitMove}>
            Подтвердить
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={ge} onClose={() => setGe(false)} fullWidth scroll="body">
        <DialogTitle>Редактировать группы</DialogTitle>
        <DialogContent>
          <div className={s.field}>
            <Typography variant="body2" gutterBottom>
              Создать группу
            </Typography>
            <div className={s.addgroupwrap}>
              <TextField
                value={addGr}
                onChange={e => setAddGr(e.target.value)}
                label="Название"
              />
              <Button onClick={handleSubmitAddGr}>Создать</Button>
            </div>
          </div>
          <select
            value={selectedG}
            onChange={e => setSelectedG(e.target.value)}
          >
            {mtypes.map(t => (
              <option value={t.id} key={t.id}>
                {t.title}
              </option>
            ))}
          </select>
          {selectedG !== "null" && (
            <Button onClick={() => _setAddUsersToGroupOpen(true)}>
              Добавить пользователей
            </Button>
          )}
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Логин</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedUsers.map(v => (
                  <TableRow key={v.id}>
                    <TableCell>{v.id}</TableCell>
                    <TableCell>{v.login}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setGe(false)}
          >
            Закрыть
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={cuo} key={cuoKey} onClose={closeCu} fullWidth scroll="body">
        <DialogTitle>Добавить пользователя</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmitNewUser}>
            <div className={s.field}>
              <TextField label="Логин" type="text" required fullWidth />
            </div>
            <div className={s.field}>
              <TextField label="Пароль" type="text" required fullWidth />
            </div>
            <div style={{ marginBottom: "16px" }}>
              <Typography variant="body1" gutterBottom>
                Категория
              </Typography>
              <select required>
                {types.map(v => (
                  <option key={v.id} value={v.id}>
                    {v.title}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ marginBottom: "16px" }}>
              <Button
                variant="contained"
                color="secondary"
                type="button"
                onClick={closeCu}
              >
                Отмена
              </Button>
              <Button variant="contained" color="primary" type="submit">
                Создать пользователя
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={createTaskOpen} fullWidth scroll="body">
        <DialogTitle>Задание #{taskToAdd}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmitNewTask}>
            <div className={s.field}>
              <TextField
                label="Название задания"
                type="text"
                required
                fullWidth
              />
            </div>
            <div className={s.field}>
              <Typography variant="body1" gutterBottom>
                Подробное описание задания
              </Typography>
              <textarea className={s.textateada} required />
            </div>
            <div style={{ marginBottom: "16px" }}>
              <Typography variant="body1" gutterBottom>
                Категория
              </Typography>
              <select required>
                {types.map(v => (
                  <option key={v.id} value={v.id}>
                    {v.title}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ marginBottom: "16px" }}>
              <Typography variant="body1" gutterBottom>
                Дедлайн
              </Typography>
              <input type="date" required />
            </div>
            <div style={{ marginBottom: "16px" }}>
              <Button variant="contained" color="primary" type="submit">
                Создать задание
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <div className={s.splitWrap}>
        <div className={s.chats}>
          <div className={s.searchWrapper}>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Поиск"
              className={s.searchInput}
            />
          </div>
          {user.status === "1" &&
            serviceChatsAdmin.map(v => (
              <Paper
                key={v.id}
                className={s.chatCard}
                onClick={() => setCurrentOpen(v.id)}
              >
                <Paper className={s.avatar}></Paper>
                <div className={s.cardText}>
                  <Typography variant="h6">{v.title}</Typography>
                </div>
              </Paper>
            ))}
          {filteredArr.map(v => (
            <Paper
              key={v.id}
              className={s.chatCard}
              onClick={() => setCurrentOpen(v.id)}
            >
              <Paper className={s.avatar}></Paper>
              <div className={s.cardText}>
                <Typography variant="body1">{v.title}</Typography>
                <Typography variant="body2">#{v.id}</Typography>
              </div>
            </Paper>
          ))}
          {/* <div className={s.archive}>
          <Button
            fullWidth
            color="secondary"
            variant="contained"
            className={s.archiveButton}
          >
            архив
          </Button>
        </div> */}
        </div>
        <div className={s.main}>
          {currentOpenData && (
            <>
              <div className={s.chatbar}>
                <Paper className={s.avatar}></Paper>
                <div className={s.topbarText}>
                  <Typography
                    variant="h5"
                    color="inherit"
                    className={s.topbarTitle}
                  >
                    {currentOpenData.title}
                  </Typography>
                  <Typography variant="body2" color="inherit">
                    {isAdmin ? user.login : <>#{currentOpenData.id}</>}
                  </Typography>
                </div>
                {!isAdmin && <div className={s.chatbardotdotdot}>...</div>}
              </div>
              <div className={s.messages} ref={scrollref}>
                {currentOpenMessages?.messages?.map((m: any) => (
                  <Paper className={s.cloud} key={m.id}>
                    {m.type === "stats" && (
                      <>
                        <Typography variant="h6">
                          Статистика: {m.data.date}
                        </Typography>
                        <Typography variant="h5">
                          Выдано заданий: {m.data.tasksGiven}
                        </Typography>
                        <Typography variant="h5">
                          Проверено заданий: {m.data.tasksQualified}
                        </Typography>
                      </>
                    )}
                    {m.type === "newUser" && (
                      <>
                        <Typography variant="h5">Новый пользователь</Typography>
                        <Typography variant="h5">
                          Логин: {m.data.login}
                        </Typography>
                        <Typography variant="h5">
                          Пароль: {m.data.password}
                        </Typography>
                        <Typography variant="h5">
                          Категория:{" "}
                          {types.find(v => v.id === m.data.type)?.title}
                        </Typography>
                        <Typography variant="h5">
                          Тип:{" "}
                          {m.data.status === "0"
                            ? "Пользователь"
                            : "Администратор"}
                        </Typography>
                      </>
                    )}
                    {m.type === "newGroup" && (
                      <>
                        <Typography variant="h5">Новая группа</Typography>
                        <Typography variant="h5">
                          Название: {m.data.title}
                        </Typography>
                      </>
                    )}
                    {m.type === "movedUsers" && (
                      <>
                        <Typography variant="h4">
                          Смена групп пользователей
                        </Typography>
                        <Typography variant="h5">
                          Пользователь(и) {m.data.names} перемещен(ы) в группу{" "}
                          {m.data.newCat}
                        </Typography>
                      </>
                    )}
                  </Paper>
                ))}
                {isAdmin && (
                  <div className={s.butrtohjsw}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={updateStats}
                    >
                      Показать статистику
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={newTask}
                    >
                      Создать задание
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => setGe(true)}
                    >
                      Редактировать группы
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => setCuo(true)}
                    >
                      Создать пользователя
                    </Button>
                  </div>
                )}
                <Paper
                  className={s.inputPaper}
                  component="form"
                  onSubmit={handleSendMessage as any}
                >
                  <label className={s.fileButton}>
                    <img src={fileicon} alt="" />
                    <input type="file" className={s.fileInput} />
                  </label>
                  <input className={s.input} />
                  <button type="submit" className={s.sendButton}>
                    <img src={sendicon} alt="" />
                  </button>
                </Paper>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Cabinet;
