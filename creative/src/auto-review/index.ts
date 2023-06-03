import readline from 'readline';
import { log } from './helper';
import { autoCodeView } from './core';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('请输入你的 pullNumber：', (number: string) => {
  rl.close();
	
	if (!number) {
		log('没有 输入 pullNumber');
	}

	autoCodeView(Number(number));
});