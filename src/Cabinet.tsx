import React, { useCallback, useState, useMemo, useEffect } from "react";
import { makeStyles, Paper, Typography, Button } from "@material-ui/core";
import fileicon from "./file.png";
import sendicon from "./send.png";
import { useDebouncedValue } from "./useDebouncedValue";
import { API, Chat, User } from "./api";

const WIDTH = 400;

const us = makeStyles(theme => ({
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
    padding: theme.spacing(11.5, 1, 10),
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
  messages: {
    overflowY: "auto",
    padding: theme.spacing(1, 1, 10),
    position: "relative",
    height: "calc(100% - 84px)"
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
    fontSize: 32,
    padding: theme.spacing(0, 1)
  }
}));

type Props = {
  user: User;
};

const Cabinet: React.FC<Props> = () => {
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

  const [currentOpen, setCurrentOpen] = useState<string | null>(null);

  const [currentOpenData, setCurrentOpenData] = useState<Chat | null>(null);

  useEffect(() => {
    setCurrentOpenData(currentOpen ? chatsMap[currentOpen] : null);
  }, [chats, chatsMap, currentOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setCurrentOpen(null);
      }
    };

    window.addEventListener("keyup", handler);

    return () => window.removeEventListener("keyup", handler);
  }, []);

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

  if (chatsLoading) {
    return null;
  }

  return (
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
        <div className={s.archive}>
          <Button
            fullWidth
            color="secondary"
            variant="contained"
            className={s.archiveButton}
          >
            архив
          </Button>
        </div>
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
                  #{currentOpenData.id}
                </Typography>
              </div>
              <div className={s.chatbardotdotdot}>...</div>
            </div>
            <div className={s.messages}>
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
  );
};

export default Cabinet;
