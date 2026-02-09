import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type Props = {
  value: string | undefined;
  onChange: (value: string) => void;
};

const paymentMethods = ["cash", "card", "upi", "netbanking", "other"] as const;

export default function SelectPaymentMethod({ value, onChange }: Props) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="select payment method" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>select payment method</SelectLabel>
          {paymentMethods.map((m) => (
            <SelectItem key={m} value={m}>
              {m}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
