import { faPenNib } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const Logo = () => {
  return (
    <div className="text-3xl text-center py-4 font-heading">
      Blogener{" "}
      <FontAwesomeIcon icon={faPenNib} className="text-2xl text-zinc-300" />
    </div>
  );
};
