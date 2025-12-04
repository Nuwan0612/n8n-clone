'use client'

import { Node, NodeProps, useReactFlow } from "@xyflow/react"
import { GlobeIcon } from "lucide-react"
import { memo, useState } from "react"
import { BaseExcutionNode } from "../base-execution-node"
import { FormType, HttpRequestDialog } from "./dialog"
import { methods } from "better-auth/client"

type HttpRequestNodeData = {
  endpoint?: string
  method?: "GET" | 'POST' | "PUT" | "PATCH" | "DELETE"
  body?: string
  [key: string] : unknown
}

type HttpRequestNodeType = Node<HttpRequestNodeData>

export const HttpRequestNode = memo((props: NodeProps<HttpRequestNodeType>) => {

  const [dialogOpen, setDialogOpen] = useState(false)

  const { setNodes } = useReactFlow()

  const nodeData = props.data
  const description = nodeData?.endpoint
    ? `${nodeData.method || "GET"}: ${nodeData.endpoint}`
    : "Not configured"

  const nodeStatus = "initial"

  const handleOpenSettings = () => setDialogOpen(true)

  const handleSubmit = (values: FormType) => {
    setNodes((nodes) => nodes.map((node => {
      if(node.id === props.id){
        return {
          ...node,
          data: {
            ...node.data,
            endpoint: values.endpoint,
            method: values.method,
            body: values.body
          }
        }
      }
      return node
    })))
  }

  return(
    <>
    <HttpRequestDialog 
      open={dialogOpen}
      onOpenChange={setDialogOpen}
      onSubmit={handleSubmit}
      defaultEndpoint={nodeData.endpoint}
      defaultMethod={nodeData.method}
      defaultBody={nodeData.body}
    />
      <BaseExcutionNode 
        {...props}
        id={props.id}
        icon={GlobeIcon}
        name="HTTP Request"
        status={nodeStatus}
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  )
})

HttpRequestNode.displayName = "HttpRequestNode"