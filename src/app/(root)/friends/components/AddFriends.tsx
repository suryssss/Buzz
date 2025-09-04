"use client"
import React from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { UserPlus } from "lucide-react"
import { useMutationState } from "@/hooks/useMutationState"
import { api } from "../../../../../convex/_generated/api"
import { toast } from "sonner"

// No props for this component

const addFriendFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: "This field can't be empty" })
    .email("Please enter a valid email"),
})

const AddFriends: React.FC = () => {
  const {mutate:createRequest,pending}=useMutationState(api.request.create)

  const form = useForm<z.infer<typeof addFriendFormSchema>>({
    resolver: zodResolver(addFriendFormSchema),
    defaultValues: {
      email: "",
    },
  })

  const handleSubmit = async (values:z.infer<typeof addFriendFormSchema>)=>{
    await createRequest({email: values.email}).then(() => {
      form.reset();
      toast.success("Friend request sent successfully")
    }).catch((error)=>{
      toast.error(error instanceof Error ? error.message : "Something went wrong")
    })
  }

  return (
    <Dialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.96 }}>
              <Button size="icon" variant="outline">
                <UserPlus />
              </Button>
            </motion.div>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>Add a friend</TooltipContent>
      </Tooltip>

      <DialogContent>
        <DialogTitle>Add Friend</DialogTitle>
        <DialogDescription>Enter the email of the friend you want to add.</DialogDescription>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <div>
            <input
              type="email"
              placeholder="Friend's email"
              {...form.register("email")}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {form.formState.errors.email && (
              <p className="text-red-500 text-sm mt-1">{form.formState.errors.email.message}</p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={pending}>
            Send Invite
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddFriends
