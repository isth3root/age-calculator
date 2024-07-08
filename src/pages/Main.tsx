import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import ArrowIcon from "../components/ArrowIcon";

const Main = () => {
  const [day, setDay] = useState<string>("");
  const [month, setMonth] = useState<string>("");
  const [year, setYear] = useState<string>("");
  const [age, setAge] = useState<{ years: string | number; months: string | number; days: string | number }>({ years: "--", months: "--", days: "--" });
  const [error, setError] = useState<string>("");
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [bluMode, setBlueMode] =useState<boolean>(false);
  const [greenMode, setGreenMode] = useState<boolean>(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState<boolean>(false);

  
  const [dayError, setDayError] = useState<boolean>(false);
  const [monthError, setMonthError] = useState<boolean>(false);
  const [yearError, setYearError] = useState<boolean>(false);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  const themes = [
    { name: "Light Mode", id: "light", bg: "bg-white", text: "text-black" },
    { name: "Dark Mode", id: "dark", bg: "bg-gray-900", text: "text-white" },
    { name: "Blue Theme", id: "blue", bg: "bg-blue-500", text: "text-white" },
    { name: "Green Theme", id: "green", bg: "bg-green-500", text: "text-white" },
  ];

  // Function to toggle theme
  const toggleTheme = (themeId: string) => {
    switch (themeId) {
      case "light":
        setDarkMode(false);
        setBlueMode(false);
        setGreenMode(false);
        break;
      case "dark":
        setDarkMode(true);
        setBlueMode(false);
        setGreenMode(false)
        break;
      case "blue":
        setBlueMode(true)
        setDarkMode(false);
        setGreenMode(false);
        break;
      case "green":
        setGreenMode(true);
        setBlueMode(false);
        setDarkMode(false);
        break;
      default:
        setDarkMode(true);
        break;
    }
    setThemeMenuOpen(false);
    localStorage.setItem("darkMode", JSON.stringify(themeId === "dark"));
  };

  const isValidDate = (day: number, month: number, year: number) => {
    const date = new Date(year, month - 1, day);
    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    );
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    switch (name) {
      case "day":
        setDay(value);
        setDayError(false);
        break;
      case "month":
        setMonth(value);
        setMonthError(false);
        break;
      case "year":
        setYear(value);
        setYearError(false);
        break;
      default:
        break;
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!day || !month || !year) {
      setError("All fields are required");
      setDayError(!day);
      setMonthError(!month);
      setYearError(!year);
      return;
    }

    const dayNum = parseInt(day);
    const monthNum = parseInt(month);
    const yearNum = parseInt(year);

    if (dayNum < 1 || dayNum > 31) {
      setError("Day must be between 1 and 31");
      setDayError(true);
      return;
    }

    if (monthNum < 1 || monthNum > 12) {
      setError("Month must be between 1 and 12");
      setMonthError(true);
      return;
    }

    const currentYear = new Date().getFullYear();
    if (yearNum < 1900 || yearNum > currentYear) {
      setError(`Year must be between 1900 and ${currentYear}`);
      setYearError(true);
      return;
    }

    if (!isValidDate(dayNum, monthNum, yearNum)) {
      setError("Invalid date");
      setDayError(true);
      setMonthError(true);
      setYearError(true);
      return;
    }

    const birthDate = new Date(yearNum, monthNum - 1, dayNum);
    const today = new Date();
    const diff = today.getTime() - birthDate.getTime();

    if (diff < 0) {
      setError("Birthdate cannot be in the future");
      setDayError(true);
      setMonthError(true);
      setYearError(true);
      return;
    }

    const ageDate = new Date(diff);
    const years = ageDate.getUTCFullYear() - 1970;
    const months = ageDate.getUTCMonth();
    const days = ageDate.getUTCDate() - 1;

    setAge({ years, months, days });
    setError("");
  };

  const toggleThemeMenu = () => {
    setThemeMenuOpen(!themeMenuOpen);
  };

  return (
    <div className={`flex flex-col h-screen ${darkMode ? "bg-gray-900 text-white" : bluMode ?  "bg-blue-400 text-black" : greenMode ? "bg-green-400": ""} transition-colors duration-300`}>
      <button className={`absolute right-3 top-3 ${darkMode ? "text-white font-poppins-bold": bluMode ? "text-white font-poppins-bold": greenMode ? "text-black font-poppins-bold": "font-poppins-bold"}`} onClick={toggleThemeMenu}>
        {darkMode ? "Dark" : bluMode?  "Blue": greenMode ? "Green": "Light"} 
      </button>
      {themeMenuOpen && (
        <div className="absolute mt-12 right-0 w-40 rounded-md ">
          <ul className="flex flex-row-reverse">
            {themes.map((theme) => (
              <li
                key={theme.id}
                onClick={() => toggleTheme(theme.id)}
                className={`cursor-pointer px-4 h-8 ${theme.bg} ${theme.text} rounded-full border border-neutralSmokeyGrey`}
              >
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="flex flex-col items-center justify-center flex-grow">
        <div className="text-center mb-8">
          <h1 className="font-poppins-bold text-3xl">Age Calculator</h1>
          <p className="text-xl">Just input your BirthDate here...</p>
        </div>
        <div className={`${darkMode ? "bg-gray-800" : "bg-white"} px-9 py-8 rounded-xl rounded-br-[90px]`}>
          <form className="flex gap-5 justify-start border-b pb-10 relative" onSubmit={handleSubmit}>
            <div className="flex flex-col">
              <label htmlFor="day" className={`text-xs font-poppins-bold ${dayError ? "text-red-500" : ""}`}>DAY</label>
              <input
                type="number"
                name="day"
                placeholder="DD"
                value={day}
                onChange={handleChange}
                className={`px-3 w-20 rounded-md py-2  outline-none placeholder:font-extrabold placeholder:font-poppins-bold ${darkMode ? "bg-gray-700 text-white focus:outline-primaryPurple" :bluMode ?  "focus:outline-blue-500":greenMode ? "focus:outline-green-500": "bg-gray-100 focus:outline-primaryPurple"} ${dayError ? "border-red-500" : ""}`}
                autoComplete="off"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="month" className={`text-xs font-poppins-bold ${monthError ? "text-red-500" : ""}`}>MONTH</label>
              <input
                type="number"
                name="month"
                placeholder="MM"
                value={month}
                onChange={handleChange}
                className={`px-3 w-20 rounded-md py-2  outline-none placeholder:font-extrabold placeholder:font-poppins-bold ${darkMode ? "bg-gray-700 text-white focus:outline-primaryPurple" :bluMode ?  "focus:outline-blue-500":greenMode ? "focus:outline-green-500": "bg-gray-100 focus:outline-primaryPurple"} ${dayError ? "border-red-500" : ""}`}
                autoComplete="off"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="year" className={`text-xs font-poppins-bold ${yearError ? "text-red-500" : ""}`}>YEAR</label>
              <input
                type="number"
                name="year"
                placeholder="YYYY"
                value={year}
                onChange={handleChange}
                className={`px-3 w-20 rounded-md py-2  outline-none placeholder:font-extrabold placeholder:font-poppins-bold ${darkMode ? "bg-gray-700 text-white focus:outline-primaryPurple" :bluMode ?  "focus:outline-blue-500":greenMode ? "focus:outline-green-500": "bg-gray-100 focus:outline-primaryPurple"} ${dayError ? "border-red-500" : ""}`}
                autoComplete="off"
              />
            </div>
            <button className={`${darkMode ? "bg-primaryPurple": bluMode ? "bg-blue-400": greenMode ?  "bg-green-400": "bg-primaryPurple"} rounded-full p-3 absolute -right-5 -bottom-6`} type="submit">
              <ArrowIcon />
            </button>
          </form>
          {error && <div className="text-red-500 mt-5 font-poppins-bold">{error}</div>}
          <div className="flex flex-col items-start justify-center mt-5">
            <div className="flex items-center">
              <span className={`text-6xl font-extrabold ${darkMode ? "text-primaryPurple":bluMode ?  "text-blue-600": greenMode ? "text-green-600": "text-primaryPurple"}`}>{age.years}</span>
              <h1 className={`text-neutralOffBlack text-5xl font-poppins-bold font-extrabold ${darkMode ? "text-white" : ""}`}>years</h1>
            </div>
            <div className="flex items-center">
              <span className={`text-6xl font-extrabold ${darkMode ? "text-primaryPurple":bluMode ?  "text-blue-600": greenMode ? "text-green-600": "text-primaryPurple"}`}>{age.months}</span>
              <h1 className={`text-neutralOffBlack text-5xl font-poppins-bold font-extrabold ${darkMode ? "text-white" : ""}`}>months</h1>
            </div>
            <div className="flex items-center">
              <span className={`text-6xl font-extrabold ${darkMode ? "text-primaryPurple":bluMode ?  "text-blue-600": greenMode ? "text-green-600": "text-primaryPurple"}`}>{age.days}</span>
              <h1 className={`text-neutralOffBlack text-5xl font-poppins-bold font-extrabold ${darkMode ? "text-white" : ""}`}>days</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
