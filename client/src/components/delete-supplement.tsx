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
import { Trash, Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/axios/axios-api";

/* ----------------------------- API ----------------------------- */

const deleteSupplement = async (id: string) => {
  const { data } = await api.delete(`/supplement/${id}`, {
    withCredentials: true,
  });
  return data;
};

/* ----------------------------- COMPONENT ----------------------------- */

export default function DeleteSupplement({
  supplementId,
}: {
  supplementId: string;
}) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteSupplement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supplements"] });
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="icon">
          <Trash className="w-4 h-4" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            product.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={mutation.isPending}>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction asChild>
            <Button
              variant="destructive"
              onClick={() => mutation.mutate(supplementId)}
              disabled={mutation.isPending}
            >
              {mutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Delete
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
