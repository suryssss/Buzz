import React, { Dispatch, SetStateAction } from 'react'
import { Id } from '../../../../../../convex/_generated/dataModel'
import { useMutationState } from '@/hooks/useMutationState'
import { api } from '../../../../../../convex/_generated/api'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

type Props = {
  conversationId: Id<'conversations'>
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

const DeleteGroupDialog = ({ conversationId, open, setOpen }: Props) => {
  const { mutate: deleteGroup, pending } = useMutationState(api.conversations.deleteGroup)

  const handleDeleteGroup = async () => {
    await deleteGroup({ conversationId })
      .then(() => {
        toast.success('Group deleted')
        setOpen(false) // close dialog after success
      })
      .catch((error) => {
        toast.error(
          error instanceof Error ? error.message : 'Something went wrong'
        )
      })
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>DeleteGroup</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove this Group? This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteGroup} disabled={pending}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteGroupDialog
