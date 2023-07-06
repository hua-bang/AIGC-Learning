import { ChatOpenAI } from "langchain/chat_models/openai";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { SerpAPI } from "langchain/tools";
import { Calculator } from "langchain/tools/calculator";
import { initConfig } from "../utils/init-config";

initConfig();

const openAIApiKey = process.env.OPENAI_API_KEY;

const basePath = process.env.OPENAI_BASE_PATH;

const serpApiKey = process.env.SERP_API_KEY;

export const run = async () => {
  const model = new ChatOpenAI({ openAIApiKey, temperature: 0 }, {
    basePath
  });
  const tools = [
    new SerpAPI(serpApiKey),
    new Calculator(),
  ];
  // Passing "chat-conversational-react-description" as the agent type
  // automatically creates and uses BufferMemory with the executor.
  // If you would like to override this, you can pass in a custom
  // memory option, but the memoryKey set on it must be "chat_history".



  const executor = await initializeAgentExecutorWithOptions(tools, model, {
    agentType: "chat-conversational-react-description",
    verbose: true,
  });
  console.log("Loaded agent.");

  const input = `
   I want to know the result calculate 9/3 
  `;

  const result = await executor.call({ input: input });

  console.log(`Got output:
    ${result.output}
  `);
};

run();