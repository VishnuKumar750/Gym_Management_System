import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export default function SupplementForm() {
  return (
    <div className="p-4 overflow-auto space-y-6">
      <h2 className="font-medium text-xl">Add Supplement</h2>
      <form className="space-y-4">
        <div className="space-y-2">
          <Label>Product Image(Optional not working)</Label>
          <Input placeholder="whey protein powder" />
        </div>
        <div className="space-y-2">
          <Label>Product Name</Label>
          <Input placeholder="whey protein powder" />
        </div>
        <div className="space-y-2">
          <Label>Category</Label>
          <Input placeholder="whey protein powder" />
        </div>
        <div className="space-y-2">
          <Label>Brand</Label>
          <Input placeholder="whey protein powder" />
        </div>
        <div className="space-y-2">
          <Label>Price</Label>
          <Input placeholder="whey protein powder" />
        </div>
        <div className="space-y-2">
          <Label>stock quantity</Label>
          <Input placeholder="whey protein powder" />
        </div>
        <div className="space-y-2">
          <Label>Unit</Label>
          <Input placeholder="whey protein powder" />
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <Input placeholder="whey protein powder" />
        </div>
        <Button className="w-full my-4">Create Supplement</Button>
      </form>
    </div>
  );
}
