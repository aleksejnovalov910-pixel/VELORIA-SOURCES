import { LangString } from "../../modules/lang";
import React, {Component, createRef} from "react";
import "./style.less"
import {systemUtil} from "../../../shared/system";
import {CustomEvent} from "../../modules/custom.event";
import {CEF} from "../../modules/CEF";


type TerminalLineType = "input" | "output"

export class TerminalBlock extends Component<{}, {
    lines: [TerminalLineType, string][],
    blockInput: boolean
    display: boolean;
}>{
    input: React.RefObject<HTMLInputElement>;
    commands = new Map<string,(...args: string[]) => void>();
    div: React.RefObject<HTMLDivElement>;

    constructor(props: any) {
        super(props);
        this.state = {
            blockInput: false,
            lines: [],
            display: false
        }

        this.input = createRef()
        this.div = createRef()
        this.commands.set("help", () => {
            this.block = true;
            this.insertLine("output", LangString("components.Terminal.index.1ed44278fd7807e28ffef5e09ef218a3"));
            const commands = [...this.commands].map(q => q[0])
            for (let command in commands) {
                this.insertLine("output", commands[command]);
            }
            this.block = false;
        })
        this.commands.set("time", () => {
            this.insertLine("output", systemUtil.fullDateTime);
        })
        this.commands.set("search", (item) => {
            if (!item) return this.insertLine("output", LangString("components.Terminal.index.58d77b28c8c61f9c95b218e1d4960c63"));
            if (item === "terminal"){
                this.block = true;
                this.insertLine("output", LangString("components.Terminal.index.4d9123b5f9f3da8be5a5516eac66f6ad"));
                setTimeout(() => {
                    CustomEvent.callClient("terminal:search").then(id => {
                        this.block = false;
                        if (!id) return this.insertLine("output", LangString("components.Terminal.index.25dad7df58c56671411c7c874ea14a6f"));
                        else return this.insertLine("output", LangString("components.Terminal.index.be670c21e9c82c7d14fa49808c840452", id));
                    })
                }, systemUtil.getRandomInt(1000, 2000))
                return;
            }

            this.insertLine("output", LangString("components.Terminal.index.7d41f4e98a0a244e54f0031858a7b9ac"));
        })
        this.commands.set("bruteforce", async (item, handle) => {
            if (!item) return this.insertLine("output", LangString("components.Terminal.index.975362744bc3f45aa03749bb257f0899"));
            if (!handle) return this.insertLine("output", "t");
            if (item === "terminal"){
                this.block = true;
                this.insertLine("output", LangString("components.Terminal.index.6a0f61852f3a454f30e7a730253eff86", handle));
                await systemUtil.getRandomInt(2000, 3000);
                let valid:boolean = await CustomEvent.callClient("terminal:bruteforce:validterminal", handle)
                if(!valid){
                    this.block = false;
                    this.insertLine("output", LangString("components.Terminal.index.63d42e738fb609710e03fd72d4221217", handle));
                }
                this.insertLine("output", LangString("components.Terminal.index.2e08dd59f7e491f461593deb39ed00d7", handle));
                let text = [`PIN CODE: ${systemUtil.randomNumber(6)}`];
                for(let id = 0; id <= 100; id++){
                    text.push(systemUtil.randomStr(10))
                }
                for(let id = (CEF.test ? 90 : 0); id < 100; id++){
                    let ok: number = await CustomEvent.callClient("terminal:bruteforce:validterminal:interact", handle)
                    if(!ok){
                        this.block = false;
                        this.insertLine("output", LangString("components.Terminal.index.c0d89d05253c592236dd79afabee1f4a", handle));
                        return;
                    } else {
                        this.block = true;
                        await systemUtil.sleep((20 - ok) * (100))
                        text.splice(systemUtil.getRandomInt(1, text.length), 1)
                        this.insertLine("output", systemUtil.randomStr(text.join("").length));
                        this.insertLine("output", LangString("components.Terminal.index.e220c39b4f2b297843d9215f68ba49b6", id));
                    }
                }
                this.block = false;
                this.insertLine("output", `${text[0]}`);
                CustomEvent.triggerClient("terminal:bruteforce:validterminal:done", handle)
                return;
            }

            this.insertLine("output", LangString("components.Terminal.index.a0cd9ef1596563f8a55ed6c91682d97f"));
        })
        if(CEF.test) this.load();

        CustomEvent.register("terminal:open", () => {
            this.setState({display: true});
            CEF.gui.enableCusrsor();
            this.load();
            CustomEvent.triggerClient("terminal:opened", true)
        })
        CustomEvent.register("terminal:send", (text: string) => {
            this.insertLine("output", text)
        })
    }

    load() {
        setTimeout(async () => {
            this.clear();
            this.block = true;
            await systemUtil.sleep(1000);
            this.insertLine("output", LangString("components.Terminal.index.24eaca29a7e51c4c4080e1b7198d39c3"))
            await systemUtil.sleep(1000);
            if(!CEF.test){
                for (let id = 0; id <= 100; id++) {
                    await systemUtil.sleep(systemUtil.getRandomInt(50, 250));
                    if(!this.state.display) return;
                    this.insertLine("output", LangString("components.Terminal.index.0d20af1f38a9ba52b7664e11a826ad7c", id))
                }
            }
            this.insertLine("output", LangString("components.Terminal.index.f078318f1246f82e76e37501e0c3cf68"))
            this.block = false;
        }, 1)
    }

    clear() {
        this.setState({ lines: [] })
    }

    get block() {
        return this.state.blockInput;
    }
    set block(status) {
        this.setState({ blockInput: status });
    }

    insertLine(type: TerminalLineType, text: string) {
        if (!this.state.display) return;
        const lines = [...this.state.lines]
        lines.push([type, text])
        this.setState({ lines }, () => {
            this.div.current.scrollTo({ top: this.div.current.scrollHeight + 100 });
        });
    }

    runCommand(...args: string[]) {
        this.insertLine("input", args.join(" "));
        setTimeout(() => {
            if (!this.commands.has(args[0])) {
                this.insertLine("output", LangString("components.Terminal.index.cd08d4bceb5ac2aafb1ef210c9a6c1ea", args[0]));
            } else {
                const name = args[0]
                args.splice(0, 1);
                this.commands.get(name)(...args)
            }
        }, 100)
        this.input.current.value = "";
    }

    render() {
        if (!this.state.display) return <></>;
        return <>
            <div className="terminal-block">
                <span className='logo'>{LangString("components.Terminal.index.be6a4a2920dbae6e9625517b867f278a")}</span>
                <span className='exit' onClick={e => {
                    e.preventDefault();
                    CEF.gui.disableCusrsor();
                    this.setState({display: false});
                    CustomEvent.triggerClient("terminal:opened", false)
                }}>X</span>
                <div className={"terminal"} ref={this.div}>
                    {this.state.lines.map((item, id) => {
                        return <p key={id} className={item[0]}>{item[1]}</p>
                    })}
                    {this.state.blockInput ? <></> : <p className="input"><input ref={this.input} onKeyUp={e => {
                        if (e.keyCode !== 13) return;
                        e.preventDefault();
                        if (!this.input.current.value) return;
                        this.runCommand(...this.input.current.value.split(" "))
                    }} /></p>}
                </div>
            </div>
        </>
    }
}