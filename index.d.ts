import { Client, Message } from "discord.js";
interface djskConfig {
  prefix?: string;
  safemode?: boolean;
  encoding: string;
  useableUserId: Array<string>;
  allowMultiShRunning?: boolean;
}
export declare class Jishaku {
  client: Client;
  message: Message | undefined;
  djskInitConfig: djskConfig;
  constructor(client: Client, djskInitConfig: djskConfig);
  onMessageCreated(message: Message): Promise<void>;
}
export {};
