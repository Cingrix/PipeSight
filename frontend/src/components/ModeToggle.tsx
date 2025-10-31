import { useTheme } from "./theme-provider";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div
      onClick={toggleTheme}
      className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer ${theme === "dark" ? "bg-blue-500" : "bg-gray-300"}`}
    >
      <div
        className={`bg-white w-4 h-4 rounded-full shadow-md transform ${theme === "dark" ? "translate-x-6" : "translate-x-0"} transition-transform duration-300`}
      ></div>
    </div>
  );
}
