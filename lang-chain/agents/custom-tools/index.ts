import { ChatOpenAI } from "langchain/chat_models/openai";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { SerpAPI, Tool } from "langchain/tools";
import { Calculator } from "./calculator";
import { Weather } from './weather';
import { initConfig } from "../../utils/init-config";

initConfig();

const openAIApiKey = process.env.OPENAI_API_KEY;

const basePath = process.env.OPENAI_BASE_PATH;

const serpApiKey = process.env.SERP_API_KEY;


export const run = async () => {
  // 1. 配置你的 LLM, 不一定是 OpenAI 的，可以用自己私有模型
  const llm = new ChatOpenAI({ openAIApiKey, temperature: 0 }, {
    basePath
  });
  
  // 2. 配置你的 Tools 工具
  const tools: Tool[] = [
    // SerpAPI, 这里提供搜索服务。
    new SerpAPI(serpApiKey),
    // Calculator, 这里提供计算服务。
    new Calculator() as any,
    // Weather, 这里提供天气服务
    new Weather()
  ];

  // 3. agent_executor 的配置，这时候会讲 Tools 和 model 扔进去
  const executor = await initializeAgentExecutorWithOptions(tools, llm, {
    agentType: "chat-conversational-react-description",
    // 配置这个，可以 Agent 具体执行的流程
    verbose: true,
  });

  const input = `
    I want to know the result calculate 9/3 
  `;

  const result = await executor.call({ input: input });

  console.log(`Got output:
    ${result.output}
  `);
};

run();

// console.log('math tools', new Calculator());