import { User } from "@/modules/user";

declare global {
  interface PlayerMp {
    user: User;
  }
}

export {};
