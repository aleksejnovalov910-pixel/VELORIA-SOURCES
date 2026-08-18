import { langStringDefault } from "../../shared/lang";
import {CustomEvent} from "./custom.event";
import {system} from "./system";

CustomEvent.registerClient('chatMessage', (player, message: string) => {
    gui.chat.send(player, message);
})
CustomEvent.registerClient('chatCommand', (player, command: string, ...args: string[]) => {
    gui.chat.chatCommandsHandles.filter(item => item[0] == command.toLowerCase()).map(item => {
        item[2](player, ...args);
    })
})

let ids = 0;

interface registerCommandReturn {
    destroy: () => void;
    updateHandle: (handle: (player: PlayerMp, ...args: string[]) => void) => void;
}

function registerCommand(command: string, handle: (player: PlayerMp, ...args: string[]) => void): registerCommandReturn;
function registerCommand(commands: string[], handle: (player: PlayerMp, ...args: string[]) => void): registerCommandReturn;
function registerCommand(commands: string | string[], handle: (player: PlayerMp, ...args: string[]) => void): registerCommandReturn{
    ids++;
    const id = parseInt(`${ids}`)
    if (typeof commands === "string") commands = [commands]
    commands.map(command => {
        gui.chat.chatCommandsHandles.push([command.toLowerCase(), id, (player, ...args) => {
            if (!player.user) return;
            handle(player, ...args);
        }]);
    })
    return {
        destroy: () => {
            gui.chat.chatCommandsHandles.map((item, index) => {
                if (item[1] === id) gui.chat.chatCommandsHandles.splice(index, 1);
            })
        },
        updateHandle: (newhandle: (player: PlayerMp, ...args: string[]) => void) => {
            gui.chat.chatCommandsHandles.map((item, index) => {
                if (item[1] === id) item[2] = newhandle
            })
        }
    }
};

export const gui = {
    chat: {
        chatRange: 15,
        whisperChatRange: 3,
        getTime: function () {
            let dateTime = new Date();
            return `${system.digitFormat(dateTime.getHours())}:${system.digitFormat(dateTime.getMinutes())}:${system.digitFormat(dateTime.getSeconds())}`;
        },
        text: (args: string[]) => args.join(' '),
        chatCommandsHandles: <[string, number, (player: PlayerMp, ...args: string[]) => void][]>[
            ["me", 0, (player, ...args) => {gui.chat.sendMeCommand(player, args.join(' '))}],
            ["do", 0, (player, ...args) => {gui.chat.sendDoCommand(player, args.join(' '))}],
            ["b", 0, (player, ...args) => {gui.chat.sendBCommand(player, args.join(' '))}],
            ["try", 0, (player, ...args) => {gui.chat.sendTryCommand(player, args.join(' '))}],
            ["qweqweqwe", 0, (player, ...args) => {
                CustomEvent.triggerClientSocket(player, 'test', args.join(' '))
            }],
        ],
        registerCommand,
        sendBCommand: function (player: PlayerMp, text: string) {
            if (!player.user) return;
            if (player.user.chatMuted) return player.outputChatBox(player.user.LangString("gui.ab88020667f8c316bd091e53b9e7cb5d", gui.chat.getTime(), system.timeStampString(player.user.chatMuted)));
            mp.players.forEach((nplayer) => {
                if (nplayer.dist(player.position) < gui.chat.chatRange && nplayer.dimension == player.dimension)
                    nplayer.outputChatBox(`[${gui.chat.getTime()}] !{2196F3}${nplayer.user.getChatNameString(player)}: !{FFFFFF}(( ${escape(text)} )) `)
            })
        },
        sendTryCommand: function (player: PlayerMp, text: string) {
            if (!player.user) return;
            if (player.user.chatMuted) return player.outputChatBox(player.user.LangString("gui.60420d0a3812e056f3ff08b647ca8f4f", gui.chat.getTime(), system.timeStampString(player.user.chatMuted)));
            let lucky = system.getRandomInt(1, 10) <= 5 ? langStringDefault("gui.0740571497cd34790921233365677e01") : langStringDefault("gui.375e2e928b6d3d23701996dc9f0a9ae3")
            mp.players.forEach((nplayer) => {
                if (nplayer.dist(player.position) < gui.chat.chatRange && nplayer.dimension == player.dimension)
                    nplayer.outputChatBox(`[${gui.chat.getTime()}] ${lucky} !{C2A2DA} ${nplayer.user.getChatNameString(player)}  ${escape(text)}`)
            })
        },
        sendDoCommand: function (player: PlayerMp, text: string) {
            if (!player.user) return;
            if (player.user.chatMuted) return player.outputChatBox(player.user.LangString("gui.2138150ba0808f1735f84bd500131d35", gui.chat.getTime(), system.timeStampString(player.user.chatMuted)));
            mp.players.forEachFast((nplayer) => {
                if (nplayer.dist(player.position) < gui.chat.chatRange && nplayer.dimension == player.dimension) nplayer.outputChatBox(`[${gui.chat.getTime()}] !{00BFFF} (( ${escape(text)} )) ${nplayer.user.getChatNameString(player)} `)
            })
        },
        sendMeCommand: function (player: PlayerMp, text: string) {
            if (!player.user) return;

            // verificare daca jucatorul e mutat
            if (player.user.chatMuted)
                return player.outputChatBox(
                    player.user.LangString(
                        "gui.b8fdfcf5bdb7ecdcd7a908a17108489f",
                        gui.chat.getTime(),
                        system.timeStampString(player.user.chatMuted)
                    )
                );

            mp.players.forEach((nplayer) => {
                // doar jucatorii apropiati in aceeasi dimensiune vad textul deasupra capului
                if (nplayer.dist(player.position) < gui.chat.chatRange * 3 && nplayer.dimension === player.dimension) {
                    nplayer.call("chat:send:textUnderHead", [player.id, text, "me"]);
                }
            });

            // 🔹 trimitem si jucatorului care a scris /me, ca sa vada si el textul deasupra capului
            player.call("chat:send:textUnderHead", [player.id, text, "me"]);
        },

        // sendMeCommand: function (player: PlayerMp, text: string) {
        //     if (!player.user) return;
        //     if (player.user.chatMuted) return player.outputChatBox(player.user.LangString("gui.b8fdfcf5bdb7ecdcd7a908a17108489f", gui.chat.getTime(), system.timeStampString(player.user.chatMuted)));
        //     mp.players.forEach((nplayer) => {
        //         if (nplayer.dist(player.position) < gui.chat.chatRange && nplayer.dimension == player.dimension) {
        //             nplayer.outputChatBox(`[${gui.chat.getTime()}] !{C2A2DA}${nplayer.user.getChatNameString(player)} ${escape(text)}`)
        //         }

        //         if (nplayer.dist(player.position) < (gui.chat.chatRange * 3) && nplayer.dimension == player.dimension) {
        //             nplayer.call("chat:send:textUnderHead", [player.id, text, "me"]);
        //         }
        //     })
        // },
        sendMeCommandToPlayer: function (player: PlayerMp, target: PlayerMp, text: string) {
            if (!player.user || !target.user) return;
            if (player.user.chatMuted) return player.outputChatBox(player.user.LangString("gui.afcef91a5587c8b23eeab1700af93ada", gui.chat.getTime(), system.timeStampString(player.user.chatMuted)));
            target.outputChatBox(target.user.LangString("gui.3869e63b06ab24d6207dbef36ab751e6", gui.chat.getTime(), target.user.getChatNameString(player), escape(text)))
        },

        sendDiceCommand: function (player: PlayerMp) {
            if (!player.user) return;
            if (player.user.chatMuted) return player.outputChatBox(player.user.LangString("gui.0728b975c38a30ad765a478457949616", gui.chat.getTime(), system.timeStampString(player.user.chatMuted)));
            let dice = system.getRandomInt(1, 6);
            mp.players.forEach((nplayer) => {
                if (nplayer.dist(player.position) < gui.chat.chatRange && nplayer.dimension == player.dimension)
                    nplayer.outputChatBox(nplayer.user.LangString("gui.9f08816d18096691322e07ecfe01829c", gui.chat.getTime(), nplayer.user.getChatNameString(player), dice))
            })
        },

        send: function (player: PlayerMp, text: string) {
            if (!player.user) return;
            if (player.user.dead) return;
            if (player.user.chatMuted) return;

            const playerName = player.user.getChatNameString(player);
            const escapedText = escape(text);

            // Trimite mesajul tuturor jucătorilor
            mp.players.forEachFast((nplayer: PlayerMp) => {
                if (!nplayer?.user) return;
                nplayer.outputChatBox(`${playerName}: ${escapedText}`);
            });
        },

        // send: function (player: PlayerMp, text: string) {
        //     if (!player.user) return;
        //     if (player.user.dead) return player.outputChatBox(player.user.LangString("gui.0ae85036e0da432b3b0760346f4e92bb", gui.chat.getTime()));
        //     if (player.user.chatMuted) return player.outputChatBox(player.user.LangString("gui.7deee59bc07503e4979d856dde1f962f", gui.chat.getTime(), system.timeStampString(player.user.chatMuted)));
        //     mp.players.forEachFast((nplayer) => {
        //         if (nplayer.dist(player.position) < gui.chat.chatRange && nplayer.dimension == player.dimension)
        //             nplayer.outputChatBox(nplayer.user.LangString("gui.9d8f11d5b98be62fcb6e88e2f0f0d5d9", gui.chat.getTime(), nplayer.user.getChatNameString(player), escape(text)))
        //     })
        // },
        sendInRange: function (player: PlayerMp, text: string) {
            if(!mp.players.exists(player)) return;
            mp.players.forEachFast((nplayer) => {
                if (nplayer.dist(player.position) < gui.chat.chatRange && nplayer.dimension == player.dimension)
                    nplayer.outputChatBox(`[${gui.chat.getTime()}] ${escape(text)}`)
            })
        },
    }
}