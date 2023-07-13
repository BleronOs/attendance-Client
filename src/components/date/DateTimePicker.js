import React, { forwardRef } from "react";
import ReactDatePicker from "react-datepicker";
import {
  InputGroup,
  Input,
  InputRightElement,
  useColorMode,
} from "@chakra-ui/react";
import { CalendarIcon } from "@chakra-ui/icons";

import "react-datepicker/dist/react-datepicker.css";
import "./chakra-react-datepicker.css";

const customDateInput = (
  { value, onClick, onChange, isLightMode, colorScheme },
  ref
) => (
  <Input
    autoComplete="off"
    value={value}
    ref={ref}
    onClick={onClick}
    colorScheme={colorScheme}
    onChange={onChange}
    color={isLightMode ? "gray.700" : "white"}
  />
);
customDateInput.displayName = "DateInput";

const CustomInput = forwardRef(customDateInput);

const icon = <CalendarIcon fontSize="sm" />;

const DateTimePicker = ({
  selectedDate,
  onChange,
  format = "MM/dd/yyyy",
  colorScheme,
  ...props
}) => {
  const { colorMode } = useColorMode();
  return (
    <>
      <InputGroup
        className={colorMode === "light" ? "light-theme" : "dark-theme"}
      >
        <ReactDatePicker
          selected={selectedDate}
          onChange={onChange}
          className="react-datapicker__input-text"
          customInput={
            <CustomInput
              colorScheme={colorScheme}
              isLightMode={colorMode === "light"}
            />
          }
          dateFormat={format}
          {...props}
        />
        <InputRightElement color="gray.500" children={icon} />
      </InputGroup>
    </>
  );
};

export default DateTimePicker;
