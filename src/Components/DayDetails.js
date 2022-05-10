import { Link, useNavigate, useParams } from "react-router-dom";
import { getDateStringLocal } from "../helpers/date";
import ScheduleChoice from "./ScheduleChoice";
import WorktimeChoice from "./WorktimeChoice";
import { calendar } from "../helpers/calendar";
import { useState } from "react";

// TODO Add a button to go back to calendar AT THE SAME MONTH THAN THE MONTH OF THIS PAGE
function DayDetails() {
  const { year, monthIndex, day } = useParams();

  const navigate = useNavigate();

  const handleNextDay = () => {
    const { newYear, newMonthIndex, newDay } = nextDay(
      +year,
      +monthIndex,
      +day
    );
    navigate(`/day/details/${newYear}/${newMonthIndex}/${newDay}`);
  };

  const handleLastDay = () => {
    const { newYear, newMonthIndex, newDay } = lastDay(
      +year,
      +monthIndex,
      +day
    );
    navigate(`/day/details/${newYear}/${newMonthIndex}/${newDay}`);
  };

  return (
    <div className="DayDetails">
      <h2>{getDateStringLocal(year, monthIndex, day)}</h2>
      <ScheduleChoice year={year} monthIndex={monthIndex} day={day} />
      <WorktimeChoice year={year} monthIndex={monthIndex} day={day} />
      <button onClick={handleLastDay}>Last day</button>
      <button onClick={handleNextDay}>Next day</button>
    </div>
  );
}

const nextDay = (year, monthIndex, day) => {
  const nbrDayInMonth = calendar.getNbrDaysInMonth(year, monthIndex);

  let newDay = day + 1;
  let newMonthIndex = monthIndex;
  let newYear = year;

  if (newDay > nbrDayInMonth) {
    newDay = 1;
    newMonthIndex += 1;
  }
  if (newMonthIndex >= 12) {
    newMonthIndex = 0;
    newYear += 1;
  }
  return { newYear, newMonthIndex, newDay };
};

const lastDay = (year, monthIndex, day) => {
  let newDay = day - 1;
  let newMonthIndex = monthIndex;
  let newYear = year;
  if (newDay < 1) {
    newMonthIndex -= 1;
    newDay = calendar.getNbrDaysInMonth(year, newMonthIndex);
  }
  if (newMonthIndex <= -1) {
    newMonthIndex = 11;
    newYear = year - 1;
  }
  return { newYear, newMonthIndex, newDay };
};

export default DayDetails;