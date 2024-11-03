function DateDisplay(props: { date: Date; ignoreAfterYears?: number }) {
  const ignore =
    !!props.ignoreAfterYears &&
    new Date(
      new Date().setFullYear(new Date().getFullYear() + props.ignoreAfterYears)
    ) < props.date;
  const timeString = props.date.toLocaleTimeString([], {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  return <p>{ignore ? "Never" : timeString}</p>;
}

export default DateDisplay;
