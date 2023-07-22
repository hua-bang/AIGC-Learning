export interface Tool {
  name: string;
  description: string;
  call: (input: string) => Promise<string>;
}