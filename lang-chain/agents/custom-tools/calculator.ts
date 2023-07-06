export class Calculator {
  
  name: string =  'calculator';
  
  description: string = 'Useful for getting the result of a math expression. The input to this tool should be a valid mathematical expression that could be executed by a simple calculator.';

  cal(symbol: '+' | '-' | '*' | '/', leftOperate: number, rightOperate: number) {
    if (symbol === '+') {
      return leftOperate + rightOperate;
    }
    if (symbol === '-') {
      return leftOperate - rightOperate;
    }
    if (symbol === '*') {
      return leftOperate * rightOperate;
    }
    if (symbol === '/') {
      return leftOperate / rightOperate;
    }
    return 0;
  }
  
  call(input: string): Promise<number> {

    const symbols = ['+', '-', '*', '/'];

    console.log(
      `exec custom math tool, input: ${input} `
    );

    const targetSymbol = symbols.find(symbol => input.includes(symbol));

    if (!targetSymbol) {
      return Promise.resolve(0);
    }

    const [leftOperate, rightOperate] = input.split(targetSymbol).map(word => Number(word.trim()));

    
    return Promise.resolve(this.cal(targetSymbol as '+' | '-' | '*' | '/', leftOperate, rightOperate));
  }
}