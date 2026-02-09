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
import { getPackages } from "@/api/feePackage/fee-package.api";
import { IndianRupee } from "lucide-react";

type IPackage = {
  _id: string;
  packageName: string;
  price: number;
};
type Props = {
  value?: string;
  onChange: (value: string) => void;
};

export default function SelectPackage({ value, onChange }: Props) {
  const {
    data: packages = [],
    isLoading,
    isError,
  } = useQuery<IPackage[]>({
    queryKey: ["packages"],
    queryFn: getPackages,
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
          {packages.map((pkg) => (
            <SelectItem key={pkg._id} value={pkg._id}>
              {pkg.packageName} - <IndianRupee className="w-4 h-4" />{" "}
              {pkg.price}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
