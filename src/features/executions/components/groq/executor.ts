import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import { generateText } from "ai"
import { createGroq  } from "@ai-sdk/groq"
import Handlebars from "handlebars"
import { groqChannel } from "@/inngest/channels/groq";

Handlebars.registerHelper("json", (context) => {
  const jsonString = JSON.stringify(context, null, 2)
  const safeString = new Handlebars.SafeString(jsonString)

  return safeString
})

type GroqData = {
  variableName?: string
  model?: string
  systemPrompt?: string
  userPrompt?: string
}

export const groqExecutor: NodeExecutor<GroqData> = async ({
  data,
  nodeId,
  context,
  step,
  publish
}) => {

  await publish(
    groqChannel().status({
      nodeId,
      status: "loading"
    })
  )

  if(!data.variableName){
    await publish(
      groqChannel().status({
        nodeId,
        status: "error"
      })
    )

    throw new NonRetriableError("Groq node: Variable name is missing")
  }

  if(!data.userPrompt){
    await publish(
      groqChannel().status({
        nodeId,
        status: "error"
      })
    )

    throw new NonRetriableError("Groq node: Use prompt is missing")
  }

  const systemPropmt = data.systemPrompt
    ? Handlebars.compile(data.systemPrompt)(context)
    : "You are helpful assistant."
  const userPrompt = Handlebars.compile(data.userPrompt)(context)

  const credentialValue = process.env.GROQ_API_KEY!

  const groq = createGroq ({
    apiKey: credentialValue
  })

  try{
    const { steps } = await step.ai.wrap(
      "groq-generate-text",
      generateText,
      {
        model: groq(data.model || "openai/gpt-oss-120b"),
        system: systemPropmt,
        prompt: userPrompt,
        experimental_telemetry: {
          isEnabled:true,
          recordInputs: true,
          recordOutputs: true
        }
      }
    )

    const text = 
      steps[0].content[0].type === "text"
      ? steps[0].content[0].text
      : ""
    
    await publish(
      groqChannel().status({
        nodeId,
        status: "success"
      })
    )

    return {
      ...context,
      [data.variableName]: {
        text
      }
    }
  } catch (error) {
    await publish(
      groqChannel().status({
        nodeId,
        status: "error"
      })
    )
    throw error
  }
}