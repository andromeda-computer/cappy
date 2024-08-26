"use client";
import { useAtom } from "jotai";
import { usernameAtom } from "../atoms";

const User = () => {
  const [username, setUsername] = useAtom(usernameAtom);

  return <div>{username ? username : "login"}</div>;
};

export default User;
