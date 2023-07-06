export class Weather {
  
  name: string = 'weather assistant';
  
  description: string = 'Ability to understand real-time weather. The input to this tool should contain place, time.';

  call(input: string): Promise<string> {
    console.log('exec custom weather tool, ', input);
    return Promise.resolve('天气多云转晴，最高温度 30 度，最低温度18度');
  }
}