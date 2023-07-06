import { ChatGPTAPI } from 'chatgpt';

class ChatBot {

  private chatAPI: any;

  constructor(apiKey?: string) {
    this.chatAPI = new ChatGPTAPI({
      apiKey: process.env.OPENAI_API_KEY || apiKey,
      apiBaseUrl:  process.env.OPENAI_API_BASE_URL || 'https://api.openai.com/v1',
      completionParams: {
        model: 'gpt-3.5-turbo',
        temperature: 0,
        top_p: 1,
      },
    });
  }

  private generatePrompt = (patch: string) => {
    const prompt =
      'Below is a code diff, please help me do a code review, 没有修改意见的可以返回直接返回 OK, 如果有修改意见，请用中文哈:';
    return `${prompt}:
    ${patch}
    `;
  };

  async codeReview(patch: string) {
    const prompt = this.generatePrompt(patch);
    const res = await this.chatAPI?.sendMessage(prompt);
    return res.text;		
  }
}

export default ChatBot;