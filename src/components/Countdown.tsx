import React, { FC } from "react";
import ReactDOM from "react-dom";
import Countdown from "react-countdown";

interface Props {
  startTime: number;
}

const renderer = ({
  hours,
  minutes,
  seconds,
}: {
  hours: number;
  minutes: number;
  seconds: number;
}) => {
  // Render a countdown
  return (
    <>
      {String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")}:
      {String(seconds).padStart(2, "0")}
    </>
  );
};

const CountdownComponent: FC<Props> = ({ startTime }) => {
  const startDate = new Date(startTime * 1000);

  return new Date() < startDate ? (
    <Countdown date={startDate} renderer={renderer} />
  ) : null;
};

const CountdownWrapper = (props: Props) => {
  const container = document.querySelector("#countdown");
  return container
    ? ReactDOM.createPortal(<CountdownComponent {...props} />, container)
    : null;
};

export default CountdownWrapper;
