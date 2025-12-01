import { inngest } from "./client";
import { generateText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createGroq } from '@ai-sdk/groq';
import * as Sentry from "@sentry/nextjs";


const google = createGoogleGenerativeAI({})
const openai = createOpenAI({})
const anthropic = createAnthropic({})
const groq = createGroq({})

export const execute = inngest.createFunction(
  { id: "execute-ai" },
  { event: "execute/ai" },
  async ({ event, step }) => {
   const { steps: geminiSteps } = await step.ai.wrap(
    "gemini-generate-text", 
    generateText, 
    {
      model: google('gemini-2.5-flash'),
      system: "You are a helpful assistant that generates text based on user prompts.",
      prompt: "What is 2 + 2?",
      experimental_telemetry: {
        isEnabled: true,
        recordInputs: true,
        recordOutputs: true,
      },
   }) 

   const { steps: openai120Steps } = await step.ai.wrap(
    "openai120-generate-text", 
    generateText, 
    {
      model: groq("openai/gpt-oss-120b"),
      system: "You are a helpful assistant that generates text based on user prompts.",
      prompt: "What is 2 + 2?",
      experimental_telemetry: {
        isEnabled: true,
        recordInputs: true,
        recordOutputs: true,
      },
   }) 

   const { steps: openaiSteps } = await step.ai.wrap(
    "openai-generate-text", 
    generateText, 
    {
      model: openai('gpt-4-turbo'),
      system: "You are a helpful assistant that generates text based on user prompts.",
      prompt: "What is 2 + 2?",
      experimental_telemetry: {
        isEnabled: true,
        recordInputs: true,
        recordOutputs: true,
      },
   }) 

   const { steps: anthropicSteps } = await step.ai.wrap(
    "anthropic-generate-text", 
    generateText, 
    {
      model: anthropic("claude-opus-4-0"),
      system: "You are a helpful assistant that generates text based on user prompts.",
      prompt: "What is 2 + 2?",
      experimental_telemetry: {
        isEnabled: true,
        recordInputs: true,
        recordOutputs: true,
      },
   }) 

  
   return {
    geminiSteps,
    openaiSteps,
    anthropicSteps,
    openai120Steps
   };
  },
);