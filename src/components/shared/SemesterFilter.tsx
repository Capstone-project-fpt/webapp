import { useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SemesterFilterProps {
  onSemesterChange?: (value: string) => void;
}

const SemesterFilter: React.FC<SemesterFilterProps> = ({
  onSemesterChange,
}) => {
  const SEMESTERS = [
    { value: "1", label: "Fall 2024" },
    { value: "2", label: "Summer 2024" },
    { value: "3", label: "Spring 2024" },
    { value: "4", label: "Fall 2023" },
    { value: "5", label: "Summer 2023" },
    { value: "6", label: "Spring 2023" },
  ]; // TODO: Fetch from API

  const [selectedSemester, setSelectedSemester] = useState(SEMESTERS[0].value);

  const handleSemesterChange = (value: string) => {
    console.log("Selected semester:", value);
    setSelectedSemester(value);

    if (onSemesterChange) {
      onSemesterChange(value);
    }
  };

  return (
    <div>
      <Label>Semester</Label>
      <Select onValueChange={handleSemesterChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue
            placeholder={
              SEMESTERS.find((s) => s.value === selectedSemester)?.label
            }
          />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {SEMESTERS.map((semester) => (
              <SelectItem key={semester.value} value={semester.value}>
                {semester.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SemesterFilter;
