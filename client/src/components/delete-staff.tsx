import { Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import api from "@/axios/axios-api";

interface Props {
  staffId: string;
}

const deleteMember = async (staffId: string) => {
  const res = await api.delete(`/user/staffs/${staffId}`, {
    withCredentials: true,
  });
  return res.data;
};

export default function DeleteStaff({ staffId }: Props) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => deleteMember(staffId),
    onSuccess: () => {
      // invalidate members list
      queryClient.invalidateQueries({
        queryKey: ["members"],
      });
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" className="justify-start text-destructive">
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Member
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this member?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. All related data associated with this
            member will be permanently removed.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={mutation.isPending}>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {mutation.isPending ? "Deleting…" : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>

        {mutation.isError && (
          <div className="mt-3 rounded-md border border-destructive bg-destructive/10 p-3">
            <p className="text-sm text-destructive">
              Failed to delete staff. Please try again.
            </p>
          </div>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
