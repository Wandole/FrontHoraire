import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../AuthContextProvider";
import { formatDateWithTime, getTimeString } from "../helpers/date";
import { formatErrors } from "../helpers/helpers";

const HOST = require("../globalVars.json").HOST;

function ScheduleForm(props) {
  const propsName = props.name;
  const propsStartDate = props.startDate;
  const propsEndDate = props.endDate;
  const propsBreakTime = props.breakTime;
  const { token } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [breakTime, setBreakTime] = useState(0);
  const [warningsObj, setWarningsObj] = useState({});

  //TODO Ajouter la possibilité de faire un horaire sur 2 jours (ajouter une case qui l'indique et qui fait que la
  // fct getTimeString ajouter 24h à la date qu'elle utilise par defaut
  useEffect(() => {
    if (propsName) setName(propsName);
    if (propsStartDate) setStartDate(getTimeString(propsStartDate));
    if (propsEndDate) setEndDate(getTimeString(propsEndDate));
    if (propsBreakTime) setBreakTime(propsBreakTime);
  }, [props]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    resetForm();
    try {
      if (!validInputs()) return; // TODO: need to be implemented

      /* Update values */
      let rep = await axios.put(
        `${HOST}/schedule/put/${props.scheduleId}`,
        {
          name,
          startDate: formatDateWithTime(startDate),
          endDate: formatDateWithTime(endDate),
          breakTime: breakTime,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (e) {
      const errorObject = formatErrors(e.response.data);
      setWarningsObj(errorObject);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      if (!validInputs()) return; // TODO: need to be implemented

      /* Post new values */
      await axios.post(
        `${HOST}/schedule/add`,
        {
          name,
          startDate: formatDateWithTime(startDate),
          endDate: formatDateWithTime(endDate),
          breakTime: breakTime,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      resetForm();
    } catch (e) {
      const errorObject = formatErrors(e.response.data);
      setWarningsObj(errorObject);
    }
  };

  const resetForm = () => {
    setWarningsObj({});
    setName("");
    setStartDate("");
    setEndDate("");
    setBreakTime(0);
  };

  return (
    <form className={"ScheduleForm"} action={""}>
      <div className="input-container">
        <label htmlFor="name">Nom</label>
        <input
          type="text"
          name="name"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {warningsObj.name && <div className="error">Min. 3 caractères.</div>}
      </div>

      <div className="double-input">
        <div className="input-container">
          <label htmlFor="startDate">Début</label>
          <input
            type="time"
            name="startDate"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          {warningsObj.startDate && <div className="error">Obligatoire</div>}
        </div>
        <div className="input-container">
          <label htmlFor="endDate">Fin</label>
          <input
            type="time"
            name="endDate"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>
      <div className="input-container">
        <label htmlFor="breaktime">Pause (min)</label>
        <input
          type="number"
          name="breaktime"
          id="breaktime"
          min={0}
          value={breakTime}
          onChange={(e) => setBreakTime(e.target.value)}
        />
      </div>
      {props.update ? (
        <button onClick={handleUpdate}>Mettre à jour</button>
      ) : (
        <button onClick={handleCreate}>Créer</button>
      )}
    </form>
  );
}

// TODO
const validInputs = () => {
  return true;
};

export default ScheduleForm;