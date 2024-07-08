import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import Arrowicon from "../components/ArrowIcon";

const Main = () => {
  const [day, setDay] = useState<string>("");
  const [month, setMonth] = useState<string>("");
  const [year, setYear] = useState<string>("");
  const [age, setAge] = useState<{ years: string | number; months: string | number; days: string | number }>({ years: "--", months: "--", days: "--" });
  const [error, setError] = useState<string>("");
  const [darkMode, setDarkMode] = useState<boolean>(true);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

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
    if (name === "day") {
      setDay(value);
    } else if (name === "month") {
      setMonth(value);
    } else if (name === "year") {
      setYear(value);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!day || !month || !year) {
      setError("All fields are required");
      return;
    }

    const dayNum = parseInt(day);
    const monthNum = parseInt(month);
    const yearNum = parseInt(year);

    if (dayNum < 1 || dayNum > 31) {
      setError("Day must be between 1 and 31");
      return;
    }

    if (monthNum < 1 || monthNum > 12) {
      setError("Month must be between 1 and 12");
      return;
    }

    const currentYear = new Date().getFullYear();
    if (yearNum < 1900 || yearNum > currentYear) {
      setError(`Year must be between 1900 and ${currentYear}`);
      return;
    }

    if (!isValidDate(dayNum, monthNum, yearNum)) {
      setError("Invalid date");
      return;
    }

    const birthDate = new Date(yearNum, monthNum - 1, dayNum);
    const today = new Date();
    const diff = today.getTime() - birthDate.getTime();

    if (diff < 0) {
      setError("Birthdate cannot be in the future");
      return;
    }

    const ageDate = new Date(diff);
    const calculatedAge = {
      years: ageDate.getUTCFullYear() - 1970,
      months: ageDate.getUTCMonth(),
      days: ageDate.getUTCDate() - 1,
    };
    setAge(calculatedAge);
    setError("");
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", JSON.stringify(newDarkMode));
  };

  return (
    <div className={`flex flex-col h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"} transition-colors duration-300`}>
      <button className="absolute right-3 top-3" onClick={toggleDarkMode}>
        {darkMode ? "Light" : "Dark"}
      </button>
      <div className="flex flex-col items-center justify-center flex-grow">
        <div className="text-center mb-8">
          <h1 className="font-poppins-bold text-3xl">Age Calculator</h1>
          <p className="text-xl">just input your BirthDate here...</p>
        </div>
        <div className={`${darkMode ? "bg-gray-800" : "bg-white"} px-9 py-8 rounded-xl rounded-br-[90px]`}>
          <form className="flex gap-5 justify-start border-b pb-10 relative" onSubmit={handleSubmit}>
            <div className="flex flex-col">
              <label htmlFor="day" className="text-xs font-poppins-regular">DAY</label>
              <input
                type="number"
                name="day"
                placeholder="DD"
                value={day}
                onChange={handleChange}
                className={`px-3 w-20 rounded-md py-2 focus:outline-primaryPurple outline-none placeholder:font-extrabold placeholder:font-poppins-bold ${darkMode ? "bg-gray-700 text-white" : "bg-gray-100"}`}
                autoComplete="off"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="month" className="text-xs font-poppins-regular">MONTH</label>
              <input
                type="number"
                name="month"
                placeholder="MM"
                value={month}
                onChange={handleChange}
                className={`px-3 w-20 rounded-md py-2 focus:outline-primaryPurple outline-none placeholder:font-extrabold placeholder:font-poppins-bold ${darkMode ? "bg-gray-700 text-white" : "bg-gray-100"}`}
                autoComplete="off"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="year" className="text-xs font-poppins-regular">YEAR</label>
              <input
                type="number"
                name="year"
                placeholder="YYYY"
                value={year}
                onChange={handleChange}
                className={`px-3 w-20 rounded-md py-2 focus:outline-primaryPurple outline-none placeholder:font-extrabold placeholder:font-poppins-bold ${darkMode ? "bg-gray-700 text-white" : "bg-gray-100"}`}
                autoComplete="off"
              />
            </div>
            <button className="bg-primaryPurple rounded-full p-3 absolute -right-5 -bottom-6" type="submit">
              <Arrowicon />
            </button>
          </form>
          {error && <div className="text-red-500 mt-5 font-poppins-bold">{error}</div>}
          <div className="flex flex-col items-start justify-center mt-5">
            <div className="flex items-center">
              <span className="text-6xl font-extrabold text-primaryPurple">{age.years}</span>
              <h1 className={`text-neutralOffBlack text-5xl font-poppins-bold font-extrabold ${darkMode ? "text-white" : ""}`}>years</h1>
            </div>
            <div className="flex items-center">
              <span className="text-6xl font-extrabold text-primaryPurple">{age.months}</span>
              <h1 className={`text-neutralOffBlack text-5xl font-poppins-bold font-extrabold ${darkMode ? "text-white": ""}`}>months</h1>
            </div>
            <div className="flex items-center">
              <span className="text-6xl font-extrabold text-primaryPurple">{age.days}</span>
              <h1 className={`text-neutralOffBlack text-5xl font-poppins-bold font-extrabold ${darkMode ? "text-white": ""}`}>days</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
