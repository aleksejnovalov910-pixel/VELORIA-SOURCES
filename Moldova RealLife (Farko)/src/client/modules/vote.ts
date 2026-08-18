import { LangString } from "./lang";
import {system} from "./system";
import {VOTE_POS} from "../../shared/vote";

const pos = system.middlePoint3d(...VOTE_POS)

system.createBlipInterrior(367, 1, new mp.Vector3(pos.x, pos.y, pos.z), LangString("vote.f50d4246ddce6fdb095d67d8dc6121b1"))