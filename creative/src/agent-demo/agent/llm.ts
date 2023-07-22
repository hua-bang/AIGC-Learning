import { Configuration, ConfigurationParameters, OpenAIApi } from "openai";
import { Tool } from "./tool";

export class LLM {
  openai: OpenAIApi;

  constructor(config: ConfigurationParameters) {
    const configuration = new Configuration({
      apiKey: config.apiKey,
      basePath: config.basePath,
    });
    this.openai = new OpenAIApi(configuration);
  }

  async understand(instruction: string, result: string | null, tools: Tool[]) {
    // 提取工具信息
    const toolInfo = tools.map(tool => `${tool.name}: ${tool.description}`).join(', ');

    // 生成提示词
    let prompt = '';
    if (result) {
      // 如果有结果，让 LLM 加工结果
      prompt = `You are a helpful assistant. The user says: "${instruction}". The result from the tool is: "${result}". Based on the user's instruction and the tool's result, decide the next action. Your can processing result in params, but must respond with {"action": "output_result", "params": {"result": "the final result"}}.`;
    } else {
      // 如果没有结果，让 LLM 决定下一步动作
      prompt = `You are a helpful assistant. You have the following tools at your disposal: ${toolInfo}. The user says: "${instruction}". Based on the user's instruction and the tools available, decide the next action. If a tool should be used, respond with {"action": "call_tool", "params": {"toolName": "the name of the tool", "toolInput": "the input for the tool"}}. If the final result should be output, respond with {"action": "output_result", "params": {"result": "the final result"}}. Please note that the tool name should be one of the available tools and the tool input should be a valid input for that tool.`;
    }

    const response = await this.openai.createChatCompletion({
      model: 'gpt-4-0613',
      messages: [
        {
          role: 'system',
          content: prompt,
        },
        {
          role: 'user',
          content: instruction,
        },
      ],
    });
    const { action, params } = JSON.parse(response.data.choices[0].message.content);
    return { action, params };
  }
}