import React, { useState } from "react";
import classes from "./newHardwareItem.module.css";
import Input from "./common/input";
import VidaDropDown from "./common/Dropdown/VidaDropdown";
import VidaDropDownItem from "./common/Dropdown/VidaDropdownItem";
import { v4 } from "uuid";

const NewHardwareItem = ({ onSubmitHardwareItemClick }) => {
  const [state, setState] = useState({
    data: {
      commandType: 1,
      name: "",
      label: "",
      on_text: "",
      off_text: "",
      sms_text_on: "",
      sms_text_off: "",
    },
  });

  const handleChange = ({ currentTarget: input }) => {
    const data = { ...state.data };
    data[input.id] = input.value;
    setState({ data });
  };

  return (
    <div className={classes.ItemContainer}>
      <Input
        onChange={handleChange}
        id='name'
        name={`name${v4()}`}
        type='text'
        label='شناسه'
      />

      <Input
        onChange={handleChange}
        id='label'
        name={`label${v4()}`}
        type='text'
        label='لیبل'
      />

      <VidaDropDown id='commandType' onChange={handleChange}>
        <VidaDropDownItem value='1'>تک فرمانه</VidaDropDownItem>
        <VidaDropDownItem value='2'>دو فرمانه</VidaDropDownItem>
      </VidaDropDown>

      <Input
        onChange={handleChange}
        name={`firstCommandText${v4()}`}
        type='text'
        label='فرمان اول'
        id='on_text'
        withNoPlaceholder={true}
      />
      <Input
        onChange={handleChange}
        name={`firstCommandSMS${v4()}`}
        type='text'
        label='پیامک فرمان اول'
        id='sms_text_on'
        withNoPlaceholder={true}
      />
      {parseInt(state.data.commandType) === 2 ? (
        <Input
          onChange={handleChange}
          id='off_text'
          name={`secondCommandText${v4()}`}
          type='text'
          label='فرمان دوم'
          withNoPlaceholder={true}
        />
      ) : null}
      {parseInt(state.data.commandType) === 2 ? (
        <Input
          onChange={handleChange}
          id='sms_text_off'
          name={`secondCommandSMS${v4()}`}
          type='text'
          label='پیامک فرمان دوم'
          withNoPlaceholder={true}
        />
      ) : null}

      <button
        onClick={() => {
          onSubmitHardwareItemClick(state.data);
        }}
        type='button'
        className='btn btn-success'
      >
        <i className='fa fa-check'></i>
      </button>
    </div>
  );
};

export default React.memo(NewHardwareItem);
