import { CustomEvent } from "./custom.event";
import { gui } from "./gui";

CustomEvent.register("mdt", () => {
  CustomEvent.triggerServer("mdt:openTablet");
})

const openTablet = () => {
  gui.setGui("mdt");
}

CustomEvent.registerServer("mdt:openTablet", openTablet);
