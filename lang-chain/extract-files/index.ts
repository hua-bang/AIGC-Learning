import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { loadQAStuffChain } from 'langchain/chains'
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { initConfig } from '../utils/init-config';

initConfig();

const openAIApiKey = process.env.OPENAI_API_KEY;

const basePath = process.env.OPENAI_BASE_PATH;

export const run = async () => {

  const loader = new PDFLoader('./files/rspack/Introduction - Rspack.pdf'); 

  const docs = await loader.load();

  const llm = new ChatOpenAI({ openAIApiKey, temperature: 0 }, {
    basePath,
  });

  const qaChain = loadQAStuffChain(llm);

  const res = await qaChain.call({
    input_documents: docs,
    question: "What is rspack? And What about the future of rspack?",
    verbose: true
  })

  console.log(`
    OutPut res: ${res.text}
  `);
};

run();