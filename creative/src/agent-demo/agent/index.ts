import chalk from 'chalk';
import { LLM } from './llm';
import { Tool } from './tool';

export enum AgentState {
  INITIAL,
  CALL_LLM,
  CALL_TOOL,
  PROCESS_RESULT,
  HANDLE_ERROR,
  OUTPUT_RESULT
}

export class Agent {
  state: AgentState;
  llm: LLM;
  tools: Tool[];
  log: boolean = false;

  constructor(llm: LLM, tools: Tool[], log?: boolean) {
    this.state = AgentState.INITIAL;
    this.llm = llm;
    this.tools = tools;
    this.log = log;
  }

  async processInstruction(instruction: string) {
    let result = null;
    let actionInfo = null;

    let step = 1;

    let logEvent;

    if(this.log) {
      logEvent = (state: string, info: any) => {
        const res = chalk.cyan(`[Step: ${step}]: state === ${state}, info === ${info}.\n`);
        console.log(res);
        step = step + 1;
      }
    }

    while (this.state !== AgentState.OUTPUT_RESULT && this.state !== AgentState.HANDLE_ERROR) {
      try {
        switch (this.state) {
          case AgentState.INITIAL:
            this.state = AgentState.CALL_LLM;
            logEvent?.('AgentState.INITIAL', `user instruction is '${instruction}'`);
            break;
          case AgentState.CALL_LLM:
          case AgentState.PROCESS_RESULT:
            actionInfo = await this.callLLM(instruction, result);
            result = this.updateStateBasedOnAction(actionInfo);
            logEvent?.('AgentState.CALL_LLM', `actionInfo is ${JSON.stringify(actionInfo)}`);
            break;
          case AgentState.CALL_TOOL:
            result = await this.callTool(actionInfo.params);
            logEvent?.('AgentState.CALL_TOOL', `tool result 'is ${result}'`);
            this.state = AgentState.PROCESS_RESULT;
            break;
          default:
            throw new Error(`Invalid state, ${this.state}`);
        }
      } catch (error) {
        this.state = AgentState.HANDLE_ERROR;
        result = 'An error occurred.';
      }
    }

    return result;
  }

  async callLLM(instruction: string, result: string | null) {
    const { action, params } = await this.llm.understand(instruction, result, this.tools);
    return { action, params };
  }

  async callTool({ toolName, toolInput }: { toolName: string; toolInput: string }) {
    const toolToUse = this.tools.find(tool => tool.name === toolName);
    if (!toolToUse) {
      throw new Error(`Tool ${toolName} not found`);
    }
    const result = await toolToUse.call(toolInput);
    return result;
  }

  updateStateBasedOnAction(actionInfo: { action: string; params: any }) {
    if (actionInfo.action === 'call_tool') {
      this.state = AgentState.CALL_TOOL;
      return null;
    } else if (actionInfo.action === 'output_result') {
      this.state = AgentState.OUTPUT_RESULT;
      return actionInfo.params.result;
    }
    return null;
  }
}
