import * as dotenv from 'dotenv';
import { Agent } from "./agent";
import path from 'path';
import { LLM } from './agent/llm';
import { Tool } from './agent/tool';

dotenv.config({
  path: path.resolve('../../.env')
});

const llm = new LLM({
  apiKey: process.env.OPENAI_API_KEY,
  basePath: process.env.OPENAI_API_BASE_URL
});

// 假设我们有一个天气工具
const weatherTool: Tool = {
  name: 'weather',
  description: 'Provide weather information. Input should be a location.',
  call: async (input: string) => {
    // 这里只是一个假设的实现，实际上应该调用一个真正的天气 API
    return `The weather in ${input} is sunny.`;
  },
};

// 假设我们有一个计算工具
const calculatorTool: Tool = {
  name: 'calculator',
  description: 'Perform calculations. Input should be a mathematical expression.',
  call: async (input: string) => {
    // 这里只是一个假设的实现，实际上应该使用一个真正的计算器库
    return `The result of ${input} is ${eval(input)}.`;
  },
};

// 创建一个 Agent 实例
const agent = new Agent(llm, [weatherTool, calculatorTool], true);

// 使用 Agent 处理一些指令
agent.processInstruction('What is the weather in San Francisco?')
  .then(result => console.log(result))
  .catch(error => console.error(error));