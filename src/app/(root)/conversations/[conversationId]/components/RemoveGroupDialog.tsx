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

const RemoveGroupDialog = ({ conversationId, open, setOpen }: Props) => {
  const { mutate: leaveGroup, pending } = useMutationState(api.conversations.leaveGroup)

  const handleLeaveGroup = async () => {
    await leaveGroup({ conversationId })
      .then(() => {
        toast.success('Left from the group')
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
          <AlertDialogTitle>LeaveGroup</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to leave this Group? This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleLeaveGroup} disabled={pending}>
            Leave
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default RemoveGroupDialog
