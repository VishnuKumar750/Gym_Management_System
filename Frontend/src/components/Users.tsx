import { Table, TableBody, TableCaption, TableCell, TableHead,
     TableHeader, TableRow } from './ui/table';
import {  EllipsisVertical, Pencil, SearchIcon, Trash } from 'lucide-react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from './ui/pagination';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Separator } from './ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';

import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";

const gymUsers = [
  {
    userId: "U001",
    name: "Rahul Sharma",
    paymentStatus: "Paid",
    actions: {
      edit: "edit-icon",
      delete: "delete-icon",
    },
  },
  {
    userId: "U002",
    name: "Ananya Singh",
    paymentStatus: "Unpaid",
    actions: {
      edit: "edit-icon",
      delete: "delete-icon",
    },
  },
  {
    userId: "U003",
    name: "Vikram Mehta",
    paymentStatus: "Pending",
    actions: {
      edit: "edit-icon",
      delete: "delete-icon",
    },
  },
  {
    userId: "U004",
    name: "Pooja Verma",
    paymentStatus: "Paid",
    actions: {
      edit: "edit-icon",
      delete: "delete-icon",
    },
  },
  {
    userId: "U005",
    name: "Aman Gupta",
    paymentStatus: "Paid",
    actions: {
      edit: "edit-icon",
      delete: "delete-icon",
    },
  },
  {
    userId: "U006",
    name: "Sneha Chauhan",
    paymentStatus: "Unpaid",
    actions: {
      edit: "edit-icon",
      delete: "delete-icon",
    },
  },
  {
    userId: "U007",
    name: "Rakesh Kumar",
    paymentStatus: "Pending",
    actions: {
      edit: "edit-icon",
      delete: "delete-icon",
    },
  },
  {
    userId: "U008",
    name: "Megha Jain",
    paymentStatus: "Paid",
    actions: {
      edit: "edit-icon",
      delete: "delete-icon",
    },
  },
  {
    userId: "U009",
    name: "Sahil Arora",
    paymentStatus: "Unpaid",
    actions: {
      edit: "edit-icon",
      delete: "delete-icon",
    },
  },
  {
    userId: "U010",
    name: "Divya Kapoor",
    paymentStatus: "Paid",
    actions: {
      edit: "edit-icon",
      delete: "delete-icon",
    },
  },
];

const handleDelete = (userId: string) => {
    console.log('user deleted', userId)
}


const Users = () => {
  return (
    <div className='w-full max-w-7xl mx-auto dark:text-white'>
      <div className='flex items-center justify-between gap-6 '>
        <div className='w-full max-w-md bg-neutral-200 my-4 flex items-center px-4 rounded-md'>
            <Label htmlFor='search'>
                <SearchIcon className='text-neutral-600'  />
            </Label>
            <Input type='text' id='search' className='w-full max-w-sm border-none bg-neutral-200 focus:outline-none focus:border-0' />
        </div>

        <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-neutral-700 hover:bg-neutral-800 text-white dark:bg-neutral-700 dark:hover:bg-neutral-600">
          Add User
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md bg-white dark:text-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Add Gym Member
          </DialogTitle>
          <DialogDescription className="text-neutral-600 dark:text-neutral-400">
            Enter details to add a new gym member.
          </DialogDescription>
        </DialogHeader>

        {/* FORM */}
        <div className="space-y-4 ">

          {/* Name */}
          <div className="space-y-1">
            <Label>Full Name</Label>
            <Input
              placeholder="Enter member name"
              className="bg-neutral-100 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700"
            />
          </div>

          {/* Email */}
          <div className="space-y-1">
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="Enter email"
              className="bg-neutral-100 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700"
            />
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <Label>Phone Number</Label>
            <Input
              type="tel"
              placeholder="Enter phone number"
              className="bg-neutral-100 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700"
            />
          </div>

          {/* Membership Type */}
          <div className="space-y-1">
            <Label>Membership Type</Label>
            <Select>
              <SelectTrigger className="bg-neutral-100 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700">
                <SelectValue placeholder="Select membership" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white border-neutral-200 dark:border-neutral-700">
                <SelectItem value="regular">Regular</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="exclusive">Exclusive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Payment Status */}
          <div className="space-y-1">
            <Label>Payment Status</Label>
            <Select>
              <SelectTrigger className="bg-neutral-100 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700">
                <SelectValue placeholder="Select payment status" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white border-neutral-200 dark:border-neutral-700">
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="unpaid">Unpaid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Start Date */}
          <div className="space-y-1">
            <Label>Start Date</Label>
            <Input
              type="date"
              className="bg-neutral-100 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700"
            />
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <Label>Notes (Optional)</Label>
            <Textarea
              placeholder="Extra details"
              className="bg-neutral-100 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700"
            />
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex justify-end gap-3 pt-3">
          <DialogClose asChild>
            <Button
              variant="outline"
              className="border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-100"
            >
              Cancel
            </Button>
          </DialogClose>

          <Button className="text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200">
            Add Member
          </Button>
        </div>
      </DialogContent>
    </Dialog>
    </div>

      <Table>
        <TableCaption>List of users</TableCaption>
        <TableHeader>
            <TableRow>
                <TableHead>userId</TableHead>
                <TableHead>name</TableHead>
                <TableHead>Payment Status</TableHead>
                <TableHead>
                    Actions
                </TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {gymUsers.map((user) => (
                <TableRow key={user.userId}>
                    <TableCell>{user.userId}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>
                        <Badge 
                        variant={"secondary"}
                        className={`${user.paymentStatus === 'Paid' ? "bg-green-500" : "bg-red-500"} text-white`}>
                            {user.paymentStatus}
                        </Badge>
                    </TableCell>
                    <TableCell className='cursor-pointer'>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button >
                                    <EllipsisVertical />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className='w-36 bg-neutral-800 text-white border-neutral-700 shadow-2xl'>
                                <div className=''>
                                    <a className='flex items-center justify-between py-3'>
                                        Edit
                                        <Pencil className='size-5' />
                                    </a>
                                    <Separator className='bg-neutral-600' />
                                    <AlertDialog >
                                        <AlertDialogTrigger className='flex items-center justify-between w-full py-3'>
                                            Delete
                                            <Trash className='size-5' />
                                        </AlertDialogTrigger>
                                        <AlertDialogContent className='bg-neutral-900 text-white border-neutral-700'>
                                            <AlertDialogHeader>
                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This will permanently delete account
                                                and remove your data from our servers.
                                            </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                            <AlertDialogCancel className='bg-neutral-800 hover:bg-neutral-700 border-neutral-700'>Cancel</AlertDialogCancel>
                                            <AlertDialogAction className='bg-red-600 hover:bg-red-700 text-white rounded-md transition' onClick={() => handleDelete(user.userId)}>Continue</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                        </AlertDialog>
                                </div>
                            </PopoverContent>
                        </Popover>
                        
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
      </Table>

    <div className='w-full flex  items-end justify-end my-12'>
      <Pagination>
        <PaginationContent>
            <PaginationItem>
                <PaginationPrevious href='#' />
            </PaginationItem>
            <PaginationItem>
                <PaginationLink href='#'>1</PaginationLink> 
            </PaginationItem>
            <PaginationItem>
                <PaginationLink href='#'>2</PaginationLink> 
            </PaginationItem>
            <PaginationItem>
                <PaginationLink href='#'>3</PaginationLink> 
            </PaginationItem>
            <PaginationItem>
                <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
                <PaginationNext href='#' /> 
            </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
    </div>
  )
}

export default Users
