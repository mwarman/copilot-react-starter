/**
 * The Header component displays the application header with the app name.
 */
const Header = (): JSX.Element => {
  return (
    <header className="bg-slate-900 text-white py-4 px-6 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <h1 className="text-xl font-bold">React Starter Kit</h1>
      </div>
    </header>
  );
};

export default Header;
