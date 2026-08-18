import { langStringDefault } from "../lang/index";
interface EmployerNPC {
    Position: Vector3Mp,
    Heading: number,
    Model: string,
    Name: string
    Range?: number,
    Dimension?: number
}

interface EmployerBlip {
    Sprite: number,
    Color: number,
    Position: Vector3Mp,
    Name: string
}

export const EMPLOYER_NPC: EmployerNPC = {
    Position: new mp.Vector3(-206.98, 6575.16, 11.02),
    Heading: 192,
    Model: "hc_gunman",
    Name: langStringDefault("diving.employer.config.6ca799a618ce642d14902b4020851839"),
    Range: 1,
    Dimension: 0
}

export const EMPLOYER_BLIP: EmployerBlip = {
    Sprite: 597,
    Color: 73,
    Position: EMPLOYER_NPC.Position,
    Name: langStringDefault("diving.employer.config.caf7ac2fd685ec12b93d0b00385329bc")
}