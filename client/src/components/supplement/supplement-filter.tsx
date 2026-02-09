import { ArrowUpDown } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  sort: string | null;
  status: string | null;
  onChange: (key: string, value: string) => void;
};

export function SupplementFilters({ sort, status, onChange }: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h4 className="text-sm font-semibold">Supplements</h4>
        <p className="text-xs text-muted-foreground">
          Manage availability and stock
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="space-y-1">
          <Label>
            Sort <ArrowUpDown className="inline h-3 w-3" />
          </Label>
          <Select value={sort ?? ""} onValueChange={(v) => onChange("sort", v)}>
            <SelectTrigger>
              <SelectValue placeholder="sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>sort by</SelectLabel>
                <SelectItem value="0">latest</SelectItem>
                <SelectItem value="1">old</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label>Status</Label>
          <Select
            value={status ?? ""}
            onValueChange={(v) => onChange("status", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>status</SelectLabel>
                <SelectItem value="1">stock</SelectItem>
                <SelectItem value="0">out of stock</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
