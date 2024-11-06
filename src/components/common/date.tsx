import dayjs from "dayjs";

function DateDisplay(props: {
  date: Date;
  ignoreAfterYears?: number;
  format?: string;
  showTime?: boolean;
}) {
  const { date, ignoreAfterYears, showTime } = props;

  let { format } = props;
  if (!format) {
    format = showTime ? "MMM DD, YYYY - hh:mm A" : "MMM DD, YYYY";
  }

  const ignore =
    !!ignoreAfterYears &&
    new Date(
      new Date().setFullYear(new Date().getFullYear() + ignoreAfterYears)
    ) < date;
  const timeString = dayjs(date).format(format);

  return <p>{ignore ? "Never" : timeString}</p>;
}

export default DateDisplay;
