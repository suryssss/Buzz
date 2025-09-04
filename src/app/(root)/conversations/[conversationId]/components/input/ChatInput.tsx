'use client'
import { Card } from '@/components/ui/card'
import { useConversation } from '@/hooks/useConversation'
import { useMutationState } from '@/hooks/useMutationState'
import React from 'react'
import z from 'zod'
import { api } from '../../../../../../../convex/_generated/api'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import TextareaAutosize from "react-textarea-autosize"
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { SendHorizonal } from 'lucide-react'
 const chatMessageSchema=z.object({
    content:z.string().min(1,{message:"Message cannot be empty"}),

 })
 
 const ChatInput = () => {


    const {conversationId}=useConversation();

    const {mutate:createMessage,pending}=useMutationState(api.message.create)

    const form =useForm<z.infer<typeof chatMessageSchema>>({
        resolver:zodResolver(chatMessageSchema),
        defaultValues :{content:""}
    })

    // Use react-hook-form's native onChange for better perf/caret handling

    const handleSubmit = async (values: z.infer<typeof chatMessageSchema>) => {
      const trimmed = values.content.trim();
      if (!trimmed) return;

      // simple retry with backoff
      const send = async () => {
        let attempt = 0;
        const maxAttempts = 3;
        const baseDelay = 300;
        while (attempt < maxAttempts) {
          try {
            await createMessage({
              conversationId,
              type: "text",
              content: [trimmed],
            });
            form.reset();
            return;
          } catch (error) {
            attempt++;
            if (attempt >= maxAttempts) {
              toast.error(error instanceof Error ? error.message : "unexpected error occured");
              return;
            }
            const delay = baseDelay * Math.pow(2, attempt);
            await new Promise((r) => setTimeout(r, delay));
          }
        }
      };
      const ev = new CustomEvent('optimistic-message', { detail: { content: trimmed } })
      document.dispatchEvent(ev)

      await send();
    }
   return (
     <Card className='w-full p-2 rounded-lg relative '>
     <div className='flex gap-2 items-end w-full'>
        <Form {...form}><form onSubmit={form.handleSubmit(handleSubmit)} className='flex gap-2 items-end w-full'>
            <FormField control={form.control} name="content"
                render={({field})=>{
                    return  <FormItem className='h-full w-full'>
                        <FormControl>
                        <TextareaAutosize onKeyDown={async e=>{
                            if (e.key==="Enter" && !e.shiftKey){
                                e.preventDefault()
                                await form.handleSubmit(handleSubmit)()
                            }
                        }}
                        rows={1} maxRows={3}
                            {...field}
                            placeholder='Type your message here...'
                            className='min-h-full w-full resize-none border-0 outline-0 bg-card text-card-foreground 
                            placeholder:text-muted-foreground p-1.5 '/> 
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                }}/>
            <motion.div whileTap={{ scale: pending ? 1 : 0.96 }} whileHover={{ scale: pending ? 1 : 1.04 }}>
              <Button disabled={pending} size='icon' type='submit' title={pending ? 'Sending…' : 'Send'}>
                <SendHorizonal className={pending ? 'opacity-60' : ''}/>
              </Button>
            </motion.div>
        </form>
        </Form>
     </div>
    </Card>
   )
 }
 
 export default ChatInput