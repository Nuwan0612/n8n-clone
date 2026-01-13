'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"



import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import z from "zod"
import { Button } from "@/components/ui/button"
import { useEffect } from "react"


const formSchema = z.object({
  variableName: z
    .string()
    .min(1, { message: "Variable name is required" })
    .regex(/^[A-Za-z_$][A-Za-z0-9_$]*$/, {
      message: "Variable name must start with a letter or underscore and container only letters, numbers, and uderscores"
    }),
    content: z
      .string()
      .min(1, "Message content is required"),
    webhookUrl: z.string().min(1, "Webhook URL is required")
})

export type SlackFormValues = z.infer<typeof formSchema>

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (valuse: z.infer<typeof formSchema>) => void
  defaultValues?: Partial<SlackFormValues>
}

export const SlackDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues = {}
} : Props) => {



  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      variableName: defaultValues.variableName || "",
      content: defaultValues.content || "",
      webhookUrl: defaultValues.webhookUrl || ""
    }
  })

  useEffect(() => {
    if (open) {
      form.reset({
        variableName: defaultValues.variableName || "",
        content: defaultValues.content || "",
        webhookUrl: defaultValues.webhookUrl || ""
      })
    }
  }, [open, defaultValues, form])

  const watchVariableName = form.watch("variableName") || "mySlack"


  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values)
    onOpenChange(false)
  }

  return(
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Slack Configuration</DialogTitle>
          <DialogDescription>
            Configure the Slack webhook for this node.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form 
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8 mt-4"
          >

          <FormField 
            control={form.control}
            name="variableName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Variable Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="mySlack"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Use this name to reference the result in other nodes: {" "}
                  {`{{${watchVariableName}.text}}`}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField 
            control={form.control}
            name="webhookUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Webhook URL</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="https://hooks.slack.com/services/..."
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  <div className="rounded-lg bg-muted p-4 space-y-2">
                    <h4 className="font-medium text-sm">Setup instructions:</h4>
                    <ol className="text-sm text-muted-forground space-y-1 list-decimal list-inside">
                      <li>Open your Slack workspace</li>
                      <li>Go to Slack API: https://api.slack.com/apps</li>
                      <li>Click <b>Create New App</b> &#8594; From scratch</li>
                      <li>Enter an App Name and select your Workspace &#8594; Create App</li>
                      <li>In the left sidebar, click <b>Incoming Webhooks</b></li>
                      <li>Turn <b>Activate Incoming Webhooks</b> ON</li>
                      <li>Click <b>Add New Webhook to Workspace</b></li>
                      <li>Select the channel where messages should be posted &#8594; Allow</li>
                      <li>Copy the generated <b>Webhook URL</b></li>
                      <li>Paste this URL where your application asks for the webhookUrl</li>
                    </ol>
                  </div> 
                </FormDescription>
                <FormDescription>
                  Make sure the key is <b>"text"</b>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          

            <FormField 
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Summary: {{myGemini.text}}"
                      className="min-h-[80px] font-mono text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Message to send. Use {"{{variables}}"} for simple values or {"{{json variable}}"} to stringify objects
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-4">
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}