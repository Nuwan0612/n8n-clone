'use client'

import { Button } from "@/components/ui/button";
import { requireAuth } from "@/lib/auth-utils"
import { useTRPC } from "@/trpc/client";
import { caller } from "@/trpc/server";
import { useMutation } from "@tanstack/react-query";

const Page = () => {

  const trcp = useTRPC()
//  await requireAuth();

//  const data  = await caller.getUsers();

  const testAi = useMutation(trcp.testAi.mutationOptions())

  return(
    <div className="min-h-screen min-w-screen flex items-center justify-center flex-col gap-y-6">
     <p>protected server component</p> 
      <Button disabled={testAi.isPending} onClick={() => testAi.mutate()}>Test AI</Button>
    </div>
  )
}

export default Page