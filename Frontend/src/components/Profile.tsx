import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { FilePenLine } from "lucide-react";
import { Textarea } from "./ui/textarea";

const Profile = () => {
  // Fake backend user (replace with API)
  const [user, setUser] = useState({
    name: "Arjun Mehta",
    role: "admin", // change this to "user" to test
    email: "arjun.mehta24@example.com",
    phone: "+91 98765 43210",
    age: 24,
    gender: "Male",
    height: 178,
    weight: 72,
    address: "New Delhi, India",
    goal: "Muscle Gain",
    membershipType: "Premium",
    membershipDuration: "6 Months"
  });

  const isAdmin = user.role === "admin";
  const [editMode, setEditMode] = useState(false);

  return (
    <div className="container mx-auto dark:text-white">
      <h1 className="text-3xl font-bold my-4">Profile</h1>
      <div className="flex gap-4 items-starts w-full max-w-5xl py-4">
        <div className="rounded-xl size-40">
          <img className="w-full h-full object-cover rounded-xl " src="https://github.com/shadcn.png" alt="" />
          <span className="font-bold text-sm text-neutral-500">Active</span>
        </div>
        <div className="flex-1 w-full relative dark:text-white ">
          <Button className="cursor-pointer absolute -top-4 right-0 dark:text-neutral-200">
            <FilePenLine className="size-8" />
          </Button>
          <Label htmlFor="fullName" className="text-sm text-neutral-500 dark:text-neutral-400">Name</Label>
          <Input 
          name="fullName"
          placeholder="Adam Smith M.S"
            className="border-none outline-none focus:outline-none dark:placeholder:text-white foucs:border-none
            text-neutral-800 placeholder:text-neutral-900 font-medium
            max-w-lg
            "
          />

          <Label htmlFor="fullName" className="text-sm text-neutral-500 dark:text-neutral-400">Email</Label>
          <Input 
          name="fullName"
          placeholder="Adam@gmail.com"
            className="border-none outline-none focus:outline-none foucs:border-none dark:placeholder:text-white 
            text-neutral-800 placeholder:text-neutral-900 font-medium
            max-w-lg
            "
          />

          <Label htmlFor="fullName" className="text-sm text-neutral-500 dark:text-neutral-400">Phone No.</Label>
          <Input 
          name="fullName"
          placeholder="91+ 123123123"
            className="border-none outline-none focus:outline-none foucs:border-none
            text-neutral-800 placeholder:text-neutral-900 font-medium dark:placeholder:text-white 
            "
          />

          <Label htmlFor="fullName" className="text-sm text-neutral-500 dark:text-neutral-400">Member Ship Plan</Label>
          <Input 
          name="fullName"
          placeholder="Exclusive (6 Month Plan)"
            className="border-none outline-none focus:outline-none foucs:border-none
            text-neutral-800 placeholder:text-neutral-900 font-medium dark:placeholder:text-white 
            "
          />

          <Label htmlFor="fullName" className="text-sm text-neutral-500 dark:text-neutral-400">Joining Date</Label>
          <Input 
          name="fullName"
          placeholder="23/03/2320"
            className="border-none outline-none focus:outline-none foucs:border-none
            text-neutral-800 placeholder:text-neutral-900 font-medium dark:placeholder:text-white 
            "
          />
        </div>
      </div>
      <div className="w-full max-w-5xl ">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Diet Plan</h1>
          <Button className="cursor-pointer">
            <FilePenLine className="size-8" />
          </Button>
        </div>
        {/* diet plan data */}
        <div className="my-4">
          <Textarea placeholder="" disabled />
        </div>

      </div>
    </div>
  );
};

export default Profile;
