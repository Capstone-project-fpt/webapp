import dayjs from "dayjs";

function DateDisplay(props: {
  date: Date;
  ignoreAfterYears?: number;
  format?: string;
}) {
  const { date, ignoreAfterYears, format = "MMM DD, YYYY" } = props;

  const ignore =
    !!ignoreAfterYears &&
    new Date(
      new Date().setFullYear(new Date().getFullYear() + ignoreAfterYears)
    ) < date;
  const timeString = dayjs(date).format(format);

  return <p>{ignore ? "Never" : timeString}</p>;
}

export default DateDisplay;
