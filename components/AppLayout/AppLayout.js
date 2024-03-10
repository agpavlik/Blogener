export const AppLayout = ({ children }) => {
  return (
    <div className="grid grid-cols-[300px_1fr] h-screen max-h-screen">
      <div className="flex flex-col text-white overflow-hidden">
        <div className="bg-zinc-800 px-2">
          <div>Logo</div>
          <div>New post</div>
          <div>Token</div>
        </div>
        <div className="px-4 flex-1 overflow-auto bg-gradient-to-b from-zinc-800 to-teal-800">
          List of posts
        </div>
        <div className="bg-teal-800 flex items-center gap-2 border-t border-t-black/50 h-20 px-2">
          User Info - Logout
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
};
