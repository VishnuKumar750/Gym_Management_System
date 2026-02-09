import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const genders = ["male", "female", "other"] as const;

type Gender = "male" | "female" | "other";

type Props = {
  value?: Gender | undefined;
  onChange: (value: Gender) => void;
};

export const SelectGender = ({ value, onChange }: Props) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={"select gender"} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>select gender</SelectLabel>
          {genders.map((gender) => (
            <SelectItem key={gender} value={gender}>
              {gender}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
