import { LangString } from "../../modules/lang";
import React, {FunctionComponent} from "react";

interface SexProps {
  setFloor(floor: number): void;
}

const Sex: FunctionComponent<SexProps> = ({ setFloor }) => {
  return (
    <div className="enter-sex">
      <p>{LangString("components.Personage.Sex.579b505c2ae0a05e93b295bbef8d9d8e")}</p>
      <input
        className="enter-checkbox"
        type="radio"
        value=""
        name="sex"
        id="sex-man"
        defaultChecked
        onClick={() => setFloor(0)}
      />
      <label htmlFor="sex-man">
        <span className="glyphicons glyphicons-user"></span>
      </label>
      <input
        className="enter-checkbox"
        type="radio"
        value=""
        name="sex"
        id="sex-woman"
        onClick={() => setFloor(1)}
      />
      <label htmlFor="sex-woman">
        <span className="glyphicons glyphicons-woman"></span>
      </label>
    </div>
  );
};

export default Sex;
