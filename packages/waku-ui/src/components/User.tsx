"use client";
import { useAtom } from "jotai";
import { usernameAtom } from "../atoms";
import { useState } from "react";

const User = () => {
  const [username, setUsername] = useAtom(usernameAtom);
  const [loginActive, setLoginActive] = useState(false);

  const handleUsernameSave = () => {
    if (username) {
      setUsername(username);
      setLoginActive(false);
    }
  };

  if (loginActive) {
    return (
      <div className="flex gap-2 text-xl">
        <input
          type="text"
          value={username || ""}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="enter username.."
          autoFocus
        />
        <button onClick={handleUsernameSave}>submit</button>
      </div>
    );
  }

  return (
    <div>
      {username ? (
        <div className="flex gap-2 text-xl">
          <p className="">{username}</p>
          <button onClick={() => setUsername(null)}>logout</button>
        </div>
      ) : (
        <div className="text-xl">
          <button onClick={() => setLoginActive(true)}>login</button>
        </div>
      )}
    </div>
  );
};

export default User;
