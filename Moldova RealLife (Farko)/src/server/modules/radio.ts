import { langStringDefault } from "../../shared/lang";
import { CustomEvent } from "./custom.event";

const quitFreq = (player: PlayerMp) => {
    const currentFreq = player.getVariable('radioVol');
    if (currentFreq){
        mp.players.toArray().filter(target => target.user && target.id !== player.id && target.getVariable('radioVol') === currentFreq).map(target => {
            target.call('radio:targetStopSpeak', [target.id])
        });
        if(mp.players.exists(player)) player.setVariable('radioVol', "");
    }
    if (mp.players.exists(player) && player.getVariable('radioSpeak')) player.setVariable('radioSpeak', false);
}

mp.events.add('playerQuit', player => {
    quitFreq(player)
})

CustomEvent.registerClientAndCef('radio:connectToFreq', (player, freq: string, notify = true) => {
    const user = player.user;
    if (!user) return;
    if (!user.haveRadio) return quitFreq(player)
    quitFreq(player)
    const [start, end] = freq.split('.').map(q => parseInt(q))
    if(isNaN(start) || start < 0 || start > 999999) {
        if(notify)player.notify(player.user.LangString("radio.7538869b84a083d677f1e80a5f1baf3b"), 'error');
        return
    }
    if(start >= 2000 && start <= 3000 && !user.is_gos) {
        if(notify)player.notify(player.user.LangString("radio.4f4f44693a7490d15fbfc38f2c794977"), 'error');
        return
    }
    player.setVariable('radioVol', freq);
})


CustomEvent.registerClient('radio:enableMic', (player) => {
    const user = player.user;
    if (!user) return;
    if (!user.haveRadio) return quitFreq(player)
    player.setVariable('radioSpeak', true);
    const freq = player.getVariable('radioVol');
    mp.players.toArray().filter(target => target.user && target.id !== player.id && target.getVariable('radioVol') === freq).map(target => {
        target.enableVoiceTo(player)
        target.call('radio:targetStartSpeak', [target.id])
    });
})
CustomEvent.registerClient('radio:disableMic', (player) => {
    const user = player.user;
    if (!user) return;
    if (!user.haveRadio) return quitFreq(player)
    player.setVariable('radioSpeak', false);
    const freq = player.getVariable('radioVol');
    mp.players.toArray().filter(target => target.user && target.id !== player.id && target.getVariable('radioVol') === freq).map(target => {
        target.call('radio:targetStopSpeak', [target.id])
    });
})