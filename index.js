"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  var desc = Object.getOwnPropertyDescriptor(m, k);
  if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
    desc = { enumerable: true, get: function() { return m[k]; } };
  }
  Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
  Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
  o["default"] = v;
});
var __importStar = (this && this.__importStar) || function(mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null)
    for (var k in mod)
      if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
  __setModuleDefault(result, mod);
  return result;
};
var __awaiter = (this && this.__awaiter) || function(thisArg, _arguments, P, generator) {
  function adopt(value) { return value instanceof P ? value : new P(function(resolve) { resolve(value); }); }
  return new(P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }

    function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }

    function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Jishaku = void 0;

const child_process = __importStar(require("child_process"));
const os_1 = require("os");
const fs_1 = require("fs");
const path_1 = require("path");
const axios_1 = require("axios");
const displus_1 = require("displus");
const encoding = require("encoding-japanese");
const packageData = JSON.parse(fs_1.readFileSync(path_1.join(__dirname, "./package.json"), "utf-8"));
let isShRunning = false;
class Logger {
  constructor(funcName = "default") {
    this.funcName = "default";
    this.funcName = funcName;
  }
  info(...message) {
    console.info([`${packageData.name}: ${this.funcName} (INFO)`], ...message);
  }
  error(...message) {
    console.error([`${packageData.name}: ${this.funcName} (ERROR)`], ...message);
  }
}
class Jishaku {
  constructor(client, djskInitConfig) {
    this.client = client;
    this.prefix = djskInitConfig?.prefix || '.';
    this.djskInitConfig = djskInitConfig;
    this.djskInitConfig.consoleLog = typeof djskInitConfig?.consoleLog === 'boolean' ? djskInitConfig.consoleLog : true;
    const logger = new Logger("init");
    if (this.djskInitConfig?.consoleLog) axios_1.get(`https://registry.npmjs.org/${packageData.name}`).then(npmResponse => {
      const npmLatestVersion = npmResponse.data['dist-tags'].latest;
      if (packageData.version !== npmLatestVersion) logger.info("=====package notice=====\n", `A new version is available!\n`, `Current version: ${packageData.version}\n`, `Latest version: ${npmLatestVersion}\n`, `Update: npm i ${packageData.name}@latest\n`, "=====package notice=====");
    });
    if (this.djskInitConfig?.consoleLog) logger.info(`=====${packageData.name}=====\n`, "Initialization of discord.jsk is complete!\n", `=====${packageData.name}=====\n`);
  }
  async onMessageCreated(message) {
    return __awaiter(this, void 0, void 0, function*() {
      this.message = message;
      let isMessageSended = false;
      let count = 0;
      let currentContent = new String();
      let createdMessage = {};
      if (!this.djskInitConfig.useableUserId.includes(message.author.id))
        return;
      if (!message.content?.startsWith(`${this.prefix}jsk `))
        return;
      if (message.content.startsWith(`${this.prefix}jsk help`)) {
        const content = `
          \`\`\`
          # Commands
            - ${this.prefix}jsk help
            > Show help.
            - ${this.prefix}jsk ping
            > Pong.
            - ${this.prefix}jsk sh {commands}
            > Evaluate Terminal commands.
            - ${this.prefix}jsk js {commands}
            > Evaluate JavaScript commands.
            - ${this.prefix}jsk shutdown
            > Shutdown.
          \`\`\`
        `;
        try {
          msssage.reply(content);
        } catch {}
      }
      if (message.content.startsWith(`${this.prefix}jsk ping`)) {
        try {
          message.reply('```\nPong.\n```')
        } catch {}
      }
      if (message.content.startsWith(`${this.prefix}jsk sh `)) {
        if (isShRunning && !this.djskInitConfig.allowMultiShRunning) {
          message.reply("You are trying to run multiple sh processes, but cannot because the allowMultiShRunning option is disabled.\nAlso, use of the allowMultiShRunning option is deprecated.");
        }
        const toString = (bytes) => {
          return encoding.convert(bytes, {
            from: "SJIS",
            to: "UNICODE",
            type: "string",
          });
        };
        const cmd = message.content.replace(`${this.prefix} sh `, "");
        const command = displus_1.rawCode(cmd);
        const spawnProcess = child_process.spawn("cmd", ["/c", command], {
          //@ts-ignore
          encoding: "Shift_JIS",
        });
        isShRunning = true;
        spawnProcess.stdout.on("data", (data) => {
          currentContent +=
            this.djskInitConfig.encoding.toLowerCase() == "shift_jis" ?
            toString(data) :
            String(data);
        });
        const logger = new Logger("shell");
        const timeout = setInterval(() => __awaiter(this, void 0, void 0, function*() {
          try {
            if (isMessageSended) {
              // writeFileSync(
              //   "src/config/latest-jsk-log.json",
              //   toString(currentContent)
              // );
              // const file = readFileSync("src/config/latest-jsk-log.json");
              if (createdMessage) {
                yield createdMessage.edit(`\n\`\`\`Command: ${command} \n\n${currentContent.length > 1900
                  ? currentContent.slice(currentContent.length - 1900)
                  : currentContent}\`\`\``);
              } else {
                createdMessage = yield message.reply(`\n\`\`\`Command: ${command} \n\n${currentContent.length > 1900
                  ? currentContent.slice(currentContent.length - 1900)
                  : currentContent}\`\`\``);
              }
            } else {
              isMessageSended = true;
              // writeFileSync(
              //   "src/config/latest-jsk-log.json",
              //   toString(currentContent)
              // );
              // const file = readFileSync("src/config/latest-jsk-log.json");
              createdMessage = yield message.reply(`\n\`\`\`Command: ${command} \n\n${currentContent.length > 1900
                ? currentContent.slice(currentContent.length - 1900)
                : currentContent}\`\`\``);
            }
          } catch (error) {
            if (this.djskInitConfig?.consoleLog) logger.error("An error has occurred.", error);
          }
        }), 2000);
        spawnProcess.on("close", () => __awaiter(this, void 0, void 0, function*() {
          isShRunning = false;
          try {
            if (isMessageSended) {
              // writeFileSync(
              //   "src/config/latest-jsk-log.json",
              //   toString(currentContent)
              // );
              // const file = readFileSync("src/config/latest-jsk-log.json");
              try {
                if (createdMessage) {
                  yield createdMessage.edit(`\n\`\`\`Command: ${command} \n\n${currentContent.length > 1900
                    ? currentContent.slice(currentContent.length - 1900)
                    : currentContent}\`\`\``);
                } else {
                  console.log(currentContent.slice(currentContent.length - 1900).length, currentContent.length);
                  createdMessage = yield message.reply(`\n\`\`\`Command: ${command} \n\n${currentContent.length > 1900
                    ? currentContent.slice(currentContent.length - 1900)
                    : currentContent}\`\`\``);
                }
              } catch (error) {
                if (this.djskInitConfig?.consoleLog) logger.error("An error has occurred.", error);
              }
            } else {
              isMessageSended = true;
              // writeFileSync(
              //   "src/config/latest-jsk-log.json",
              //   toString(currentContent)
              // );
              // const file = readFileSync("src/config/latest-jsk-log.json");
              // createdMessage = await message.reply(
              //   /* { files: [{ name: "file.json", attachment: file }] } */ "a```\n" +
              //     command +
              //     "\n" +
              //     (toString(currentContent).length > 1900)
              //     ? toString(currentContent).slice(1900)
              //     : toString(currentContent) + "\n```"
              // );
              createdMessage = yield message.reply(`\n\`\`\`Command: ${command} \n\n${currentContent.length > 1900
                ? currentContent.slice(currentContent.length - 1900)
                : currentContent}\`\`\``);
            }
          } catch (error) {
            if (this.djskInitConfig?.consoleLog) logger.error("An error has occurred.", error);
          }
          const tempLogMsgId = createdMessage.id;
          createdMessage.react("✅");
          this.client.on("messageReactionAdd", (react, user) => __awaiter(this, void 0, void 0, function*() {
            if (react.emoji.name == "✅" &&
              react.message.id == tempLogMsgId &&
              this.djskInitConfig.useableUserId.includes(user.id)) {
              const tmpdirName = (0, os_1.tmpdir)() + "djsk-log-" + new Date().getMilliseconds;
              (0, fs_1.writeFileSync)(tmpdirName, currentContent.toString());
              const file = (0, fs_1.readFileSync)(tmpdirName);
              yield message.reply({
                files: [{ name: "file.json", attachment: file }],
              });
            }
          }));
          clearInterval(timeout);
          isMessageSended = false;
          //@ts-ignore
          createdMessage = {};
        }));
      } else if (message.content.startsWith(`${this.prefix}jsk js `)) {
        const logger = new Logger("javascript");
        const cmd = message.content.replace(`${this.prefix}jsk js `, "");
        const command = displus_1.rawCode(cmd);
        
        try {
          const client = this.client;
          let result;
          /*
          const originalToken = this.client.ws.client.token;
          
          if (this.djskInitConfig.safemode) {
            const require = undefined;
            const fs_1 = undefined;
            process.env = {};
            const originalToken = undefined;
            result = yield eval(`(async () => { client.ws.client.token = undefined;${command} })()`);
          } else {
            result = yield eval(`(async () => { ${command} })()`);
          }
          */
          result = yield eval(`(async () => { ${command} })()`);
          console.log(typeof result)
          result = typeof result === 'object' ? JSON.stringify(result) : String(result);
          if (this.djskInitConfig?.consoleLog) console.log(result);

          message.reply("```\n" + result + "\n```").catch((error) => {
            message.reply("```\n" + error + "\n```");
          });
        } catch (error) {
          if (this.djskInitConfig?.consoleLog) logger.error("An error has occurred.", error);
          message.reply("```\n" + error + "\n```");
        }
      } else if (message.content.startsWith(`${this.prefix}jsk shutdown`)) {
        const logger = new Logger("shutdown");
        yield message.reply("Goodbye👋");
        this.client.destroy();
        process.exit(0);
      }
    });
  }
}
exports.Jishaku = Jishaku;
