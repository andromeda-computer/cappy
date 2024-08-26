import { Link } from "waku";
import User from "./User";

export const Header = () => {
  return (
    <header className="flex w-full justify-between items-center">
      <div className="flex items-center gap-4">
        <h2 className="font-bold tracking-tight">
          <Link to="/" className="no-underline text-neutral-200">
            cappy.space
          </Link>
        </h2>
        <Link to="/upload" className="font-bold text-xl no-underline">
          upload
        </Link>
      </div>
      <User />
    </header>
  );
};
