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

const RemoveFriendDialog = ({ conversationId, open, setOpen }: Props) => {
  const { mutate: removeFriend, pending } = useMutationState(api.friend.remove)

  const handleSubmit = async () => {
    await removeFriend({ conversationId })
      .then(() => {
        toast.success('Removed from friends')
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
          <AlertDialogTitle>Remove Friend</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove this friend? This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleSubmit} disabled={pending}>
            Remove
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default RemoveFriendDialog
