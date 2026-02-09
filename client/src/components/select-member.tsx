import { useQuery } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { getMembers } from "@/api/user/user.api";

type MemberProps = {
  value: string;
  onChange: (value: string) => void;
};

type IMember = {
  _id: string;
  name: string;
  memberId: string;
};

export default function SelectMmeber({ value, onChange }: MemberProps) {
  const {
    data: members = [],
    isLoading,
    isError,
  } = useQuery<IMember[]>({
    queryKey: ["members"],
    queryFn: getMembers,
    staleTime: 5 * 60 * 1000,
  });

  if (isError) {
    return (
      <div className="text-sm text-destructive">Failed to laod packages</div>
    );
  }

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue
          placeholder={isLoading ? "Loading Packages..." : "select package"}
        />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Packages</SelectLabel>
          {members.map((mbr) => (
            <SelectItem key={mbr._id} value={mbr._id}>
              {mbr.name} - {mbr.memberId}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
