import { Link } from "waku";
import User from "./User";

export const Header = () => {
  return (
    <header className="flex items-center gap-4 p-6 lg:fixed lg:left-0 lg:top-0">
      <h2 className="font-bold tracking-tight">
        <Link to="/" className="no-underline text-neutral-200">
          cappy.space
        </Link>
      </h2>
      <User />
    </header>
  );
};
