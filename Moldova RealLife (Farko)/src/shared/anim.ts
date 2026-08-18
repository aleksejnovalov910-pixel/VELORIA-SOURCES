import { langData } from "./lang";

interface SyncAnimData {
  /** Название анимации
   * @example Обняться
   */
  name: string;
  /** Der Name der Bibliothek, in der die Animation für den Initiator gespeichert ist */
  dict1: string;
  /** Name der Animation für den Initiator. Wenn sie für männlich und weiblich unterschiedlich sind - ein Array mit zwei Namen. Der erste ist männlich, der zweite ist weiblich */
  anim1: string | [string, string];
  /** Название библиотеки, в которой хранится анимация для второго */
  dict2: string;
  /** Der Name der Animation für die zweite Person. Wenn sie für männlich und weiblich unterschiedlich sind - dann ein Array mit zwei Namen. Der erste ist männlich, der zweite ist weiblich. Wenn nicht angegeben, wird anim1 verwendet */
  anim2: string | [string, string];
  /** Abstand zwischen Spielern*/
  dist?: number;
}

export interface AnimationData {
  dictionary: string;
  name: string;
  durationSec: number;
}

/** Каталог с анимациями взаимодействия. Не более 10 */
export const SYNC_ANIM_LIST: SyncAnimData[] = [
  // { name: "Тест1", dict1: 'mp_ped_interaction', anim1: 'handshake_guy_a', dict2: 'mp_ped_interaction', anim2: 'handshake_guy_b'},
  // { name: "Тест2", dict1: 'mp_ped_interaction', anim1: 'highfive_guy_a', dict2: 'mp_ped_interaction', anim2: 'highfive_guy_b'},
  // { name: "Тест3", dict1: 'mp_ped_interaction', anim1: 'hugs_guy_a', dict2: 'mp_ped_interaction', anim2: 'hugs_guy_b'},
  {
    name: "Un sarut",
    dict1: "mp_ped_interaction",
    anim1: "kisses_guy_a",
    dict2: "mp_ped_interaction",
    anim2: "kisses_guy_b",
    dist: -1.0,
  },
  {
    name: "Oral",
    dict1: "misscarsteal2pimpsex",
    anim1: "pimpsex_punter",
    dict2: "misscarsteal2pimpsex",
    anim2: "pimpsex_hooker",
  },
  {
    name: "Sex",
    dict1: "rcmpaparazzo_2",
    anim1: "shag_loop_a",
    dict2: "rcmpaparazzo_2",
    anim2: "shag_loop_poppy",
  },
];

interface IPurchaseableAnimation {
  id: number;
  category: string;
  name: string;
  forBattlePass: boolean;
  /** Стоимость покупки/продажи. Не учитывается при forBattlePass = true */
  cost?: 100;
  costType?: "coins" | "money";
}

export const getPurchaseableModelForAnim = (
  name: string
): IPurchaseableAnimation => {
  return PURCHASEABLE_ANIMS.find((anim) => anim.name == name);
};

export const PURCHASEABLE_ANIMS: IPurchaseableAnimation[] = [
  { id: 1, category: "Unterhaltung", name: ("anim.d8494eddf627a674714cb1d0797e52ac"), forBattlePass: true },
  {
    id: 2,
    category: "Unterhaltung",
    name: ("anim.5d3a6c81f50c14bd611fead6b9b82527"),
    forBattlePass: true,
  },
  { id: 3, category: "Unterhaltung", name: ("anim.c86a50f4897763da0e9514fe399cf020"), forBattlePass: true },
  { id: 4, category: "Unterhaltung", name: ("anim.0329220f6997159a22b76743654876f8"), forBattlePass: true },
  { id: 5, category: "Tanzen", name: ("anim.5665231e3b987c53939856378c3c9e8b"), forBattlePass: true },
  { id: 6, category: "Unterhaltung", name: ("anim.ec726e7594e0f2d7d3ad1b122d93b423"), forBattlePass: true },
  { id: 7, category: "Unterhaltung", name: ("anim.f2682910bed55e5a68d069a69f406143"), forBattlePass: true },
  { id: 8, category: "Tanzen", name: ("anim.7336792cff23d729d8ed5b6d3927255c"), forBattlePass: true },
  { id: 9, category: "Tanzen", name: ("anim.522427cd2a51d68e918807577ce730eb"), forBattlePass: true },
  { id: 10, category: "Tanzen", name: ("anim.5d18fc2c10fe0230fd39f16dba8a1189"), forBattlePass: true },
  { id: 11, category: "Tanzen", name: ("anim.189f5d3792624d3455c36d1f98ac4591"), forBattlePass: true },
  { id: 12, category: "Tanzen", name: ("anim.f0672410d9431720e8502dbcb4278973"), forBattlePass: true },
  {
    id: 13,
    category: "Tanzen",
    name: ("anim.5ca49944d9f9c81cf6e74731dd1cbf76"),
    forBattlePass: true,
  },
];

/**
 * animName -> SongURL
 */
export const ANIM_SONGS: {
  [songID: string]: {
    url: string;
    dist: number;
    /** Range 0.0-1.0 */
    volume: number;
  };
} = {
  SONG_TEST: {
    url: "https://gta5onyx.com/Salto.mp3",
    dist: 6,
    volume: 0.08
  },
  blinding_lights: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/blinding_lights.ogg",
    dist: 6,
    volume: 0.08
  },
  boogie_down: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/boogie_down.ogg",
    dist: 6,
    volume: 0.08
  },
  cowboy_dance: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/knee_slapper.ogg",
    dist: 6,
    volume: 0.08
  },
  crossbounce: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/crossbounce.ogg",
    dist: 6,
    volume: 0.08
  },
  disco_dance: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/disco_fever.ogg",
    dist: 6,
    volume: 0.08
  },
  dont_start_now: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/dont_start_now.ogg",
    dist: 6,
    volume: 0.08
  },
  floss_dance: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/floss.ogg",
    dist: 6,
    volume: 0.08
  },
  fresh: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/fresh.ogg",
    dist: 6,
    volume: 0.08
  },
  gangnam_style: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/gangnam_style.ogg",
    dist: 6,
    volume: 0.08
  },
  i_heart_you: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/i_heart_you.ogg",
    dist: 6,
    volume: 0.08
  },
  jabba_switchway: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/jabba_switchway.ogg",
    dist: 6,
    volume: 0.08
  },
  macarena: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/macarena.ogg",
    dist: 6,
    volume: 0.08
  },
  last_forever: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/last_forever.ogg",
    dist: 6,
    volume: 0.08
  },
  ridethepony_v2: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/ride_the_pony.ogg",
    dist: 6,
    volume: 0.08
  },
  rollie: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/rollie.ogg",
    dist: 6,
    volume: 0.08
  },
  say_so: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/say_so.ogg",
    dist: 6,
    volume: 0.08
  },
  shuffle2: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/signature_shuffle.ogg",
    dist: 6,
    volume: 0.08
  },
  squat_kick: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/squat_kick.ogg",
    dist: 6,
    volume: 0.08
  },
  step_it_up: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/step_it_up.ogg",
    dist: 6,
    volume: 0.08
  },
  the_flow: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/the_flow.ogg",
    dist: 6,
    volume: 0.08
  },
  renegade: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/the_renegade.ogg",
    dist: 6,
    volume: 0.08
  },
  stuck: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/stuck.ogg",
    dist: 6,
    volume: 0.08
  },
  pump_up: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/pump_up.ogg",
    dist: 6,
    volume: 0.08
  },
  socks: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/socks.ogg",
    dist: 6,
    volume: 0.08
  },
  my_world: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/my_world.ogg",
    dist: 6,
    volume: 0.08
  },
  wake_up: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/wake_up.ogg",
    dist: 6,
    volume: 0.08
  },
  onda: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/onda.ogg",
    dist: 6,
    volume: 0.08
  },
  gridy: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/get_griddy.ogg",
    dist: 6,
    volume: 0.08
  },
  hit_it: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/hit_it.ogg",
    dist: 6,
    volume: 0.08
  },
  leave_door_open: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/leave_door_open.ogg",
    dist: 6,
    volume: 0.08
  },
  chicken_wing: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/chicken_wing.ogg",
    dist: 6,
    volume: 0.08
  },
  savage: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/savage.ogg",
    dist: 6,
    volume: 0.08
  },
  electro_swing: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/electro_swing.ogg",
    dist: 6,
    volume: 0.08
  },
  sprinkler: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/sprinkler.ogg",
    dist: 6,
    volume: 0.08
  },
  smeeze: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/smeeze.ogg",
    dist: 6,
    volume: 0.08
  },
  mufasa: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/mufasa.ogg",
    dist: 6,
    volume: 0.08
  },
  hey_now: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/hey_now.ogg",
    dist: 6,
    volume: 0.08
  },
  build_up: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/build_up.ogg",
    dist: 6,
    volume: 0.08
  },
  take_the_l: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/take_the_l.ogg",
    dist: 6,
    volume: 0.08
  },
  hip_hop: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/breakdown.ogg",
    dist: 6,
    volume: 0.08
  },
  i_aint_afraid: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/i_aint_afraid.ogg",
    dist: 6,
    volume: 0.08
  },
  get_gone: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/get_gone.ogg",
    dist: 6,
    volume: 0.08
  },
  maximum_bounce: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/maximum_bounce.ogg",
    dist: 6,
    volume: 0.08
  },
  like_to_move: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/like_to_move.ogg",
    dist: 6,
    volume: 0.08
  },
  leilt_elomr: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/leilt_elomr.ogg",
    dist: 6,
    volume: 0.08
  },
  tidy: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/tidy.ogg",
    dist: 6,
    volume: 0.08
  },
  bhangra_boogie: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/bhangra_boogie.ogg",
    dist: 6,
    volume: 0.08
  },
  out_west: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/out_west.ogg",
    dist: 6,
    volume: 0.08
  },
  toosie_slide: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/toosie_slide.ogg",
    dist: 6,
    volume: 0.08
  },
  pull_up: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/pull_up.ogg",
    dist: 6,
    volume: 0.08
  },
  the_crane_kick: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/the_crane_kick.ogg",
    dist: 6,
    volume: 0.08
  },
  billy_bounce: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/billy_bounce.ogg",
    dist: 6,
    volume: 0.08
  },
  electro_shuffle: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/electro_shuffle.ogg",
    dist: 6,
    volume: 0.08
  },
  work_it_out: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/work_it_out.ogg",
    dist: 6,
    volume: 0.08
  },
  zany: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/zany.ogg",
    dist: 6,
    volume: 0.08
  },
  smooth_moves: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/smooth_moves.ogg",
    dist: 6,
    volume: 0.08
  },
  vivacious: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/vivacious.ogg",
    dist: 6,
    volume: 0.08
  },
  hula: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/hula.ogg",
    dist: 6,
    volume: 0.08
  },
  true_heart: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/true_heart.ogg",
    dist: 6,
    volume: 0.08
  },
  reanimated: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/reanimated.ogg",
    dist: 6,
    volume: 0.08
  },
  in_da_party: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/in_da_party.ogg",
    dist: 6,
    volume: 0.08
  },
  bim_bam_boom: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/bim_bam_boom.ogg",
    dist: 6,
    volume: 0.08
  },
  wanna_see_me: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/wanna_see_me.ogg",
    dist: 6,
    volume: 0.08
  },
  dynamic_shuffle: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/dynamic_shuffle.ogg",
    dist: 6,
    volume: 0.08
  },
  never_gonna: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/never_gonna.ogg",
    dist: 6,
    volume: 0.08
  },
  fright_funk: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/fright_funk.ogg",
    dist: 6,
    volume: 0.08
  },
  jitterbug: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/jitterbug.ogg",
    dist: 6,
    volume: 0.08
  },
  infectious: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/infectious.ogg",
    dist: 6,
    volume: 0.08
  },
  where_is_matt: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/where_is_matt.ogg",
    dist: 6,
    volume: 0.08
  },
  savor_the_w: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/savor_the_w.ogg",
    dist: 6,
    volume: 0.08
  },
  dance_therapy: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/dance_therapy.ogg",
    dist: 6,
    volume: 0.08
  },
  intensity: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/intensity.ogg",
    dist: 6,
    volume: 0.08
  },
  rushin_around: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/rushin_around.ogg",
    dist: 6,
    volume: 0.08
  },
  advanced_math: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/advanced_math.ogg",
    dist: 6,
    volume: 0.08
  },
  bold_stance: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/bold_stance.ogg",
    dist: 6,
    volume: 0.08
  },
  freemix: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/freemix.ogg",
    dist: 6,
    volume: 0.08
  },
  extraterrestrial: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/extraterrestrial.ogg",
    dist: 6,
    volume: 0.08
  },
  crabby: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/crabby.ogg",
    dist: 6,
    volume: 0.08
  },
  lavish: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/lavish.ogg",
    dist: 6,
    volume: 0.08
  },
  mime_time: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/mime_time.ogg",
    dist: 6,
    volume: 0.08
  },
  tai_chi: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/tai_chi.ogg",
    dist: 6,
    volume: 0.08
  },
  hydraulics_player: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/lil_bounce.ogg",
    dist: 6,
    volume: 0.08
  },
  daydream: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/daydream.ogg",
    dist: 6,
    volume: 0.08
  },
  work_it: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/work_it.ogg",
    dist: 6,
    volume: 0.08
  },
  slick: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/slick.ogg",
    dist: 6,
    volume: 0.08
  },
  bombastic: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/bombastic.ogg",
    dist: 6,
    volume: 0.08
  },
  its_a_vibe: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/its_a_vibe.ogg",
    dist: 6,
    volume: 0.08
  },
  wutang_is_forever: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/wutang_is_forever.ogg",
    dist: 6,
    volume: 0.08
  },
  rootin_tootin: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/rootin_tootin.ogg",
    dist: 6,
    volume: 0.08
  },
  triumphant: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/triumphant.ogg",
    dist: 6,
    volume: 0.08
  },
  alfredo_player: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/lil_diplodoculus.ogg",
    dist: 6,
    volume: 0.08
  },
  layers_player: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/frolic.ogg",
    dist: 6,
    volume: 0.08
  },
  epic_sax: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/phone_it_in.ogg",
    dist: 6,
    volume: 0.08
  },
  llama_cowbell: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/llama_bell.ogg",
    dist: 6,
    volume: 0.08
  },
  majestic_flipped: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/majestic_coinflip.ogg",
    dist: 6,
    volume: 0.08
  },
  llama_float_player: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/lil_floaticorn.ogg",
    dist: 6,
    volume: 0.08
  },
  glowstick_dance: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/glowsticks.ogg",
    dist: 6,
    volume: 0.08
  },
  shake_dance: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/shake_it_up.ogg",
    dist: 6,
    volume: 0.08
  },
  ukulele_dance: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/island_vibes.ogg",
    dist: 6,
    volume: 0.08
  },
  snare_solo_player: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/snare_solo.ogg",
    dist: 6,
    volume: 0.08
  },
  rock_out_player: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/rock_out.ogg",
    dist: 6,
    volume: 0.08
  },
  rhyme_lock_player: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/lil_octane.ogg",
    dist: 6,
    volume: 0.08
  },
  unicycle_gadget_player: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/unicycle.ogg",
    dist: 6,
    volume: 0.08
  },
  banner_flag_player: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/banner_flag_prop.ogg",
    dist: 6,
    volume: 0.08
  },
  bouquet_hat_player: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/bloomin_bouquet.ogg",
    dist: 6,
    volume: 0.08
  },
  car_lifted_player: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/lil_monster.ogg",
    dist: 6,
    volume: 0.08
  },
  guitar_walk_player: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/guitar_walk.ogg",
    dist: 6,
    volume: 0.08
  },
  best_mates: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/best_mates.ogg",
    dist: 6,
    volume: 0.08
  },
  on_your_marks: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/on_your_marks.ogg",
    dist: 6,
    volume: 0.08
  },
  laid_back_shuffle: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/laid_back_shuffle.ogg",
    dist: 6,
    volume: 0.08
  },
  pollo_dance: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/pollo_dance.ogg",
    dist: 6,
    volume: 0.08
  },
  scenario: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/scenario.ogg",
    dist: 6,
    volume: 0.08
  },
  buckle_up: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/buckle_up.ogg",
    dist: 6,
    volume: 0.08
  },
  its_complicated: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/its_complicated.ogg",
    dist: 6,
    volume: 0.08
  },
  freedom_wheels: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/freedom_wheels.ogg",
    dist: 6,
    volume: 0.08
  },
  everybody_loves_me: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/everybody_loves_me.ogg",
    dist: 6,
    volume: 0.08
  },
  pirouette: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/pirouette.ogg",
    dist: 6,
    volume: 0.08
  },
  lazer_blast: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/lazer_blast.ogg",
    dist: 6,
    volume: 0.08
  },
  poki: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/poki.ogg",
    dist: 6,
    volume: 0.08
  },
  leapin: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/leapin.ogg",
    dist: 6,
    volume: 0.08
  },
  well_rounded: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/well_rounded.ogg",
    dist: 6,
    volume: 0.08
  },
  flux: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/flux.ogg",
    dist: 6,
    volume: 0.08
  },
  whirlwind: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/whirlwind.ogg",
    dist: 6,
    volume: 0.08
  },
  jamboree: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/jamboree.ogg",
    dist: 6,
    volume: 0.08
  },
  slap_happy: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/slap_happy.ogg",
    dist: 6,
    volume: 0.08
  },
  dream_feet: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/dream_feet.ogg",
    dist: 6,
    volume: 0.08
  },
  switchstep: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/switchstep.ogg",
    dist: 6,
    volume: 0.08
  },
  glitter: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/glitter.ogg",
    dist: 6,
    volume: 0.08
  },
  sugar_rush: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/sugar_rush.ogg",
    dist: 6,
    volume: 0.08
  },
  twist: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/twist.ogg",
    dist: 6,
    volume: 0.08
  },
  howl: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/howl.ogg",
    dist: 6,
    volume: 0.08
  },
  crazy_feet: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/crazy_feet.ogg",
    dist: 6,
    volume: 0.08
  },
  hot_marat: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/hot_marat.ogg",
    dist: 6,
    volume: 0.08
  },
  show_stopper: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/show_stopper.ogg",
    dist: 6,
    volume: 0.08
  },
  boneless: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/boneless.ogg",
    dist: 6,
    volume: 0.08
  },
  pop_lock: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/pop_lock.ogg",
    dist: 6,
    volume: 0.08
  },
  steady: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/steady.ogg",
    dist: 6,
    volume: 0.08
  },
  shimmer: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/shimmer.ogg",
    dist: 6,
    volume: 0.08
  },
  springy: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/springy.ogg",
    dist: 6,
    volume: 0.08
  },
  free_flow: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/free_flow.ogg",
    dist: 6,
    volume: 0.08
  },
  conga: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/conga.ogg",
    dist: 6,
    volume: 0.08
  },
  deep_end: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/deep_end.ogg",
    dist: 6,
    volume: 0.08
  },
  pumpernickel: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/pumpernickel.ogg",
    dist: 6,
    volume: 0.08
  },
  jubilation: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/jubilation.ogg",
    dist: 6,
    volume: 0.08
  },
  jaywalking: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/jaywalking.ogg",
    dist: 6,
    volume: 0.08
  },
  peace_out: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/peace_out.ogg",
    dist: 6,
    volume: 0.08
  },
  hype: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/hype.ogg",
    dist: 6,
    volume: 0.08
  },
  orange_justice: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/orange_justice.ogg",
    dist: 6,
    volume: 0.08
  },
  swipe_it: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/swipe_it.ogg",
    dist: 6,
    volume: 0.08
  },
  jump_around: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/jump_around.ogg",
    dist: 6,
    volume: 0.08
  },
  monster_mash: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/monster_mash.ogg",
    dist: 6,
    volume: 0.08
  },
  feel_the_flow: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/feel_the_flow.ogg",
    dist: 6,
    volume: 0.08
  },
  copines: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/copines.ogg",
    dist: 6,
    volume: 0.08
  },
  jiggle: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/jiggle.ogg",
    dist: 6,
    volume: 0.08
  },
  forget_me: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/forget_me_not.ogg",
    dist: 6,
    volume: 0.08
  },
  chilled: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/drippin_flavor.ogg",
    dist: 6,
    volume: 0.08
  },
  distraction: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/distraction.ogg",
    dist: 6,
    volume: 0.08
  },
  ucan_cme: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/ucan_cme.ogg",
    dist: 6,
    volume: 0.08
  },
  taco_time: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/taco_time.ogg",
    dist: 6,
    volume: 0.08
  },
  snowglobe: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/snowglobe.ogg",
    dist: 6,
    volume: 0.08
  },
  mj_sleigh_player: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/ride_along.ogg",
    dist: 6,
    volume: 0.08
  },
  sing_along_player: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/sing_along_1.ogg",
    dist: 6,
    volume: 0.08
  },
  unwrapped_player: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/unwrapped.ogg",
    dist: 6,
    volume: 0.08
  },
  double_up: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/double_up.ogg",
    dist: 6,
    volume: 0.08
  },
  sway_1: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/sway.ogg",
    dist: 6,
    volume: 0.08
  },
  its_dynamite: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/its_dynamite.ogg",
    dist: 6,
    volume: 0.08
  },
  mayahi_player: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/mayahi.ogg",
    dist: 6,
    volume: 0.08
  },
  jug: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/jug_1.ogg",
    dist: 6,
    volume: 0.08
  },
  get_swifty_1: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/get_swifty.ogg",
    dist: 6,
    volume: 0.08
  },
  shanty: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/shanty_1.ogg",
    dist: 6,
    volume: 0.08
  },
  prancer_player: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/prancer.ogg",
    dist: 6,
    volume: 0.08
  },
  slalom_player: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/slalom.ogg",
    dist: 6,
    volume: 0.08
  },
  bounce_wit_it: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/bounce_wit_it.ogg",
    dist: 6,
    volume: 0.08
  },
  dance_monkey: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/dance_monkey.ogg",
    dist: 6,
    volume: 0.08
  },
  side_shuffle: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/side_shuffle.ogg",
    dist: 6,
    volume: 0.08
  },
  flapper: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/flapper.ogg",
    dist: 6,
    volume: 0.08
  },
  vibin: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/vibin.ogg",
    dist: 6,
    volume: 0.08
  },
  the_robot: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/the_robot.ogg",
    dist: 6,
    volume: 0.08
  },
  groove_jam: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/groove_jam.ogg",
    dist: 6,
    volume: 0.08
  },
  flamenco: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/flamenco.ogg",
    dist: 6,
    volume: 0.08
  },
  rick_dance: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/rick_dance.ogg",
    dist: 6,
    volume: 0.08
  },
  crackdown: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/crackdown.ogg",
    dist: 6,
    volume: 0.08
  },
  primo_moves: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/primo_moves.ogg",
    dist: 6,
    volume: 0.08
  },
  balletic: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/balletic.ogg",
    dist: 6,
    volume: 0.08
  },
  infinite_dab: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/infinite_dab.ogg",
    dist: 6,
    volume: 0.08
  },
  hand_signals: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/hand_signals.ogg",
    dist: 6,
    volume: 0.08
  },
  fancy_feet: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/fancy_feet.ogg",
    dist: 6,
    volume: 0.08
  },
  clean_groove: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/clean_groove.ogg",
    dist: 6,
    volume: 0.08
  },
  old_school: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/old_school.ogg",
    dist: 6,
    volume: 0.08
  },
  introducing: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/introducing.ogg",
    dist: 6,
    volume: 0.08
  },
  terrestrial: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/terrestrial.ogg",
    dist: 6,
    volume: 0.08
  },
  youre_awesome: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/youre_awesome.ogg",
    dist: 6,
    volume: 0.08
  },
  cluck_strut: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/cluck_strut.ogg",
    dist: 6,
    volume: 0.08
  },
  slitherin: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/slitherin.ogg",
    dist: 6,
    volume: 0.08
  },
  its_go_time: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/its_go_time.ogg",
    dist: 6,
    volume: 0.08
  },
  get_funky: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/get_funky.ogg",
    dist: 6,
    volume: 0.08
  },
  nana_nana: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/nana_nana.ogg",
    dist: 6,
    volume: 0.08
  },
  side_hustle: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/side_hustle.ogg",
    dist: 6,
    volume: 0.08
  },
  droop: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/droop.ogg",
    dist: 6,
    volume: 0.08
  },
  mashed_potato: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/mashed_potato.ogg",
    dist: 6,
    volume: 0.08
  },
  verve: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/verve.ogg",
    dist: 6,
    volume: 0.08
  },
  gloss: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/gloss.ogg",
    dist: 6,
    volume: 0.08
  },
  my_idol: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/my_idol.ogg",
    dist: 6,
    volume: 0.08
  },
  paws_claws: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/paws_claws.ogg",
    dist: 6,
    volume: 0.08
  },
  running_man: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/running_man.ogg",
    dist: 6,
    volume: 0.08
  },
  living_large: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/living_large.ogg",
    dist: 6,
    volume: 0.08
  },
  hootenanny: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/hootenanny.ogg",
    dist: 6,
    volume: 0.08
  },
  dirtbike_challenge: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/dirtbike_challenge.ogg",
    dist: 6,
    volume: 0.08
  },
  lunar_party: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/lunar_party.ogg",
    dist: 6,
    volume: 0.08
  },
  the_look: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/the_look.ogg",
    dist: 6,
    volume: 0.08
  },
  revel: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/revel.ogg",
    dist: 6,
    volume: 0.08
  },
  im_diamond: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/im_diamond.ogg",
    dist: 6,
    volume: 0.08
  },
  hitchhiker: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/hitchhiker.ogg",
    dist: 6,
    volume: 0.08
  },
  waterworks: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/waterworks.ogg",
    dist: 6,
    volume: 0.08
  },
  pick_it_up: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/pick_it_up.ogg",
    dist: 6,
    volume: 0.08
  },
  california_gurls: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/california_gurls.ogg",
    dist: 6,
    volume: 0.08
  },
  bboom_bboom: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/bboom_bboom.ogg",
    dist: 6,
    volume: 0.08
  },
  hang_loose_celebration: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/hang_loose_celebration.ogg",
    dist: 6,
    volume: 0.08
  },
  tootsee: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/tootsee.ogg",
    dist: 6,
    volume: 0.08
  },
  the_dance_laroi: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/the_dance_laroi.ogg",
    dist: 6,
    volume: 0.08
  },
  dance_off: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/dance_off.ogg",
    dist: 6,
    volume: 0.08
  },
  fishy_flourish: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/fishy_flourish.ogg",
    dist: 6,
    volume: 0.08
  },
  freestylin: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/freestylin.ogg",
    dist: 6,
    volume: 0.08
  },
  glyphic: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/glyphic.ogg",
    dist: 6,
    volume: 0.08
  },
  fandalangle: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/fandalangle.ogg",
    dist: 6,
    volume: 0.08
  },
  marsh_walk: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/marsh_walk.ogg",
    dist: 6,
    volume: 0.08
  },
  lazy_shuffle: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/lazy_shuffle.ogg",
    dist: 6,
    volume: 0.08
  },
  backstroke: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/backstroke.ogg",
    dist: 6,
    volume: 0.08
  },
  criss_cross: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/criss_cross.ogg",
    dist: 6,
    volume: 0.08
  },
  party_hips: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/party_hips.ogg",
    dist: 6,
    volume: 0.08
  },
  llama_conga: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/llama_conga.ogg",
    dist: 6,
    volume: 0.08
  },
  juming_jacks: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/juming_jacks.ogg",
    dist: 6,
    volume: 0.08
  },
  shout: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/shout.ogg",
    dist: 6,
    volume: 0.08
  },
  yay: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/yay.ogg",
    dist: 6,
    volume: 0.08
  },
  forever: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/forever.ogg",
    dist: 6,
    volume: 0.08
  },
  the_magic_bomb: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/the_magic_bomb.ogg",
    dist: 6,
    volume: 0.08
  },
  roll_n_rock: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/roll_n_rock.ogg",
    dist: 6,
    volume: 0.08
  },
  warm_up: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/warm_up.ogg",
    dist: 6,
    volume: 0.08
  },
  gungslinger_smokeshow: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/gungslinger_smokeshow.ogg",
    dist: 6,
    volume: 0.08
  },
  sweet_shot: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/sweet_shot.ogg",
    dist: 6,
    volume: 0.08
  },
  vibrant_vibin: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/vibrant_vibin.ogg",
    dist: 6,
    volume: 0.08
  },
  koi_dance: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/koi_dance.ogg",
    dist: 6,
    volume: 0.08
  },
  quick_style: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/quick_style.ogg",
    dist: 6,
    volume: 0.08
  },
  made_you_look: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/made_you_look.ogg",
    dist: 6,
    volume: 0.08
  },
  ask_me: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/ask_me.ogg",
    dist: 6,
    volume: 0.08
  },
  atomic_synth_player: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/atomic_synth.ogg",
    dist: 6,
    volume: 0.08
  },
  sled_player: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/sleds.ogg",
    dist: 6,
    volume: 0.08
  },
  ring_it_on: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/ring_it_on.ogg",
    dist: 6,
    volume: 0.08
  },
  boombox_player: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/boomin.ogg",
    dist: 6,
    volume: 0.08
  },
  boots_n_cats_player: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/boots_n_cats.ogg",
    dist: 6,
    volume: 0.08
  },
  mic_stand_player: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/rage.ogg",
    dist: 6,
    volume: 0.08
  },
  declare: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/declare.ogg",
    dist: 6,
    volume: 0.08
  },
  rocket_rodeo_player: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/rocket_rodeo.ogg",
    dist: 6,
    volume: 0.08
  },
  drum_major_player: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/drum_major.ogg",
    dist: 6,
    volume: 0.08
  },
  pump_it_up: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/pump_it_up.ogg",
    dist: 6,
    volume: 0.08
  },
  cheer_up: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/cheer_up.ogg",
    dist: 6,
    volume: 0.08
  },
  empress_fan_dance: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/empress_fan_dance.ogg",
    dist: 6,
    volume: 0.08
  },
  manera: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/manera_mir.ogg",
    dist: 6,
    volume: 0.08
  },
  air_shredder: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/air_shredder.ogg",
    dist: 6,
    volume: 0.08
  },
  crazy_boy: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/crazy_boy.ogg",
    dist: 6,
    volume: 0.08
  },
  fishin: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/fishin.ogg",
    dist: 6,
    volume: 0.08
  },
  ninja_style: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/ninja_style.ogg",
    dist: 6,
    volume: 0.08
  },
  the_worm: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/the_worm.ogg",
    dist: 6,
    volume: 0.08
  },
  wiggle: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/wiggle.ogg",
    dist: 6,
    volume: 0.08
  },
  star_power: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/star_power.ogg",
    dist: 6,
    volume: 0.08
  },
  rambunctious: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/rambunctious.ogg",
    dist: 6,
    volume: 0.08
  },
  rawr: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/rawr.ogg",
    dist: 6,
    volume: 0.08
  },
  fast_feet: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/fast_feet.ogg",
    dist: 6,
    volume: 0.08
  },
  capoeira: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/capoeira.ogg",
    dist: 6,
    volume: 0.08
  },
  bobbin: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/bobbin.ogg",
    dist: 6,
    volume: 0.08
  },
  overdrive: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/overdrive.ogg",
    dist: 6,
    volume: 0.08
  },
  fanciful: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/fanciful.ogg",
    dist: 6,
    volume: 0.08
  },
  bunny_hop: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/bunny_hop.ogg",
    dist: 6,
    volume: 0.08
  },
  no_sweat: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/no_sweat.ogg",
    dist: 6,
    volume: 0.08
  },
  windmill_floss: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/windmill_floss.ogg",
    dist: 6,
    volume: 0.08
  },
  swole_cat: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/swole_cat.ogg",
    dist: 6,
    volume: 0.08
  },
  head_banger: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/head_banger.ogg",
    dist: 6,
    volume: 0.08
  },
  get_loose: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/get_loose.ogg",
    dist: 6,
    volume: 0.08
  },
  bully: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/bully.ogg",
    dist: 6,
    volume: 0.08
  },
  bring_it_around: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/bring_it_around.ogg",
    dist: 6,
    volume: 0.08
  },
  square_up: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/square_up.ogg",
    dist: 6,
    volume: 0.08
  },
  without_you: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/without_you.ogg",
    dist: 6,
    volume: 0.08
  },
  run_it_down: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/run_it_down.ogg",
    dist: 6,
    volume: 0.08
  },
  goated: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/goated.ogg",
    dist: 6,
    volume: 0.08
  },
  celebrate_me: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/celebrate_me.ogg",
    dist: 6,
    volume: 0.08
  },
  pay_it_off: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/pay_it_off.ogg",
    dist: 6,
    volume: 0.08
  },
  fast_flex: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/fast_flex.ogg",
    dist: 6,
    volume: 0.08
  },
  get_out_of_your_mind: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/get_out_of_your_mind.ogg",
    dist: 6,
    volume: 0.08
  },
  lit_dance: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/lit_dance.ogg",
    dist: 6,
    volume: 0.08
  },
  take_the_elf: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/take_the_elf.ogg",
    dist: 6,
    volume: 0.08
  },
  snowman_player: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/snowman.ogg",
    dist: 6,
    volume: 0.08
  },
  choice_knit_player: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/choice_knit.ogg",
    dist: 6,
    volume: 0.08
  },
  shaolin_sip: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/shaolin_sip.ogg",
    dist: 6,
    volume: 0.08
  },
  treat_player: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/treat.ogg",
    dist: 6,
    volume: 0.08
  },
  sparkler: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/sparkler.ogg",
    dist: 6,
    volume: 0.08
  },
  telekinetic_player: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/telekinetic.ogg",
    dist: 6,
    volume: 0.08
  },
  tangerine_player: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/tangerine.ogg",
    dist: 6,
    volume: 0.08
  },
  heart_attach_player: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/heart_attach.ogg",
    dist: 6,
    volume: 0.08
  },
  omg_love_player: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/omg_i_love_it.ogg",
    dist: 6,
    volume: 0.08
  },
  planetary_vibe: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/planetary_vibe.ogg",
    dist: 6,
    volume: 0.08
  },
  pump_me_up: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/pump_me_up.ogg",
    dist: 6,
    volume: 0.08
  },
  headbanger_2: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/headbanger_2.ogg",
    dist: 6,
    volume: 0.08
  },
  culture_festival: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/culture_festival_dance.ogg",
    dist: 6,
    volume: 0.08
  },
  bust_a_move_1: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/bust_a_move.ogg",
    dist: 6,
    volume: 0.08
  },
  boys_a_liar: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/boys_a_liar.ogg",
    dist: 6,
    volume: 0.08
  },
  bizcochito: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/bizcochito.ogg",
    dist: 6,
    volume: 0.08
  },
  night_out: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/night_out.ogg",
    dist: 6,
    volume: 0.08
  },
  start_it_up: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/start_it_up.ogg",
    dist: 6,
    volume: 0.08
  },
  wind_up: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/wind_up.ogg",
    dist: 6,
    volume: 0.08
  },
  starlit: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/starlit.ogg",
    dist: 6,
    volume: 0.08
  },
  dom_yes: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/dom_yes.ogg",
    dist: 6,
    volume: 0.08
  },
  wanna_dance: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/wanna_dance.ogg",
    dist: 6,
    volume: 0.08
  },
  called_shot: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/called_shot.ogg",
    dist: 6,
    volume: 0.08
  },
  witch_way_player: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/witch_way.ogg",
    dist: 6,
    volume: 0.08
  },
  cardistry_player: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/cardistry.ogg",
    dist: 6,
    volume: 0.08
  },
  target_training: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/targer_training.ogg",
    dist: 6,
    volume: 0.08
  },
  crispy: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/keep_em_crispy.ogg",
    dist: 6,
    volume: 0.08
  },
  sprout_of_tune_player: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/sprout_of_tune.ogg",
    dist: 6,
    volume: 0.08
  },
  click_click_flash: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/click_click_flash.ogg",
    dist: 6,
    volume: 0.08
  },
  pony_up: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/pony_up.ogg",
    dist: 6,
    volume: 0.08
  },
  kiss_kiss: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/kiss_kiss.ogg",
    dist: 6,
    volume: 0.08
  },
  heart_sign: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/heart_sign.ogg",
    dist: 6,
    volume: 0.08
  },
  ambitious: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/ambitious.ogg",
    dist: 6,
    volume: 0.08
  },
  bad_guy: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/bad_guy.ogg",
    dist: 6,
    volume: 0.08
  },
  boney_bounce: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/boney_bounce.ogg",
    dist: 6,
    volume: 0.08
  },
  bood_up_groove: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/bood_up_groove.ogg",
    dist: 6,
    volume: 0.08
  },
  carefree: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/carefree.ogg",
    dist: 6,
    volume: 0.08
  },
  classy: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/classy.ogg",
    dist: 6,
    volume: 0.08
  },
  dancin_domino: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/dancin_domino.ogg",
    dist: 6,
    volume: 0.08
  },
  evil_plan: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/evil_plan.ogg",
    dist: 6,
    volume: 0.08
  },
  go_with_the_flow: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/go_with_the_flow.ogg",
    dist: 6,
    volume: 0.08
  },
  hooray: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/hooray.ogg",
    dist: 6,
    volume: 0.08
  },
  jubi_slide: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/jubi_slide.ogg",
    dist: 6,
    volume: 0.08
  },
  make_some_waves: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/make_some_waves.ogg",
    dist: 6,
    volume: 0.08
  },
  no_cure: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/no_cure.ogg",
    dist: 6,
    volume: 0.08
  },
  popular_vibe: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/popular_vibe.ogg",
    dist: 6,
    volume: 0.08
  },
  rain_check: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/rain_check.ogg",
    dist: 6,
    volume: 0.08
  },
  real_slim_shady: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/real_slim_shady.ogg",
    dist: 6,
    volume: 0.08
  },
  rebellious: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/rebellious.ogg",
    dist: 6,
    volume: 0.08
  },
  show_ya: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/show_ya.ogg",
    dist: 6,
    volume: 0.08
  },
  social_climber: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/social_climber.ogg",
    dist: 6,
    volume: 0.08
  },
  swag_shuffle: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/swag_shuffle.ogg",
    dist: 6,
    volume: 0.08
  },
  the_squabble: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/the_squabble.ogg",
    dist: 6,
    volume: 0.08
  },
  to_the_beat: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/to_the_beat.ogg",
    dist: 6,
    volume: 0.08
  },
  you_a_winner: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/you_a_winner.ogg",
    dist: 6,
    volume: 0.08
  },
  you_should_see_me_in_a_crown: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/you_should_see_me_in_a_crown.ogg",
    dist: 6,
    volume: 0.08
  },
  wanna_rock: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/wanna_rock.ogg",
    dist: 6,
    volume: 0.08
  },
  mm_go_bang: {
    url: "https://r2.gta5onyx.com/files/anims/sounds/9mm_go_bang.ogg",
    dist: 6,
    volume: 0.08
  }
};

export type AnimParam = {
  id: string,
  name: langData,
  upper: boolean;
  loop: boolean;
  seq: [string, string, number?][] | string;
  song?: string;
  prop?: {
    name: string;
    anim?: [string, string];
    attach: {
      bone: number;
      offsetPos: { x: number; y: number; z: number };
      offsetRot: { x: number; y: number; z: number };
    };
  }[];
};

export const ANIMS_LIST: {
  id: string;
  img: string;
  name: langData;
  anims: AnimParam[];
}[] = [
  {
    id: "1",
    name: ("anim.4626527a4be83c926cc7b3df8b13802b"),
    img: "joy",
    anims: [
      {
        name: ("anim.1c28e56ab46a5efa68d266811fe35968"),
        id: "02a7cc873df3be12ac99b3b8eee9d57b",
        seq: [["amb@world_human_musician@bongos@male@idle_a", "idle_a", 1]],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.6e5af4af54418c1cd93e1bf7f9e4ce27"),
        id: "55839e99fc535f995c52d82d23868eab",
        seq: [["amb@world_human_musician@bongos@male@idle_a", "idle_b", 1]],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.3d48dec53c49d8df4c706c32ba3192bb"),
        id: "78b940c8850ff23f1a4e29b8bfbd7911",
        seq: [["rcmnigel1d", "swing_a_mark", 1]],
        upper: false,
        loop: false,
      },
      {
        name: ("anim.ff581812bb8bd4343e16c7c058b20ba9"),
        id: "51ccd2620ee64cf93a7150a2028d04e3",
        seq: [["amb@world_human_musician@guitar@male@base", "base", 1]],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.9c6d5b9c88feb5894b722747ab926023"),
        id: "8d747edf4a79358fc0cee686ca24453b",
        seq: [["amb@world_human_musician@guitar@male@idle_a", "idle_c", 1]],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.256833f50debd8e4a26a5cbeba1019ab"),
        id: "98ffee1690227e3407c5f788eb7343b5",
        seq: [
          [
            "switch@trevor@guitar_beatdown",
            "001370_02_trvs_8_guitar_beatdown_idle_busker",
            1,
          ],
        ],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.f17edd832c3d5ee8c9d431ef3f450b99"),
        id: "d5925d78bc7c451c8f36b7a063f4a64e",
        seq: [["amb@world_human_musician@guitar@male@idle_a", "idle_c", 1]],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.978eb82253311a99b44b80cd0a734ab2"),
        id: "509a51c9a475960acf4da778b27be7a2",
        seq: "WORLD_HUMAN_AA_SMOKE",
        upper: false,
        loop: false,
      },
      {
        name: ("anim.28de0c599767a269153d1f0dffc4a370"),
        id: "20aaee7ae9b22cd236a92c840f9a56fc",
        seq: [["timetable@gardener@smoking_joint", "smoke_idle", 1]],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.b0f971b573305bc92a212d2438063176"),
        id: "ef46a09192d9b747702c43575c49f55c",
        seq: "WORLD_HUMAN_DRINKING",
        upper: true,
        loop: true,
      },
      {
        name: ("anim.0c8849c5d40edd0f7c9c8dfebcfebfa1"),
        id: "6bfec651869ca61f3b53b8802faeae9e",
        seq: [["amb@world_human_drinking@beer@male@idle_a", "idle_a", 1]],
        upper: true,
        loop: true,
      },
      {
        name: ("anim.920a5ec737fdb9c4bb60b52e022f5265"),
        id: "74d1d5a2d6f2d31f6de25accd8304859",
        seq: [["amb@world_human_drinking@coffee@female@idle_a", "idle_a", 1]],
        upper: true,
        loop: true,
      },
      {
        name: ("anim.4433f1b9db8fc108c8256ddf141ada01"),
        id: "fd6094671dee3574bcde8772750e11f4",
        seq: "WORLD_HUMAN_PARTYING",
        upper: false,
        loop: true,
      },
      {
        name: ("anim.a36b7674ac473eee1a68c790f1741ad7"),
        id: "9983523483142231ffbd67b174c8b1d9",
        seq: "WORLD_HUMAN_HUMAN_STATUE",
        upper: false,
        loop: true,
      },
      {
        name: ("anim.55b646aaf72ee55a181436a148bcf9a1"),
        id: "78895a8d8bfa1232a201ad6ab3d9ba59",
        seq: [["cellphone@self@franklin@", "chest_bump", 1]],
        upper: false,
        loop: false,
      },
      {
        name: ("anim.5fb53120a18b86dcf65474caa4e74388"),
        id: "6e3d74bae7e267c4d66a5d885f8774cf",
        seq: [["missbigscore1switch_trevor_piss", "piss_loop", 1]],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.ce7b09a92a0fceaade7dcc7e20387e57"),
        id: "860aa05ff171b3cb9747621fe60d88d5",
        seq: [["rcm_epsilonism4", "peeing", 1]],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.364769e3aecfaa3ecf495fc524a2b67e"),
        id: "b2ec8ebdc7fb04b16e776e6b813be552",
        seq: [["amb@world_human_jog_standing@male@base", "base", 1]],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.b48128d4ddb2d373b5dac2fa5f4b1a0b"),
        id: "cc39366915de0d17b82e0230edbc9aba",
        seq: [["move_f@runner", "idle", 1]],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.fe7a9435975bbf134d45538b06130553"),
        id: "9db6df70fa0a0855d8d9a52db1b69c45",
        seq: [["timetable@tracy@ig_5@base", "base", 1]],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.2334089c03385356ec6f65d4d27155c3"),
        id: "1bd6e2c8d4f5f5b5819bd0e654e05df9",
        seq: "WORLD_HUMAN_PUSH_UPS",
        upper: false,
        loop: false,
      },
      {
        name: ("anim.003f79376305a756645d0fd06d0a663e"),
        id: "a42aa5324e33c3eb0f88d51e3fdfc98b",
        seq: [
          ["switch@franklin@press_ups", "pressups_into", 1],
          ["switch@franklin@press_ups", "pressups_loop", 1],
        ],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.50957e4542cb69cc185e89ae87874272"),
        id: "7be74d8a56590f0cfe4b7374773b95b6",
        seq: "WORLD_HUMAN_SIT_UPS",
        upper: false,
        loop: false,
      },
      {
        name: ("anim.7e96d296cc5e880733aba62ef2ea6c8d"),
        id: "718abf2056bc65f328a86f93d55e1b61",
        seq: "WORLD_HUMAN_GARDENER_PLANT",
        upper: false,
        loop: false,
      },
      {
        name: ("anim.01be0ca32caa110ae0cd26fde22c06fa"),
        id: "9126c19a807eaf51516d59bf29ddacfd",
        seq: [["anim@mp_player_intincarrockbodhi@rds@", "idle_a_fp", 1]],
        upper: true,
        loop: true,
      },
      {
        name: ("anim.b61d64d0ef5a3bb3835f5309752cb558"),
        id: "65057408bc3d4fad9bc4189c5bf540e4",
        seq: [["anim@mp_player_intincarthumbs_upbodhi@ds@", "idle_a_fp", 1]],
        upper: true,
        loop: true,
      },
      {
        name: ("anim.9c3a470cdfd068dc14e2bbeca50db2bf"),
        id: "bd4d2a72ab4e746617f00f692fa678f7",
        seq: [["anim@mp_player_intselfiedock", "idle_a", 1]],
        upper: true,
        loop: true,
      },
      {
        name: ("anim.431d089341aa2c4e014cf2906dde4f33"),
        id: "293970d6533d51feb2ed231f3627731e",
        seq: [
          [
            "amb@code_human_in_car_mp_actions@v_sign@bodhi@rps@base",
            "idle_a",
            1,
          ],
        ],
        upper: true,
        loop: true,
      },
      {
        name: ("anim.9adcab1ef01edebba3f3692e73a97e6e"),
        id: "f624c866ceaa15d7e521e7ef2e892fde",
        seq: [["rcmcollect_paperleadinout@", "meditiate_idle", 1]],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.903f9f7d9fbf778f0a0e303230dc84ea"),
        id: "82cd0cfdc1d2bfe02f3d182b7cc85904",
        seq: "WORLD_HUMAN_YOGA",
        upper: false,
        loop: true,
      },
      {
        name: ("anim.b8c5e65e342378a606c5fa6896ced107"),
        id: "b4ea0600566a487dae9f42d1b229fd33",
        seq: [["timetable@amanda@ig_4", "ig_4_idle", 1]],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.11ac237c3eed7f42ee1918cf7967ac85"),
        id: "d4e0cd65e575761cbfe5e15006b915ac",
        seq: [
          ["amb@world_human_yoga@female@base", "base_a", 1],
          ["amb@world_human_yoga@female@base", "base_c", 1],
        ],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.605c56dd258062bfde5712f89725dfdb"),
        id: "4e81eadf780b39b81eb1e3eb2624d103",
        seq: [["amb@world_human_jog_standing@male@base", "base", 1]],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.f2b1f0fc582db8fcbbabbff314fe8aeb"),
        id: "f23a153302d0c82c275ccf24ca1828ef",
        seq: [
          ["anim@melee@machete@streamed_core@", "victim_front_takedown", 1],
        ],
        upper: false,
        loop: false,
      },
      {
        name: ("anim.71f1a4f6edc73d9595a44c46cb07ee83"),
        id: "a366f625675d060b29ae9d645bb29f35",
        seq: [["anim@mp_player_intcelebrationmale@peace", "peace", 1]],
        upper: true,
        loop: false,
      },
      {
        name: ("anim.e0fdb2a9221150fcf10893832334d6f3"),
        id: "ec9bd1f04eef91b6b5060e574521f894",
        seq: [
          [
            "anim@mp_player_intcelebrationfemale@air_shagging",
            "air_shagging",
            1,
          ],
        ],
        upper: false,
        loop: false,
      },
      {
        name: ("anim.bab141329bfeeb28bbfb14947180e4f0"),
        id: "c3b9980dc2c968a10c84acdc30e3d28b",
        seq: [["anim@mp_player_intcelebrationmale@blow_kiss", "blow_kiss", 1]],
        upper: false,
        loop: false,
      },
      {
        name: ("anim.e5834bc69a7132e61da9558e68aae455"),
        id: "7c30fa0904491dd18cb28de552355a07",
        seq: [
          [
            "anim@mp_player_intcelebrationfemale@chicken_taunt",
            "chicken_taunt",
            1,
          ],
        ],
        upper: false,
        loop: false,
      },
      {
        name: ("anim.971753c460227bc5d83f9b26159b002c"),
        id: "737221090d9c48a255d68b9c57ef5672",
        seq: [["anim@mp_player_intcelebrationfemale@dock", "dock", 1]],
        upper: false,
        loop: false,
      },
      {
        name: ("anim.eb6a269154770ac753a4111577d60bc4"),
        id: "18d82bed091bc8589fcd06964c9b3eb4",
        seq: [
          [
            "anim@mp_player_intcelebrationfemale@thumb_on_ears",
            "thumb_on_ears",
            1,
          ],
        ],
        upper: false,
        loop: false,
      },
      {
        name: ("anim.cca0e7901acf461dd2182c2aa5054f8c"),
        id: "b40b8069435bc7c7d68827b59b18396c",
        seq: [["anim@mp_player_intcelebrationfemale@finger", "finger", 1]],
        upper: false,
        loop: false,
      },
      {
        name: ("anim.9a1cf6580d3da7d063fa30c37312b05e"),
        id: "3f272ccf3d7ac8e882db6d494aa51eaf",
        seq: [
          ["rcm_barry2", "clown_idle_0", 1],
          ["rcm_barry2", "clown_idle_1", 1],
          ["rcm_barry2", "clown_idle_2", 1],
          ["rcm_barry2", "clown_idle_3", 1],
          ["rcm_barry2", "clown_idle_4", 1],
          ["rcm_barry2", "clown_idle_5", 1],
          ["rcm_barry2", "clown_idle_6", 1],
        ],
        upper: false,
        loop: false,
      },
      {
        name: ("anim.396c408f782c215309e2cd236db98555"),
        id: "016877136459ccaa665c4f8fde938b25",
        seq: [["backflip@animation", "backflip_clip", 1]],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.d899b5ba9c4bed3ff9ef834c7bdd426e"),
        id: "520bd502b48ff25346f808ce8ab55741",
        seq: [["catbackflip@animation", "catbackflip_clip", 1]],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.c148e430663ad53864f93144af3b35b0"),
        id: "44a47e62ef7830d1dfdc1af91101b90c",
        seq: [["emotebandofthefort@animation", "emotebandofthefort_clip", 1]],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.2d631cee2a1fa7b44ab64f8daa18cd21"),
        id: "9eca54549030e060e2da34757b53eb2e",
        seq: [["emotedancelosercmf@animation", "emotedancelosercmf_clip", 1]],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.91b8dcb8d8e49a8000f8cc5a7f39f502"),
        id: "45c1c7ba28239320a711a174e0a72e41",
        seq: [
          ["emotedanceridethepony@animation", "emotedanceridethepony_clip", 1],
        ],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.257e3f993c2de6eff66de43ccccce6e1"),
        id: "a9c5159bb226957ff0113fea2c932fca",
        seq: [["emoteheelclick@animation", "emoteheelclick_clip", 1]],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.e2fcc609f26753da5b1db743673bec46"),
        id: "dafe29dab76460c6cf8f3e097729dda2",
        seq: [["emotemakeitrain@animation", "emotemakeitrain_clip", 1]],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.88e7eab66f6517cdf2873f0419abaf28"),
        id: "149dff08b4f4d32607c546360219e06d",
        seq: [["emotethumbsdown@animation", "emotethumbsdown_clip", 1]],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.42fb0f3fabba692f98b05c5a5e41681c"),
        id: "7abfe0b5667906328774e2482451ffc6",
        seq: [["loosers@animation", "loosers_clip", 1]],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.fa1722d5f11fec1125020e2a261ddb35"),
        id: "a23fcf75810878f780a5bc3f3793caf2",
        seq: [["mmakick@animation", "mmakick_clip", 1]],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.51a36ecb93fc7cdc89b6ae8ac03e6af4"),
        id: "308886a595ab3ecd2d631e77d59859ad",
        seq: [
          ["timetable@ron@ig_4", "ig_4_idle_b", 1],
          ["timetable@ron@ig_4", "ig_4_idle_a", 1],
          ["timetable@ron@ig_4", "ig_4_idle_c", 1],
        ],
        upper: false,
        loop: false,
      },
      {
        name: ("anim.adb02fa8408bf8c1c47439df972c6c7b"),
        id: "956eb56a4ae29d5a80b632e430b236c6",
        seq: [
          ["timetable@trevor@grenade_throwing", "grenade_throwing_trev", 1],
        ],
        upper: false,
        loop: false,
      },
      {
        name: ("anim.a58d8c4fda72112d2fdc79ca80cc9c72"),
        id: "72981adf9621eb0c3ded2c3d0613635e",
        seq: [["veh@bike@chopper@front@ps", "jump_out", 1]],
        upper: false,
        loop: false,
      },
    ],
  },
  {
    id: "2",
    name: ("anim.acca5b8c42c0b0c75c86ac7c23b08e32"),
    img: "social",
    anims: [
      {
        name: ("anim.686feacde221c8bf554e623184d7740f"),
        id: "60098edf01a9404a2a6a421591c8cd31",
        seq: [["timetable@reunited@ig_2", "jimmy_base", 1]],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.5199fb94f12873eb3202b9b44a7f8169"),
        id: "68577df90c1451e0a4fc71d12e215c22",
        seq: "WORLD_HUMAN_BINOCULARS",
        upper: false,
        loop: false,
      },
      {
        name: ("anim.8313eae2322a32cf18c64b356e28828d"),
        id: "5399f21d586a9a14d73c521ce872827f",
        seq: [["mini@repair", "fixing_a_ped", 1]],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.6409355f45a40417572f33aab7122ef5"),
        id: "e8ad1bf49bb218e64d671472bd71c9c4",
        seq: [
          [
            "anim@mp_player_intcelebrationpaired@f_f_sarcastic",
            "sarcastic_right",
            1,
          ],
        ],
        upper: false,
        loop: false,
        prop: [
          {
            name: ("prop_vodka_bottle"),
            attach: {
              bone: 24816,
              offsetPos: { x: -0.115, y: -0.03, z: 0.2 },
              offsetRot: { x: 105, y: 181, z: 358 },
            },
          },
        ],
      },
      {
        name: ("anim.40a002e9fb4f4f04a8c051f5f111fc5c"),
        id: "c2c972b12a36374444451253f3153110",
        seq: "WORLD_HUMAN_CHEERING",
        upper: true,
        loop: true,
      },
      {
        name: ("anim.f94f6ef02546410946fb5ac399137fe1"),
        id: "1c47a88409054f45ac7f885ae1807476",
        seq: [["amb@world_human_cheering@female_d", "base", 1]],
        upper: true,
        loop: true,
      },
      {
        name: ("anim.b89dd58118994d725688d147c6bbb5c3"),
        id: "13982336141571df5181c7913cacb703",
        seq: [["amb@world_human_cheering@male_a", "base", 1]],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.371ce5a2171650dab619e76a41bf8266"),
        id: "b83937ea99ca13267308216e682d040b",
        seq: [["amb@world_human_cheering@male_d", "base", 1]],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.873a3fc60e7e1d3ebe3d35b02057f4d4"),
        id: "cf0370bed5d55ae0d091ca4dc4e33f86",
        seq: [["random@car_thief@victimpoints_ig_3", "arms_waving", 1]],
        upper: true,
        loop: true,
      },
      {
        name: ("anim.739c67caec44d13586d26fe6179a05b1"),
        id: "6917ca422e3a9576a4e02915f0270085",
        seq: "WORLD_HUMAN_MOBILE_FILM_SHOCKING",
        upper: false,
        loop: true,
      },
      {
        name: ("anim.31023b42e022deff483eb421d5ec2846"),
        id: "717714ae750ccc9544ff1a73f0b20e53",
        seq: "WORLD_HUMAN_TOURIST_MOBILE",
        upper: false,
        loop: true,
      },
      {
        name: ("anim.48769a1a4b155eebdcd4a138b7e6d3b7"),
        id: "81025320e27df5a40ea1b17bd952e0e7",
        seq: "WORLD_HUMAN_STAND_MOBILE",
        upper: false,
        loop: true,
      },
      {
        name: ("anim.0fb97312dd018071439e812b016b3f5b"),
        id: "e8886ee6db8a81a2369f509da9fe36d6",
        seq: "WORLD_HUMAN_HANG_OUT_STREET",
        upper: false,
        loop: true,
      },
      {
        name: ("anim.0848a4bdf7c62469430611a8c7a20191"),
        id: "b1df0215afcd14f59a49eaebc3486037",
        seq: "WORLD_HUMAN_HANG_OUT_STREET_CLUBHOUSE",
        upper: false,
        loop: true,
      },
      {
        name: ("anim.8f1178f101a14a951ad186e9a69353f1"),
        id: "a591b2b0c24018d364f69e8b4a81e619",
        seq: "WORLD_HUMAN_SECURITY_SHINE_TORCH",
        upper: false,
        loop: true,
      },
      {
        name: ("anim.ca6b74e55a83dd4cbc1b4859b896d009"),
        id: "defc18bf9ce323dd285b9d0c2ba30352",
        seq: [["anim@mp_player_intcelebrationmale@face_palm", "face_palm", 1]],
        upper: false,
        loop: false,
      },
      {
        name: ("anim.4c42dbd8ca56f735c6bb3bcb8236b6e0"),
        id: "18f6a353354e0ed8113a64ffe2361f86",
        seq: "WORLD_HUMAN_STAND_IMPATIENT_UPRIGHT",
        upper: false,
        loop: true,
      },
      {
        name: ("anim.2c7ab5ca4ba7e57ad9a3453c1ead1df4"),
        id: "e5e7c86758d28e5d85ab363b79b56315",
        seq: "CODE_HUMAN_CROSS_ROAD_WAIT",
        upper: false,
        loop: true,
      },
      {
        name: ("anim.98115d8b8d29bb910e3be18e10d98936"),
        id: "2d4592b277a10caa191951774984ff98",
        seq: [["friends@", "pickupwait", 1]],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.a59e1175712250cf4971efe79bf3244e"),
        id: "c4de2b3ae31bb4d7f1adfca2fd60396d",
        seq: "WORLD_HUMAN_TOURIST_MAP",
        upper: false,
        loop: true,
      },
      {
        name: ("anim.0deabad43e07095ae1879d1e86c67024"),
        id: "9600337caf7271cec086a2a5fbb1983a",
        seq: [
          ["special_ped@clinton@convo_1@convo_1a", "im_in_hell_0", 1],
          ["special_ped@clinton@convo_1@convo_1b", "im_in_hell_1", 1],
        ],
        upper: false,
        loop: false,
      },
      {
        name: ("anim.790806584232d50b024a82f2c3a3be08"),
        id: "94fe8031d610c5ed11787514aa706f1b",
        seq: [
          [
            "special_ped@clinton@convo_2@convo_2b",
            "living_in_this_plastic_1",
            1,
          ],
        ],
        upper: false,
        loop: false,
      },
      {
        name: ("anim.9175e4ada0c1875fb69c49a9b5a8c676"),
        id: "9758dd55b36b2645144ba5da9d773e64",
        seq: [
          ["special_ped@clinton@convo_5@convo_5a", "you_dont_give_a_0", 1],
          ["special_ped@clinton@convo_5@convo_5b", "you_dont_give_a_1", 1],
        ],
        upper: false,
        loop: false,
      },
      {
        name: ("anim.eb267008282852868cbebcf6ecc909ee"),
        id: "6fd459b0d382d36f161f5aec4ad3e19b",
        seq: [
          [
            "special_ped@impotent_rage@convo_2@convo_2a",
            "i_wanna_do_hamlet_0",
            1,
          ],
        ],
        upper: false,
        loop: false,
      },
      {
        name: ("anim.6bf216bab10eff0eba39338dcec61afa"),
        id: "8d86d67cac59309a5b31db8e74e08a2e",
        seq: [
          [
            "special_ped@impotent_rage@convo_3@convo_3a",
            "having_about_as_much_0",
            1,
          ],
        ],
        upper: false,
        loop: false,
      },
      {
        name: ("anim.e6755eb88c05fce983eb8aad179901c4"),
        id: "da34191f688b113b8dc6d198dea72f95",
        seq: [["stungun@standing", "damage", 1]],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.25ef273665fab629c2fc622cec4e9ef0"),
        id: "58545185ea89729353f5281e71677177",
        seq: [["ragdoll@human", "electrocute", 1]],
        upper: false,
        loop: false,
      },
      {
        name: ("anim.fa7cc0485a8bd54e8bf0ffb162cf23fd"),
        id: "82b1009953de20496de2b3bc361af72f",
        seq: [
          [
            "anim@heists@fleeca_bank@hostages@ped_d@",
            "flinch_under_fire_outro",
            1,
          ],
        ],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.3894762506230fcd524fc5e8e1219ee1"),
        id: "1641de3c26e83e9daae17dcb2cb0b067",
        seq: [["switch@franklin@bed", "stretch_long", 1]],
        upper: true,
        loop: false,
      },
      {
        name: ("anim.a46c8d8c7edf9a0b74f39733174fbc1d"),
        id: "2b42c4e167dde489b41c194b7c15fd67",
        seq: [["taxi_hail", "hail_taxi", 1]],
        upper: true,
        loop: false,
      },
      {
        name: ("anim.e03b17c3c6ae261da85281013a6711cb"),
        id: "bd56489f03697606b446b00302b9e646",
        seq: [["rcmnigel1c", "hailing_whistle_waive_a", 1]],
        upper: true,
        loop: false,
      },
      {
        name: ("anim.de6ab2e85ae83eefb0f9598f16475a73"),
        id: "d018521ee716bab39a00896f341bc7ef",
        seq: [
          ["amb@code_human_in_car_mp_actions@wank@bodhi@rps@", "idle_a", 1],
        ],
        upper: true,
        loop: true,
      },
      {
        name: ("anim.0724eec78cabf171c4a73da17452942d"),
        id: "20e38c08baacc5b4bcf4940165f1b230",
        seq: [["amb@world_human_cheering@female_b", "base", 1]],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.f364348fcd3e74b3d4595b3e39f59a1a"),
        id: "008a7b1ce92ee5538c11cfd9e7d98748",
        seq: [["amb@world_human_cheering@female_c", "base", 1]],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.88a2b61956c92a61673df9e446010af1"),
        id: "595dc5fa00fc12aacea5c28879dfb992",
        seq: [["amb@world_human_cheering@male_b", "base", 1]],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.9fed818084d7150bcd74342d7b0394d4"),
        id: "4909aacca6b44eada4f316edc26cd350",
        seq: [["amb@world_human_muscle_flex@arms_at_side@idle_a", "idle_c"]],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.e4f6e47c2b7aa3e41c1dcce854d9b682"),
        id: "9ecda585019edfca0a259198264b22fa",
        seq: [["amb@world_human_muscle_flex@arms_in_front@idle_a", "idle_a"]],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.d61719dd84c49e9638f9e140a62a2c50"),
        id: "1281e6c5ad793158ba0714dae1dca9b8",
        seq: "WORLD_HUMAN_MUSCLE_FLEX",
        upper: false,
        loop: true,
      },
      {
        name: ("anim.4814dfa980db87673a3ff7d840af650c"),
        id: "715d662e7603c5b4b6fd77e41ac774c1",
        seq: "WORLD_HUMAN_STAND_FIRE",
        upper: false,
        loop: false,
      },
      {
        name: ("anim.66fad6da8d87b33f15bb8e5d66ec0de6"),
        id: "0f6c3710f1e9e7c26fe6365b18be7510",
        seq: [
          ["anim@heists@prison_heistig_5_p1_rashkovsky_idle", "idle_180", 1],
        ],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.5416442857e7f7ff85d8564010f2b3ad"),
        id: "91b3dcd1c2e8fec6e59e10bd030de677",
        seq: [["timetable@trevor@skull_loving_bear", "skull_loving_bear", 1]],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.ef17b6248b9335b7d1d82deb6a159c34"),
        id: "dc874c7959b63384c23980ca86d3487a",
        seq: [["mp_suicide", "pistol", 1]],
        upper: false,
        loop: false,
      },
      {
        name: ("anim.767d3f76f5b9c045af8919393d257e26"),
        id: "d9e2f1140a964c67ea47f1f94a950e44",
        seq: [["emoteclapperboard@animation", "emoteclapperboard_clip", 1]],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.9354cdc7ec3154d6a6ce95dc3a43733e"),
        id: "f659390ae08d7cf6772c51d48c820bc1",
        seq: [
          ["emotedustoffshoulders@animation", "emotedustoffshoulders_clip", 1],
        ],
        upper: false,
        loop: true,
      },
    ],
  },
  {
    id: "3",
    name: ("anim.bb7036a1a6a4e61680ff0ba6d4ee72e8"),
    img: "services",
    anims: [
      {
        name: ("anim.ff0f19c1070e05d22f887dbf24dbcdc2"),
        id: "0de0b50644dc7f9b582bbd9afba17d73",
        seq: [
          ["amb@world_human_paparazzi@male@enter", "enter", 1],
          ["amb@world_human_paparazzi@male@base", "base", 1],
        ],
        upper: true,
        loop: true,
      },
      {
        name: ("anim.60131f3ec4298e30dc44018a97d66419"),
        id: "9f4f762d8f1e8a326ce41c7f2fda2e74",
        seq: [
          ["amb@world_human_paparazzi@male@idle_a", "idle_a", 1],
          ["amb@world_human_paparazzi@male@idle_a", "idle_b", 1],
          ["amb@world_human_paparazzi@male@idle_a", "idle_c", 1],
        ],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.0d24b65fe3a22ce57f3b79d485f342cc"),
        id: "645d682b6678425cf79adee845e7ad4e",
        seq: [["rcmpaparazzo_4", "gesture_to_cam_camman", 1]],
        upper: true,
        loop: true,
      },
      {
        name: ("anim.47efe5f6852812dae941dba7cd190de5"),
        id: "445d9f17d419eecdb821dc65a8796b27",
        seq: [["mp_player_int_uppersalute", "mp_player_int_salute", 1]],
        upper: true,
        loop: true,
      },
      {
        name: ("anim.2b58917087cd6e5f182b1109a7a19cf6"),
        id: "988a1b018db96e28372607ea027aad02",
        seq: "WORLD_HUMAN_CLIPBOARD_FACILITY",
        upper: true,
        loop: true,
      },
      {
        name: ("anim.223b4a26ffbfeb2673f9aa8fa7772736"),
        id: "ef1c0486a892fef32600632151180670",
        seq: "CODE_HUMAN_MEDIC_TIME_OF_DEATH",
        upper: true,
        loop: true,
      },
      {
        name: ("anim.4a0997c2f6fadda6c7ecd1af368ba3bb"),
        id: "7ec6d25adb2beba3383fc2af4bbe1e9e",
        seq: [["amb@medic@standing@timeofdeath@base", "base", 1]],
        upper: true,
        loop: true,
      },
      {
        name: ("anim.3de620c3f49899d1b95529e97de0b696"),
        id: "a1cc98e8bb351125e0f32d81455cf46f",
        seq: [["amb@code_human_wander_idles_cop@male@static", "static", 1]],
        upper: true,
        loop: true,
      },
      {
        name: ("anim.088e46f2357058bdc68e70286755b6cf"),
        id: "b800329b5b78e27ceeb9e15e1dba8033",
        seq: [["amb@code_human_wander_idles_cop@female@static", "static", 1]],
        upper: true,
        loop: true,
      },
      {
        name: ("anim.630ca516321de7e74ac68ae8f24d9441"),
        id: "afd710bd6c4fdaeccc25e9977b0e164d",
        seq: "CODE_HUMAN_MEDIC_KNEEL",
        upper: false,
        loop: true,
      },
      {
        name: ("anim.a34f9ae868ff46972428b14e3f9dcec6"),
        id: "84130a43ff39ece38a0a173434c5d157",
        seq: "CODE_HUMAN_MEDIC_TEND_TO_DEAD",
        upper: false,
        loop: true,
      },
      {
        name: ("anim.3de8fa32d320a7e31e88d82835e7cfa6"),
        id: "24300d79c7b875d5afeeb64abb29f511",
        seq: [
          ["amb@medic@standing@tendtodead@enter", "enter ", 1],
          ["amb@medic@standing@tendtodead@idle_a", "idle_a", 1],
        ],
        upper: true,
        loop: true,
      },
      {
        name: ("anim.9e2efafaace03b21e1ecc907d5ba2e34"),
        id: "8014ab022a1c80b49653a3d8bbafd74b",
        seq: [["anim@heists@money_grab@duffel", "loop", 1]],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.44a3ae3a42610f7f11addb621d7d2213"),
        id: "be388a543d147e0a113a13622b9465d3",
        seq: [["missmic1leadinoutmic_1_mcs_2", "_leadin_trevor", 1]],
        upper: false,
        loop: true,
      },
    ],
  },
  {
    id: "4",
    name: ("anim.bf92925db555390cd23d6a7c729e3383"),
    img: "dance",
    anims: [
      {
        name: ("anim.c4498d06f1be937c9c32358522a40eed"),
        id: "31cec08bc29254222dd0978bd567bb8b",
        seq: [
          [
            "special_ped@mountain_dancer@monologue_1@monologue_1a",
            "mtn_dnc_if_you_want_to_get_to_heaven",
            1,
          ],
        ],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.4a9c3519aa1afd5be0893bab316d4342"),
        id: "af1d42d5899d037ad7a66d539f0a40ed",
        seq: [
          [
            "special_ped@mountain_dancer@monologue_2@monologue_2a",
            "mnt_dnc_angel",
            1,
          ],
        ],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.e9c39345cd87971013d60ec588ef3573"),
        id: "0a36c2fe8d3f3a8c5df95e428effe897",
        seq: [
          [
            "special_ped@mountain_dancer@monologue_3@monologue_3a",
            "mnt_dnc_buttwag",
            1,
          ],
        ],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.1305da0d084093740adcaae9154b139c"),
        id: "8a9cb5657aa4183cf9a324334f4da70e",
        seq: [
          ["amb@world_human_partying@female@partying_beer@base", "base", 1],
        ],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.524358c610122f111880ab9927e53512"),
        id: "0e075e52b476b118fa3fa110c46eb1ca",
        seq: [["amb@world_human_strip_watch_stand@male_a@idle_a", "idle_c"]],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.cebb7246499b11b298ea8e83ac08febd"),
        id: "55c233e098bf895c6e4c8524abc786ab",
        seq: [
          ["rcmnigel1bnmt_1b", "dance_intro_tyler", 1],
          ["rcmnigel1bnmt_1b", "dance_loop_tyler", 1],
        ],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.392f44b56bbe84e7f175bccb6d287574"),
        id: "cb4eff7364584a4e6b225ba642563e11",
        seq: [["move_clown@p_m_two_idles@", "fidget_short_dance", 1]],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.e6ac29075472bb5eea2820f4adfa5d47"),
        id: "6c8af03bb33f0373258ea64746e2d3d5",
        seq: [["misschinese2_crystalmazemcs1_cs", "dance_loop_tao", 1]],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.f5f5bd0cf35814d048f8e7e0d1ef4b84"),
        id: "366ed2cb276d3356dfb3ecf704f39469",
        seq: [["timetable@tracy@ig_5@idle_a", "idle_a", 1]],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.e5179a608ddd6af772c3429b9c9c1083"),
        id: "dd526010aea4ad57572ba09faaad2dc6",
        seq: [["timetable@tracy@ig_5@idle_a", "idle_b", 1]],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.9d396f9d06b9ea08a607656aba468098"),
        id: "8a83d8709fef7e90d87e9f342d2916ca",
        seq: [["timetable@tracy@ig_5@idle_a", "idle_c", 1]],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.6ae8034916537ddb318be16f7d965ecb"),
        id: "237c759ded2a59125e194da8d67eeedb",
        seq: [["timetable@tracy@ig_5@idle_b", "idle_e", 1]],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.71cff6a58ac532ac8933bd6182c2a10f"),
        id: "674a60b63eb566693f125e7753a7cd30",
        seq: [["timetable@tracy@ig_5@idle_b", "idle_d", 1]],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.b234454e418cd3e7e3a8ef4e09c7f0b1"),
        id: "840ede54cd5f8b0a59b404a0c4d58c8c",
        seq: [["timetable@tracy@ig_8@idle_a", "idle_a", 1]],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.f3fd081576fc96ed5b478feed9959d8d"),
        id: "cf2bac3ec648190c18c7345d60af6959",
        seq: [
          ["amb@world_human_prostitute@cokehead@idle_a", "idle_b", 1],
          ["amb@world_human_prostitute@cokehead@idle_a", "idle_c", 1],
          ["amb@world_human_prostitute@cokehead@idle_a", "idle_a", 1],
        ],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.7d686d1978eac11901c2ac84871972ee"),
        id: "8a1e896d726ec91cd58695945b07704f",
        seq: [["mini@strip_club@private_dance@part1", "priv_dance_p1", 1]],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.55a92e5a99eca35a17e00a40b29f63dc"),
        id: "7e4d7df45a441c9f54de355f1165ab9b",
        seq: [["mini@strip_club@private_dance@part2", "priv_dance_p2", 1]],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.75ca024a3dcf8d0b59530c36b6d0437b"),
        id: "7f564b7bf44e11a43f80a488273f60bf",
        seq: [["mini@strip_club@private_dance@part3", "priv_dance_p3", 1]],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.a7110a821e088eca6053f8a7be2a3c16"),
        id: "434957de89be0b3f67a7adc697fa6d00",
        seq: [
          [
            "mini@strip_club@lap_dance@ld_girl_a_song_a_p1",
            "ld_girl_a_song_a_p1_f",
            1,
          ],
        ],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.d8c0ab6e9f13bac32502869235d31437"),
        id: "bb3052c20e59b69ca3d1fe754df50f7f",
        seq: [["mp_am_stripper", "lap_dance_girl", 1]],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.732b2bda9d9d9f57929275b80e215d40"),
        id: "1e7c46847cd6184c33295aaeab857e01",
        seq: [["breakdanceending1@animation", "breakdanceending1_clip", 1]],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.440376b0b55a79f2e80eb811e8fe6d8e"),
        id: "a9d9b8ff13e9bd91ce4e21c8fe876e5f",
        seq: [["breakdanceending3@animation", "breakdanceending3_clip", 1]],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.c763e87e5a5da37b65d5ce6690beeb8d"),
        id: "2d5fcc21cd410a30bc0463a7b975dc09",
        seq: [["breakdancefreezes@animation", "breakdancefreezes_clip", 1]],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.6b3e1ddaeefd00897abfc68542c0c3ca"),
        id: "86226494b8bd38eeae7ff7b649c72e8f",
        seq: [
          ["breakdancefreezevar2@animation", "breakdancefreezevar2_clip", 1],
        ],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.4159423b6e74f15d4852d1a9210a3ea3"),
        id: "97d05d914bd84b611d9ecd402a5b95c7",
        seq: [
          ["breakdancefreezevar4@animation", "breakdancefreezevar4_clip", 1],
        ],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.3990aefb805143bd63b880d3be8ba6d6"),
        id: "6b59e5ec3479f624220542f026354648",
        seq: [
          ["breakdanceuprockvar2@animation", "breakdanceuprockvar2_clip", 1],
        ],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.936c45341f5b38dcdcc05f48eaa2bbcd"),
        id: "ab20b40bcd13ee06aa0861142b689f47",
        seq: [["brooklynuprock@animation", "brooklynuprock_clip", 1]],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.33687ca8d056b1e0f42f41ddb8f55ad1"),
        id: "c79d4383841125afc8da18098c0de198",
        seq: [["dancemoves@animation", "dancemoves_clip", 1]],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.0cd4bcc9e0860716a18dc4567af135ce"),
        id: "f3448e9030c49526d5ffa2fd5b581ab5",
        seq: [["dancingrunningman@animation", "dancingrunningman_clip", 1]],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.8dac99ca9ae0effe542ee0e7c1c68318"),
        id: "b328d965c6042d8466f880e7ecb38f25",
        seq: [
          ["northernsoulspincombo@animation", "northernsoulspincombo_clip", 1],
        ],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.22a4141addeba33cee62977c753f1c0c"),
        id: "3d4ff804cf49dd62ff6d76ddd4c19cd5",
        seq: [["chickendance@animation", "chickendance_clip", 1]],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.666ad68e252008cf1d072b6b1492a9c8"),
        id: "7931a9c60667d01c79a17f37237df5fa",
        seq: [["dancemakarena@animation", "dancemakarena_clip", 1]],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.866291b99dd9a65b930567f515833a1e"),
        id: "c641196223bfacc3d1c942e737c13f78",
        seq: [["dancetwerk@animation", "dancetwerk_clip", 1]],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.2d0810bef2ed9056ae79480060b5ca0a"),
        id: "af631b5950e9631e1cbf4fb8d06e0201",
        seq: [["electroshuffle@animation", "electroshuffle_clip", 1]],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.a72e3916a60b29e03ede0dafb4f7659f"),
        id: "eededc3b0403ddbdd6720f9a59d7b65d",
        seq: [["emotedancedisco@animation", "emotedancedisco_clip", 1]],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.dd811bbfa79c2027f9d44d3614b36e5e"),
        id: "7d3d5a47b38da21febab9db09a2da4dc",
        seq: [["emoterobotdance@animation", "emoterobotdance_clip", 1]],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.5e9ea0f451b7d3fbaf5005047849bebb"),
        id: "e27e883030b656f4246d2f8f153de106",
        seq: [["emotedanceshootcmf@animation", "emotedanceshootcmf_clip", 1]],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.2a9904d491ced9b433e83c2d40b69888"),
        id: "1f882cc8b74cc7f75f33eb4808a29cc3",
        seq: [["hiphophand@animation", "hiphophand_clip", 1]],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.d9eb66d96953a209811004a4aad7c30c"),
        id: "752746913f1fa0a708911b502df6b385",
        seq: [["breackdnace1990@animation", "breackdnace1990_clip", 1]],
        upper: false,
        loop: true,
      }
      // {
      //   name: ("anim.4aeadde6cf8079bfc405f2b1eacc972d"),
      //   id: "d37579385e76abcb1c594c7693759ba0",
      //   seq: [["majestic_animations", "blinding_lights", 1]],
      //   upper: false,
      //   loop: true,
      //   song: "blinding_lights",
      // },
    //   {
    //     name: ("anim.fc11dc7437136561a48999d1c3837c86"),
    //     id: "451869f843955f036ca7cc95c6b8980f",
    //     seq: [["majestic_animations", "boogie_down", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "boogie_down",
    //   },
    //   {
    //     name: ("anim.3f9d2d1d939d95f5940f092354160d5d"),
    //     id: "c8807bfd0b608d9244f62121fabf6efc",
    //     seq: [["majestic_animations", "cowboy_dance", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "cowboy_dance",
    //   },
    //   {
    //     name: ("anim.92f1ae1d5dd0b3675f5861f4d4e70ec9"),
    //     id: "93bb02e457ed5f2c4d2368985fe3c342",
    //     seq: [["majestic_animations", "crossbounce", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "crossbounce",
    //   },
    //   {
    //     name: ("anim.b46c6b5469ef0f0aaa1cea64bc96f48f"),
    //     id: "320b8e3caa3550b437fefffac9ab3b67",
    //     seq: [["majestic_animations", "disco_dance", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "disco_dance",
    //   },
    //   {
    //     name: ("anim.9b02c784cf6a401630a2f6969330eb05"),
    //     id: "648502b4c373230cb711093466d25d46",
    //     seq: [["majestic_animations", "dont_start_now", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "dont_start_now",
    //   },
    //   {
    //     name: ("anim.3efd58310cb3996b71b9c9c091cc8006"),
    //     id: "a08bae70066db6fbb82f395ed61ffe18",
    //     seq: [["majestic_animations", "floss_dance", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "floss_dance",
    //   },
    //   {
    //     name: ("anim.51cb0ba8052d3c3d0d620b18e9e68b96"),
    //     id: "8bad76577aebd9220428e988f4cf98f1",
    //     seq: [["majestic_animations", "fresh", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "fresh",
    //   },
    //   {
    //     name: ("anim.e75594d7d8ba1f9eafa05e7a2d19ca0e"),
    //     id: "3ae5b57530534629aa0e7e6be1b854aa",
    //     seq: [["majestic_animations", "gangnam_style", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "gangnam_style",
    //   },
    //   {
    //     name: ("anim.8cca0b76c3e6798ef861ee80a5f2f020"),
    //     id: "102d7b572893e273f840fed77f5f0597",
    //     seq: [["majestic_animations", "i_heart_you", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "i_heart_you",
    //   },
    //   {
    //     name: ("anim.af68c34cbf5c81332962b82a461b15df"),
    //     id: "3c161cbb4aeb8bfb84cb0e5107fbffa9",
    //     seq: [["majestic_animations", "jabba_switchway", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "jabba_switchway",
    //   },
    //   {
    //     name: ("anim.db4c2ab4b4e2b9d22f9e4a68372346ea"),
    //     id: "989d0ab5e39f1ec7672aa27e94809eac",
    //     seq: [["majestic_animations", "macarena", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "macarena",
    //   },
    //   {
    //     name: ("anim.f32cc66d85977ef66bfb957b4c642cc1"),
    //     id: "5426cb2665f0171180819b8bd195a135",
    //     seq: [["majestic_animations", "last_forever", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "last_forever",
    //   },
    //   {
    //     name: ("anim.2b829a245340dd17473a224b3ed3ec6f"),
    //     id: "ebfe4332cd5771707739339d609977c5",
    //     seq: [["majestic_animations", "ridethepony_v2", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "ridethepony_v2",
    //   },
    //   {
    //     name: ("anim.393d22f967c04f3cf798da179745cacb"),
    //     id: "5a6fb937e669c68c9bc1e318a9f55f76",
    //     seq: [["majestic_animations", "rollie", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "rollie",
    //   },
    //   {
    //     name: ("anim.ee52eb6de17605181ba6ad7be1c81cde"),
    //     id: "1068dd77762f578925feaa19dcfa93a5",
    //     seq: [["majestic_animations", "say_so", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "say_so",
    //   },
    //   {
    //     name: ("anim.3f86e8f84e19bc3286c2956744955078"),
    //     id: "447b2a9ad29c13c281aaeed44b8e3269",
    //     seq: [["majestic_animations", "shuffle2", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "shuffle2",
    //   },
    //   {
    //     name: ("anim.4bf475462b98ab91d5e1f4833e5eda68"),
    //     id: "c1b3bc1db66c5476ad684ed018c479b8",
    //     seq: [["majestic_animations", "squat_kick", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "squat_kick",
    //   },
    //   {
    //     name: ("anim.29db2eda1efeb3af7e6688ccef71ec05"),
    //     id: "0636f5ab7cbc29898448c52d51627ed0",
    //     seq: [["majestic_animations", "step_it_up", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "step_it_up",
    //   },
    //   {
    //     name: ("anim.948f10c52a609d19c251ecfea8c02685"),
    //     id: "0c76ddaffd0521a82180b2452de6dd9b",
    //     seq: [["majestic_animations", "the_flow", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "the_flow",
    //   },
    //   {
    //     name: ("anim.8acdffc5793c72d2e11577f3ab3f6d9f"),
    //     id: "ea510c108b6349e7e7b34c454f09372b",
    //     seq: [["majestic_animations_2", "renegade", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "renegade",
    //   },
    //   {
    //     name: ("anim.90665da0c14c5a7901d7b6ed14b93fce"),
    //     id: "4d676ed00bad8170268087082d7a1023",
    //     seq: [["majestic_animations_2", "stuck", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "stuck",
    //   },
    //   {
    //     name: ("anim.79e8c716f062f13f772f4e647efbd49c"),
    //     id: "518b291a87edbecafa6cd0d8a554a1f9",
    //     seq: [["majestic_animations_2", "pump_up", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "pump_up",
    //   },
    //   {
    //     name: ("anim.ce55b8590741f6f22de6838ed5042bad"),
    //     id: "e93e100cfb09b773758c4b1b0694d002",
    //     seq: [["majestic_animations_2", "socks", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "socks",
    //   },
    //   {
    //     name: ("anim.1b7a38876892ae17bbd984114b44ddca"),
    //     id: "e70765991a08d2650fed24905c01b3a8",
    //     seq: [["majestic_animations_2", "my_world", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "my_world",
    //   },
    //   {
    //     name: ("anim.69fb521ad5862058dc0da94f1c25a846"),
    //     id: "5648fd3e191582fc9d065647d8df9dcf",
    //     seq: [["majestic_animations_2", "wake_up", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "wake_up",
    //   },
    //   {
    //     name: ("anim.6615815fce4ff341039c0d35e6bd4c93"),
    //     id: "3b958ac31872754a89dd1ef68e72c582",
    //     seq: [["majestic_animations_2", "onda", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "onda",
    //   },
    //   {
    //     name: ("anim.f7ac164a03edd545fd3bdda811b91939"),
    //     id: "a5f91651b72c6213d98ac8677edb985d",
    //     seq: [["majestic_animations_2", "gridy", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "gridy",
    //   },
    //   {
    //     name: ("anim.330b5eb4ea3220c1d687b462fb01ad29"),
    //     id: "63e0a22691a49e4704f03341b1d72b7f",
    //     seq: [["majestic_animations_2", "hit_it", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "hit_it",
    //   },
    //   {
    //     name: ("anim.9d57bd91e1ffba04b0208a2a204f3a07"),
    //     id: "a407f9143341bc742671585cdf8ef6d3",
    //     seq: [["majestic_animations_2", "leave_door_open", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "leave_door_open",
    //   },
    //   {
    //     name: ("anim.799e4b007c0f3884e7d0f92047abad5c"),
    //     id: "e394f62674019425beddc544b14cc7cb",
    //     seq: [["majestic_animations_2", "chicken_wing", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "chicken_wing",
    //   },
    //   {
    //     name: ("anim.d75bf2b4c37034d92930e6d3e1bf1df1"),
    //     id: "610231a35b1fedbb58aaed1616a6eeaf",
    //     seq: [["majestic_animations_2", "savage", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "savage",
    //   },
    //   {
    //     name: ("anim.b81d4955fae82cdb1c42882e4a25f54f"),
    //     id: "44e0717e311e7067b823b4349e5b04b4",
    //     seq: [["majestic_animations_2", "electro_swing", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "electro_swing",
    //   },
    //   {
    //     name: ("anim.8ebe3868d8e23ef79cddd5da6a98750c"),
    //     id: "43f684f30dd76f1c9a8c8b4203a5e374",
    //     seq: [["majestic_animations_2", "sprinkler", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "sprinkler",
    //   },
    //   {
    //     name: ("anim.48d8e644032c04373e280ac18c50e627"),
    //     id: "1e6e9e1644388e73e456284625fe43d4",
    //     seq: [["majestic_animations_3", "smeeze", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "smeeze",
    //   },
    //   {
    //     name: ("anim.3a799c872db0a3e271a0a54a75d5bff9"),
    //     id: "53d44c080f93cf9a3742de77ffa6d640",
    //     seq: [["majestic_animations_3", "mufasa", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "mufasa",
    //   },
    //   {
    //     name: ("anim.857e3f79d0f4a97bddd5fc31eb2a6151"),
    //     id: "694076e7551fa595baf8ebe4e3e5f9a3",
    //     seq: [["majestic_animations_3", "hey_now", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "hey_now",
    //   },
    //   {
    //     name: ("anim.119541f9c1141a13bc8643fc881d7ab4"),
    //     id: "b86dcf7296da01e0509fc8653f36d522",
    //     seq: [["majestic_animations_3", "build_up", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "build_up",
    //   },
    //   {
    //     name: ("anim.64c7f860d05a11427b00e4f2600198ef"),
    //     id: "ec82a3dbef2360216efe64b8f007d810",
    //     seq: [["majestic_animations_3", "take_the_l", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "take_the_l",
    //   },
    //   {
    //     name: ("anim.4de62f038061745212298df3a592621f"),
    //     id: "675354c817c7670cb8374e8fe4d0bb34",
    //     seq: [["majestic_animations", "hip_hop", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "hip_hop",
    //   },
    //   {
    //     name: ("anim.3603445b30ae77d7f843683f60ff9d0c"),
    //     id: "e3ba9c72b7ddfc45699e0a29440f02b4",
    //     seq: [["majestic_animations_3", "i_aint_afraid", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "i_aint_afraid",
    //   },
    //   {
    //     name: ("anim.fdf05ba0dd0a83a93c7cfb84bc7796a5"),
    //     id: "55fe75b6910d214cd18c677f13d41852",
    //     seq: [["majestic_animations_3", "get_gone", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "get_gone",
    //   },
    //   {
    //     name: ("anim.8fae96d90771fad32c14afe678aea24d"),
    //     id: "914226e9aa376fa2d358e2fe5c9e016f",
    //     seq: [["majestic_animations_3", "maximum_bounce", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "maximum_bounce",
    //   },
    //   {
    //     name: ("anim.d19906d01845c86377bb3de3b38a8c77"),
    //     id: "3976a6fd3cc9cc157cb442e538316f25",
    //     seq: [["majestic_animations_3", "like_to_move", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "like_to_move",
    //   },
    //   {
    //     name: ("anim.d8b0f3ca18f6f9f88b40eae63c4c1f49"),
    //     id: "4d62df8257381640cf8fcdf153dfb71f",
    //     seq: [["majestic_animations_3", "leilt_elomr", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "leilt_elomr",
    //   },
    //   {
    //     name: ("anim.44974329f178e7ba7e8f7de89c283df5"),
    //     id: "fa6b2cb30fb875838b7ecd19f5a453be",
    //     seq: [["majestic_animations_3", "tidy", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "tidy",
    //   },
    //   {
    //     name: ("anim.fe96c6267a8d329d49ea36787c41c279"),
    //     id: "a5de7015d13b005ba332bff78ee0ddaa",
    //     seq: [["majestic_animations_3", "bhangra_boogie", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "bhangra_boogie",
    //   },
    //   {
    //     name: ("anim.5215f309c02204f56a86bf89bc55b5bb"),
    //     id: "6e333e78426b6960f993646e300d0b40",
    //     seq: [["majestic_animations_3", "out_west", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "out_west",
    //   },
    //   {
    //     name: ("anim.60a99af9328662810bcca62c79616d57"),
    //     id: "72496b7e70979f0ad9a5173ba21c2a0f",
    //     seq: [["majestic_animations_3", "toosie_slide", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "toosie_slide",
    //   },
    //   {
    //     name: ("anim.4106d94ce9583eff83592b661660642b"),
    //     id: "c09a034b1b7f7f6a4fffb98349d758c7",
    //     seq: [["majestic_animations_3", "pull_up", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "pull_up",
    //   },
    //   {
    //     name: ("anim.51d21d0e612eedd3bd860cabf04dae76"),
    //     id: "4c6f9a471b5ca053a6c4d4bebb96dc4f",
    //     seq: [["majestic_animations_3", "the_crane_kick", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "the_crane_kick",
    //   },
    //   {
    //     name: ("anim.7526434b3ecc4c902a53f2a1fa426ae1"),
    //     id: "350a81ff7f2c39c5c596db945c04b95c",
    //     seq: [["majestic_animations_3", "billy_bounce", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "billy_bounce",
    //   },
    //   {
    //     name: ("anim.d750c0c08c803de55b1685e57171ffaa"),
    //     id: "4413989713b2d3ef7efcc48d73b5f636",
    //     seq: [["majestic_animations_3", "electro_shuffle", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "electro_shuffle",
    //   },
    //   {
    //     name: ("anim.eda6527f07f9a5fa015026f264c1e25e"),
    //     id: "2b639c0894ea0aa3e5b937a0691e46d3",
    //     seq: [["majestic_animations_4", "work_it_out", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "work_it_out",
    //   },
    //   {
    //     name: ("anim.68c0ed3eefb7d4cbe60e6e2967acd47f"),
    //     id: "3ee837564a5a9f422d970b1cc54d18dd",
    //     seq: [["majestic_animations_2", "zany", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "zany",
    //   },
    //   {
    //     name: ("anim.0e6677d85cf1a4e47d0973d9b48037be"),
    //     id: "938703e420751bba0097a7c57c2078ef",
    //     seq: [["majestic_animations_3", "smooth_moves", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "smooth_moves",
    //   },
    //   {
    //     name: ("anim.9dc9452bfeb1dcc7d5f673d9e1de916a"),
    //     id: "9d7a2946611d964a6cdb3bc6ebe85348",
    //     seq: [["majestic_animations_4", "vivacious", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "vivacious",
    //   },
    //   {
    //     name: ("anim.c49d603bc9c52c169796b22687577531"),
    //     id: "9f048e5d50eece3757f3a603b33d1b2c",
    //     seq: [["majestic_animations_4", "hula", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "hula",
    //   },
    //   {
    //     name: ("anim.a12adca38e8b68a84e7d4f5af74b55e0"),
    //     id: "3969a71cdffd80d082acf5e704869c40",
    //     seq: [["majestic_animations_4", "true_heart", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "true_heart",
    //   },
    //   {
    //     name: ("anim.0f9d71e17222902292bcfae20f26de05"),
    //     id: "cea51ad9ad859ac2dd41bb7623c59b61",
    //     seq: [["majestic_animations_4", "reanimated", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "reanimated",
    //   },
    //   {
    //     name: ("anim.128eb4a68d40726cfd777535abdaf165"),
    //     id: "81d4d1d4caf1dbfec4e4da201b49a517",
    //     seq: [["majestic_animations_4", "in_da_party", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "in_da_party",
    //   },
    //   {
    //     name: ("anim.04249289b1ff33d9aa436bae88b40928"),
    //     id: "aac62d71ca5e27bd9555ae41819799d5",
    //     seq: [["majestic_animations_4", "bim_bam_boom", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "bim_bam_boom",
    //   },
    //   {
    //     name: ("anim.ae661fce104e6f02edbad5bd7a5c2f25"),
    //     id: "fb2bc68beb3ca81714cc9be18b59bcfe",
    //     seq: [["majestic_animations_4", "wanna_see_me", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "wanna_see_me",
    //   },
    //   {
    //     name: ("anim.f0b1f9f184305420d81cfe955c86dde6"),
    //     id: "85f7fcbc4e5c5b41d0da7ae7611d30c1",
    //     seq: [["majestic_animations_4", "dynamic_shuffle", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "dynamic_shuffle",
    //   },
    //   {
    //     name: ("anim.1bc77d965b798060dd32f39a37e7e418"),
    //     id: "40724511f59d0dbb9a4e56d4412fcf1c",
    //     seq: [["majestic_animations_4", "never_gonna", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "never_gonna",
    //   },
    //   {
    //     name: ("anim.edb6c36a1de1e3d6e4f4f06a6d2b55f5"),
    //     id: "d2875f82340491756ad6e7b40131b058",
    //     seq: [["majestic_animations_4", "fright_funk", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "fright_funk",
    //   },
    //   {
    //     name: ("anim.6d6a4f4fb458c3b45cd566ee4c8671ed"),
    //     id: "607ff1a2d4a84e5212a1ea9268f99f4a",
    //     seq: [["majestic_animations_4", "jitterbug", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "jitterbug",
    //   },
    //   {
    //     name: ("anim.58831b8876003a359934962334b92d64"),
    //     id: "9f9f83c561c7a6a9bf08cec0460a8c82",
    //     seq: [["majestic_animations_4", "infectious", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "infectious",
    //   },
    //   {
    //     name: ("anim.05d261df1694e95488d37e230996b0ff"),
    //     id: "19673b8be388cb3454287e988792ee56",
    //     seq: [["majestic_animations_4", "where_is_matt", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "where_is_matt",
    //   },
    //   {
    //     name: ("anim.3f6f32376254dcfbafadbedbc11c1b44"),
    //     id: "f68128425f44ef9f9be0d59cf6e9427b",
    //     seq: [["majestic_animations_4", "savor_the_w", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "savor_the_w",
    //   },
    //   {
    //     name: ("anim.63e6ece84c32a5c59b9772ac08820e86"),
    //     id: "dd20e162308009dfa421fad873642764",
    //     seq: [["majestic_animations_5", "dance_therapy", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "dance_therapy",
    //   },
    //   {
    //     name: ("anim.ec92b0b5d1641e96f96072bd3b6dcf73"),
    //     id: "bd31bea08f626f54ef75966b5e110e73",
    //     seq: [["majestic_animations_5", "intensity", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "intensity",
    //   },
    //   {
    //     name: ("anim.29ca080b61c997ef047f3b25cb869917"),
    //     id: "8ed7149101a68c6eb59dc5fa09c57f2c",
    //     seq: [["majestic_animations_5", "rushin_around", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "rushin_around",
    //   },
    //   {
    //     name: ("anim.926c0aa925526b2926f69ddffab01b85"),
    //     id: "58540ed2e40ffe1230a66f6590a6e5d2",
    //     seq: [["majestic_animations_5", "advanced_math", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "advanced_math",
    //   },
    //   {
    //     name: ("anim.e43a9d47bf778e891f56daf58f7be2b4"),
    //     id: "b6fb363e2236e283e423f3fd35bf4433",
    //     seq: [["majestic_animations_5", "bold_stance", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "bold_stance",
    //   },
    //   {
    //     name: ("anim.6c03fa612c2c0949366f53dde60ee472"),
    //     id: "c46a9968e99111812cb758c14c106c17",
    //     seq: [["majestic_animations_5", "freemix", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "freemix",
    //   },
    //   {
    //     name: ("anim.32b7d811f78f95db8c4c7fb60f478014"),
    //     id: "1105f332165b87a78d2a7f84477097db",
    //     seq: [["majestic_animations_5", "extraterrestrial", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "extraterrestrial",
    //   },
    //   {
    //     name: ("anim.b4d7067cf708003a00734cf2d22bedba"),
    //     id: "5e3f26e765b12b2a4332562feefe6086",
    //     seq: [["majestic_animations_5", "crabby", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "crabby",
    //   },
    //   {
    //     name: ("anim.a7035b24011cd6c98e785d799347428d"),
    //     id: "76aa1752ba7d006df37eecca0b14a9c6",
    //     seq: [["majestic_animations_5", "lavish", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "lavish",
    //   },
    //   {
    //     name: ("anim.cc654f2bf2c113b9abfe8f82164946de"),
    //     id: "e44856af97f7bf0bfae44c60c4538db4",
    //     seq: [["majestic_animations_5", "mime_time", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "mime_time",
    //   },
    //   {
    //     name: ("anim.4ed42bc3c6eae6242a22244d8c8f6cfa"),
    //     id: "139a08c17968c4911885d24be8b20099",
    //     seq: [["majestic_animations_5", "tai_chi", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "tai_chi",
    //   },
    //   {
    //     name: ("anim.6c1f273beaa2f5cec9b76879445ae403"),
    //     id: "431a6c576097cfe6beae2b81d7856e88",
    //     seq: [["majestic_animations_props", "hydraulics_player", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "hydraulics_player",
    //     prop: [
    //       {
    //         name: ("hydraulics_vehicle"),
    //         anim: ["majestic_animations_props", "hydraulics_vehicle"],
    //         attach: {
    //           bone: 0,
    //           offsetPos: { x: 0, y: 0, z: 0 },
    //           offsetRot: { x: 0, y: 0, z: 0 },
    //         },
    //       },
    //     ],
    //   },
    //   {
    //     name: ("anim.fa63e973e304d8a1be6d64af068e26be"),
    //     id: "8084250f0bf35d3ae0e64933658b04f4",
    //     seq: [["majestic_animations_5", "daydream", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "daydream",
    //   },
    //   {
    //     name: ("anim.5dd33587ff8371d05d10f577e845ae89"),
    //     id: "f4e62e4a6b38bbaef6fd560b16a19394",
    //     seq: [["majestic_animations_5", "work_it", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "work_it",
    //   },
    //   {
    //     name: ("anim.d8a274e63d881aceb05ce08fc1e43d0e"),
    //     id: "5ac96f808fa6e92a72fe87c7a7193976",
    //     seq: [["majestic_animations_5", "slick", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "slick",
    //   },
    //   {
    //     name: ("anim.890247f1255d8c71e4ae037c6396f4cd"),
    //     id: "f3088ccee14838d5c516852d1c667b38",
    //     seq: [["majestic_animations_5", "bombastic", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "bombastic",
    //   },
    //   {
    //     name: ("anim.d470b801302c5c07ca0c1522a30def60"),
    //     id: "04ca4611343088e851fd824b75a74a3e",
    //     seq: [["majestic_animations_5", "its_a_vibe", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "its_a_vibe",
    //   },
    //   {
    //     name: ("anim.7cacfe4431e7827551c2fc6de8040cca"),
    //     id: "3574dfecf5f9792bbc86364094ec34c8",
    //     seq: [["majestic_animations_5", "wutang_is_forever", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "wutang_is_forever",
    //   },
    //   {
    //     name: ("anim.c7186e7a2753496fe32647900ba39d93"),
    //     id: "36a4f368a62bc9f2c1dacc58e7b7c20a",
    //     seq: [["majestic_animations_5", "rootin_tootin", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "rootin_tootin",
    //   },
    //   {
    //     name: ("anim.55e3580f4d6facc2c6760d0afcd09dbc"),
    //     id: "b009aae55d8698f5bf9a3c617a177644",
    //     seq: [["majestic_animations_5", "triumphant", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "triumphant",
    //   },
    //   {
    //     name: ("anim.50379b87b1d73044881ae3e0e82e281c"),
    //     id: "27d39175326ca6ddcd472976a166a06c",
    //     seq: [["majestic_animations_props", "alfredo_player", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "alfredo_player",
    //     prop: [
    //       {
    //         name: ("alfredo_gadget"),
    //         anim: ["majestic_animations_props", "alfredo_gadget"],
    //         attach: {
    //           bone: 0,
    //           offsetPos: { x: 0, y: 0, z: 0 },
    //           offsetRot: { x: 0, y: 0, z: 0 },
    //         },
    //       },
    //     ],
    //   },
    //   {
    //     name: ("anim.ab50ba4beb3f5ceea77581b64e2283e1"),
    //     id: "43864b01e865240f05fb5a2203b7801a",
    //     seq: [["majestic_animations_props", "layers_player", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "layers_player",
    //     prop: [
    //       {
    //         name: ("layers_gadget"),
    //         anim: ["majestic_animations_props", "layers_gadget_left"],
    //         attach: {
    //           bone: 18905,
    //           offsetPos: { x: 0, y: 0, z: 0 },
    //           offsetRot: { x: 0, y: 0, z: 0 },
    //         },
    //       },
    //       {
    //         name: ("layers_gadget"),
    //         anim: ["majestic_animations_props", "layers_gadget_right"],
    //         attach: {
    //           bone: 57005,
    //           offsetPos: { x: 0, y: 0, z: 0 },
    //           offsetRot: { x: 0, y: 0, z: 0 },
    //         },
    //       },
    //     ],
    //   },
    //   {
    //     name: ("anim.57f000fe1b011555c70cfd26ab4f4ba9"),
    //     id: "009ce6d81b6b6c0aa1f0a85183cea94c",
    //     seq: [["majestic_animations_props", "epic_sax", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "epic_sax",
    //     prop: [
    //       {
    //         name: ("epic_sax"),
    //         attach: {
    //           bone: 18905,
    //           offsetPos: { x: 0, y: 0, z: 0 },
    //           offsetRot: { x: 0, y: 0, z: 0 },
    //         },
    //       },
    //     ],
    //   },
    //   {
    //     name: ("anim.d862e120a0c7ba58adbfc6b6df2cd16d"),
    //     id: "e300c45442caea10469e2bc4c3eb1db1",
    //     seq: [["majestic_animations_props", "llama_cowbell", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "llama_cowbell",
    //     prop: [
    //       {
    //         name: ("llama_cowbell"),
    //         attach: {
    //           bone: 18905,
    //           offsetPos: { x: 0, y: 0, z: 0 },
    //           offsetRot: { x: 0, y: 0, z: 0 },
    //         },
    //       },
    //       {
    //         name: ("llama_stick"),
    //         attach: {
    //           bone: 57005,
    //           offsetPos: { x: 0, y: 0, z: 0 },
    //           offsetRot: { x: 0, y: 0, z: 0 },
    //         },
    //       },
    //     ],
    //   },
    //   {
    //     name: ("anim.c6a0b6b35b8c4d8fc4d27432bdeaae6e"),
    //     id: "a97fc926527ad7011e2950ec32928738",
    //     seq: [["majestic_animations_props", "majestic_flipped", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "majestic_flipped",
    //     prop: [
    //       {
    //         name: ("majestic_coin"),
    //         anim: ["majestic_animations_props", "majestic_coin"],
    //         attach: {
    //           bone: 57005,
    //           offsetPos: { x: 0, y: 0, z: 0 },
    //           offsetRot: { x: 0, y: 0, z: 0 },
    //         },
    //       },
    //     ],
    //   },
    //   {
    //     name: ("anim.f7a6a64f3b0c13df64fb095b978df372"),
    //     id: "0c9ffeaa4634340dd725f32e6776d9be",
    //     seq: [["majestic_animations_props", "llama_float_player", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "llama_float_player",
    //     prop: [
    //       {
    //         name: ("llama_float"),
    //         anim: ["majestic_animations_props", "llama_float"],
    //         attach: {
    //           bone: 0,
    //           offsetPos: { x: 0, y: 0, z: 0 },
    //           offsetRot: { x: 0, y: 0, z: 0 },
    //         },
    //       },
    //     ],
    //   },
    //   {
    //     name: ("anim.270123000710b1b460ba70aee3c9929e"),
    //     id: "73b20eb7ff1e5a570cda4c9fa875eb22",
    //     seq: [["majestic_animations_props", "glowstick_dance", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "glowstick_dance",
    //     prop: [
    //       {
    //         name: ("glowstick_prop"),
    //         attach: {
    //           bone: 6286,
    //           offsetPos: { x: 0, y: 0, z: 0 },
    //           offsetRot: { x: 0, y: 0, z: 0 },
    //         },
    //       },
    //       {
    //         name: ("glowstick_prop"),
    //         attach: {
    //           bone: 36029,
    //           offsetPos: { x: 0, y: 0, z: 0 },
    //           offsetRot: { x: 0, y: 0, z: 0 },
    //         },
    //       },
    //     ],
    //   },
    //   {
    //     name: ("anim.57bb9eaa82630fb92cb8475549ba474d"),
    //     id: "d8a1161152f29d0452ca5483fa87f6a3",
    //     seq: [["majestic_animations_props", "shake_dance", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "shake_dance",
    //     prop: [
    //       {
    //         name: ("shake_prop"),
    //         attach: {
    //           bone: 6286,
    //           offsetPos: { x: 0, y: 0, z: 0 },
    //           offsetRot: { x: 0, y: 0, z: 0 },
    //         },
    //       },
    //       {
    //         name: ("shake_prop"),
    //         attach: {
    //           bone: 36029,
    //           offsetPos: { x: 0, y: 0, z: 0 },
    //           offsetRot: { x: 0, y: 0, z: 0 },
    //         },
    //       },
    //     ],
    //   },
    //   {
    //     name: ("anim.c2fafe1fcd8618c3ef1187bf8dd73ab6"),
    //     id: "d8bfa57d0b7fa7882d527d5664822df7",
    //     seq: [["majestic_animations_props", "ukulele_dance", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "ukulele_dance",
    //     prop: [
    //       {
    //         name: ("ukulele_prop"),
    //         attach: {
    //           bone: 36029,
    //           offsetPos: { x: 0, y: 0, z: 0 },
    //           offsetRot: { x: 0, y: 0, z: 0 },
    //         },
    //       },
    //     ],
    //   },
    //   {
    //     name: ("anim.f106a0c96605ed106f20180abf6d90dd"),
    //     id: "5c50016f80e0cf17ad45c6d25a6b0554",
    //     seq: [["majestic_animations_props", "snare_solo_player", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "snare_solo_player",
    //     prop: [
    //       {
    //         name: ("snare_solo"),
    //         anim: ["majestic_animations_props", "snare_solo"],
    //         attach: {
    //           bone: 0,
    //           offsetPos: { x: 0, y: 0, z: 0 },
    //           offsetRot: { x: 0, y: 0, z: 0 },
    //         },
    //       },
    //     ],
    //   },
    //   {
    //     name: ("anim.413f96c201c38a4868093e3292897b2c"),
    //     id: "96d21a088a9fc2076879c432f0a5bf03",
    //     seq: [["majestic_animations_props", "rock_out_player", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "rock_out_player",
    //     prop: [
    //       {
    //         name: ("guitar_walk"),
    //         anim: ["majestic_animations_props", "rock_out"],
    //         attach: {
    //           bone: 18905,
    //           offsetPos: { x: 0, y: 0, z: 0 },
    //           offsetRot: { x: 0, y: 0, z: 0 },
    //         },
    //       },
    //     ],
    //   },
    //   {
    //     name: ("anim.e1085a4c40f8fcc46417079244626731"),
    //     id: "bd2fd48c4b50813b15c109b2022e14ff",
    //     seq: [["majestic_animations_props", "rhyme_lock_player", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "rhyme_lock_player",
    //     prop: [
    //       {
    //         name: ("rhyme_lock"),
    //         anim: ["majestic_animations_props", "rhyme_lock"],
    //         attach: {
    //           bone: 0,
    //           offsetPos: { x: 0, y: 0, z: 0 },
    //           offsetRot: { x: 0, y: 0, z: 0 },
    //         },
    //       },
    //     ],
    //   },
    //   {
    //     name: ("anim.73143895dc4f62269f77e56f047c79ec"),
    //     id: "ba0a35239f4560b6b11001a269828f3f",
    //     seq: [["majestic_animations_props", "unicycle_gadget_player", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "unicycle_gadget_player",
    //     prop: [
    //       {
    //         name: ("unicycle_gadget"),
    //         anim: ["majestic_animations_props", "unicycle_gadget"],
    //         attach: {
    //           bone: 0,
    //           offsetPos: { x: 0, y: 0, z: 0 },
    //           offsetRot: { x: 0, y: 0, z: 0 },
    //         },
    //       },
    //     ],
    //   },
    //   {
    //     name: ("anim.1935dca644724d2cf1a6f36305faeb75"),
    //     id: "f331f54509ad8b2ea34b7037ebc929d8",
    //     seq: [["majestic_animations_props", "banner_flag_player", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "banner_flag_player",
    //     prop: [
    //       {
    //         name: ("banner_flag_prop"),
    //         attach: {
    //           bone: 36029,
    //           offsetPos: { x: 0, y: 0, z: 0 },
    //           offsetRot: { x: 0, y: 0, z: 0 },
    //         },
    //       },
    //       {
    //         name: ("prop_flag_majestic"),
    //         attach: {
    //           bone: 36029,
    //           offsetPos: { x: 0, y: 0, z: 0 },
    //           offsetRot: { x: 0, y: 0, z: 0 },
    //         },
    //       },
    //     ],
    //   },
    //   {
    //     name: ("anim.676e193c0d8d74ac30f02d5494c15b62"),
    //     id: "7a2c546c77172527cc84cc08227ac2ac",
    //     seq: [["majestic_animations_props", "bouquet_hat_player", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "bouquet_hat_player",
    //     prop: [
    //       {
    //         name: ("bouquet_hat"),
    //         anim: ["majestic_animations_props", "bouquet_hat"],
    //         attach: {
    //           bone: 57005,
    //           offsetPos: { x: 0, y: 0, z: 0 },
    //           offsetRot: { x: 0, y: 0, z: 0 },
    //         },
    //       },
    //       {
    //         name: ("bouquet_main"),
    //         anim: ["majestic_animations_props", "bouquet_hat"],
    //         attach: {
    //           bone: 18905,
    //           offsetPos: { x: 0, y: 0, z: 0 },
    //           offsetRot: { x: 0, y: 0, z: 0 },
    //         },
    //       },
    //     ],
    //   },
    //   {
    //     name: ("anim.8de73fc5a4bbc1f95af9ba2056d8493b"),
    //     id: "ee4220be4bbcf42d8c5b39a23762aefd",
    //     seq: [["majestic_animations_props", "car_lifted_player", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "car_lifted_player",
    //     prop: [
    //       {
    //         name: ("car_lifted"),
    //         anim: ["majestic_animations_props", "car_lifted"],
    //         attach: {
    //           bone: 0,
    //           offsetPos: { x: 0, y: 0, z: 0 },
    //           offsetRot: { x: 0, y: 0, z: 0 },
    //         },
    //       },
    //     ],
    //   },
    //   {
    //     name: ("anim.7b7a42bf1e1fdaf5fd4b2fc971ef53ed"),
    //     id: "07dc77ab2c01391a7eda48a538c517bb",
    //     seq: [["majestic_animations_props", "guitar_walk_player", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "guitar_walk_player",
    //     prop: [
    //       {
    //         name: ("guitar_walk"),
    //         anim: ["majestic_animations_props", "car_lifted"],
    //         attach: {
    //           bone: 0,
    //           offsetPos: { x: 0, y: 0, z: 0 },
    //           offsetRot: { x: 0, y: 0, z: 0 },
    //         },
    //       },
    //     ],
    //   },
    //   {
    //     name: ("anim.1668a3d0ff8a18c558c244ff83e3442c"),
    //     id: "9db7f924f0ed8c0e661d593e9e562246",
    //     seq: [["majestic_animations_6", "best_mates", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "best_mates",
    //   },
    //   {
    //     name: ("anim.d9549b3ca6bc6403c8b45d93d4e618c9"),
    //     id: "a674adcd5870759c8992c64e3f3b79ab",
    //     seq: [["majestic_animations_6", "on_your_marks", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "on_your_marks",
    //   },
    //   {
    //     name: ("anim.e38fc43b241e6ece042281f733a5da77"),
    //     id: "140c93745da55b625348cc3040415d4e",
    //     seq: [["majestic_animations_6", "laid_back_shuffle", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "laid_back_shuffle",
    //   },
    //   {
    //     name: ("anim.7321449456a0db44ad722fb0bfcdadb3"),
    //     id: "db9122a5d71e0f8db95b834182571ab2",
    //     seq: [["majestic_animations_6", "pollo_dance", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "pollo_dance",
    //   },
    //   {
    //     name: ("anim.dc4bb72290108361b1736e4620b5e8aa"),
    //     id: "1eb29a3da39f551f055f7e56efc0496b",
    //     seq: [["majestic_animations_6", "scenario", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "scenario",
    //   },
    //   {
    //     name: ("anim.87a921595ebd20a0411e8b630036af9e"),
    //     id: "da1c2013e98baddba5fa0dd70621c64f",
    //     seq: [["majestic_animations_6", "buckle_up", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "buckle_up",
    //   },
    //   {
    //     name: ("anim.b6cee9e1ff6651f316dae2c6c7ebb218"),
    //     id: "b773154eb4ca2c91f035da6da5a2f74b",
    //     seq: [["majestic_animations_6", "its_complicated", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "its_complicated",
    //   },
    //   {
    //     name: ("anim.036da9a437afaabea48d71ca3002c242"),
    //     id: "82d68506eedd8970668897abbd01fbf4",
    //     seq: [["majestic_animations_6", "freedom_wheels", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "freedom_wheels",
    //   },
    //   {
    //     name: ("anim.13dd5d85f091e7e3f50ee8b6cc64c1ca"),
    //     id: "dbdebe6be2767eab4df98b0d735994d1",
    //     seq: [["majestic_animations_6", "everybody_loves_me", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "everybody_loves_me",
    //   },
    //   {
    //     name: ("anim.cbd7d9c9225395679f9311e3ec87526a"),
    //     id: "38cd85b4fb15fcb8f36355f640c6374c",
    //     seq: [["majestic_animations_6", "pirouette", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "pirouette",
    //   },
    //   {
    //     name: ("anim.3d5282c57f00cde783b9fa3ffc0ca020"),
    //     id: "518a84a567451c11d302895c40b2d276",
    //     seq: [["majestic_animations_6", "lazer_blast", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "lazer_blast",
    //   },
    //   {
    //     name: ("anim.b306d10bd5502c8347a170cce2917ffb"),
    //     id: "436a1b88c7c309f5e03cd260e562f14d",
    //     seq: [["majestic_animations_6", "poki", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "poki",
    //   },
    //   {
    //     name: ("anim.7305e398bf299817e2266434e123e2bc"),
    //     id: "ecf9d2ee681d3c5e61b30b2e695a464d",
    //     seq: [["majestic_animations_6", "leapin", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "leapin",
    //   },
    //   {
    //     name: ("anim.08df9c7466f99ac8f465dfac750d0362"),
    //     id: "192770ec1346548dd36f2ffbb1a67ff9",
    //     seq: [["majestic_animations_6", "well_rounded", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "well_rounded",
    //   },
    //   {
    //     name: ("anim.72cd93d22e16e8cda684dc53d5db925e"),
    //     id: "a48242a9162b61dbc05418a9b9cf00fa",
    //     seq: [["majestic_animations_6", "flux", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "flux",
    //   },
    //   {
    //     name: ("anim.9b94428c7a0c2a7083b5bbcb1bb093f4"),
    //     id: "4c5429c9db17982b4f7fc42d637a6794",
    //     seq: [["majestic_animations_6", "whirlwind", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "whirlwind",
    //   },
    //   {
    //     name: ("anim.11d2490478efd507d9fc8b9daee625a3"),
    //     id: "18a61326602394b1183b1dd87385046e",
    //     seq: [["majestic_animations_6", "jamboree", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "jamboree",
    //   },
    //   {
    //     name: ("anim.86a74aff76f73d8a37d1480914804d36"),
    //     id: "c9cc5f261f9c9b5bf4fe0051b3c5f84b",
    //     seq: [["majestic_animations_6", "slap_happy", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "slap_happy",
    //   },
    //   {
    //     name: ("anim.ca90f3499650ac9b61db862195cd7dd8"),
    //     id: "76ed169eaf0101f77240bcd61e948bca",
    //     seq: [["majestic_animations_6", "dream_feet", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "dream_feet",
    //   },
    //   {
    //     name: ("anim.a2874f835d0fe49798dcff3f0eb47385"),
    //     id: "46cc70a492d14eb15b2b1b83e3eb80a6",
    //     seq: [["majestic_animations_6", "switchstep", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "switchstep",
    //   },
    //   {
    //     name: ("anim.6d88935f1d746fa4984781953b5c6a5b"),
    //     id: "f0a18e54b1e4e6eb3dd5de951969e850",
    //     seq: [["majestic_animations_6", "glitter", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "glitter",
    //   },
    //   {
    //     name: ("anim.11a739c845e7fc34b160cd3b67eff9ad"),
    //     id: "70f2a9427cfef73d828ceef3ada9af33",
    //     seq: [["majestic_animations_6", "sugar_rush", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "sugar_rush",
    //   },
    //   {
    //     name: ("anim.f7b1d95deb8ae468e051c9744bb2e68d"),
    //     id: "5c2b4d3edb405a4e3e48c441cb802eea",
    //     seq: [["majestic_animations_6", "twist", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "twist",
    //   },
    //   {
    //     name: ("anim.3132b15fd36595cfa0880d6d884ced52"),
    //     id: "e162f61bac16c5bbcf5b09199c44abaf",
    //     seq: [["majestic_animations_6", "howl", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "howl",
    //   },
    //   {
    //     name: ("anim.387b9d90667b8f2835ace954348e83ee"),
    //     id: "c06dcabaeee04d2b4a0f382804218544",
    //     seq: [["majestic_animations_6", "crazy_feet", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "crazy_feet",
    //   },
    //   {
    //     name: ("anim.61dba37b85922628bfd4d47aaee1e506"),
    //     id: "f0a5876031b74c3f8b04ee49330f4abf",
    //     seq: [["majestic_animations_6", "hot_marat", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "hot_marat",
    //   },
    //   {
    //     name: ("anim.9c65d28459f04b66398f263b6fb7397a"),
    //     id: "9c2c98bdbb60d517dea4393e4cde3314",
    //     seq: [["majestic_animations_6", "show_stopper", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "show_stopper",
    //   },
    //   {
    //     name: ("anim.8f11b028fbaabbb185e96fd8a3742e85"),
    //     id: "0c39c1669d61f634f1147bf0579149a1",
    //     seq: [["majestic_animations_6", "boneless", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "boneless",
    //   },
    //   {
    //     name: ("anim.05f09158a97433723c8bc78e43412e48"),
    //     id: "10445e8dc7a880948da74da227181a80",
    //     seq: [["majestic_animations_6", "pop_lock", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "pop_lock",
    //   },
    //   {
    //     name: ("anim.5bf37714c1fce1ea582c3878f3e7d604"),
    //     id: "b26fa78243c0767497c690babaf56e9c",
    //     seq: [["majestic_animations_6", "steady", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "steady",
    //   },
    //   {
    //     name: ("anim.864cfb1272dc1ee26e7afb5a52da9544"),
    //     id: "4efc08c578b2215ecdac202d94b1157b",
    //     seq: [["majestic_animations_6", "shimmer", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "shimmer",
    //   },
    //   {
    //     name: ("anim.dd2c31a8f2b4a20ec583058520efb4c9"),
    //     id: "64c165009d11cdfa069b5e70bf35819e",
    //     seq: [["majestic_animations_6", "springy", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "springy",
    //   },
    //   {
    //     name: ("anim.2c5d956395302968f984a19eb41c60e7"),
    //     id: "66b4da18b8d5945d0c952c689aa58538",
    //     seq: [["majestic_animations_6", "free_flow", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "free_flow",
    //   },
    //   {
    //     name: ("anim.d594df4e5c3120f562b7dd9cd4b55db4"),
    //     id: "a6744bf1f50cdb05ef2439c7cc291a6c",
    //     seq: [["majestic_animations_6", "conga", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "conga",
    //   },
    //   {
    //     name: ("anim.73eaa8676e01b1d1572e20145fcf9e2b"),
    //     id: "97226ced3ab2b8f9ac3e73a8105df091",
    //     seq: [["majestic_animations_6", "deep_end", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "deep_end",
    //   },
    //   {
    //     name: ("anim.29b0b6d849937848e18d4f3561ce7914"),
    //     id: "6bb0d56b4812e92c161fb9ddaa6e6737",
    //     seq: [["majestic_animations_6", "pumpernickel", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "pumpernickel",
    //   },
    //   {
    //     name: ("anim.fe0d6a6ec9c96d7b60ff65207673d0e6"),
    //     id: "d6c28923155e286b6f972c12dd2d9b22",
    //     seq: [["majestic_animations_6", "jubilation", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "jubilation",
    //   },
    //   {
    //     name: ("anim.5cdaec8ee34fe63a3c6fe624e61f397d"),
    //     id: "576d725eebbad01f37017accae0c01d2",
    //     seq: [["majestic_animations_6", "jaywalking", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "jaywalking",
    //   },
    //   {
    //     name: ("anim.d8204f9f75bae476a0ca69006186db96"),
    //     id: "fca5266413148d2925af29cb0c2ac1f4",
    //     seq: [["majestic_animations_6", "peace_out", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "peace_out",
    //   },
    //   {
    //     name: ("anim.9b6b5c84b4b2646a0f4c1ec75dc16a8e"),
    //     id: "dd7d77a3933faa4166834c7f22e7a124",
    //     seq: [["majestic_animations_6", "hype", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "hype",
    //   },
    //   {
    //     name: ("anim.830c5f2706d8568ef951c24e62a2c91d"),
    //     id: "a2fb9806fb6146e8d1e45dc8e1ed63ad",
    //     seq: [["majestic_animations_6", "orange_justice", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "orange_justice",
    //   },
    //   {
    //     name: ("anim.e78ef8ac0185cc2cc08967b2f3820296"),
    //     id: "e31902a5091c6dd150a6eb855f9c120b",
    //     seq: [["majestic_animations_6", "swipe_it", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "swipe_it",
    //   },
    //   {
    //     name: ("anim.c2e38dc1de751d1fb471246634be0826"),
    //     id: "dd5dd583e309b8baa08580025c3973d2",
    //     seq: [["majestic_animations_7", "jump_around", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "jump_around",
    //   },
    //   {
    //     name: ("anim.e97256d06f9c82783abb5d6f92842b6c"),
    //     id: "7364021af94a79f3bad8cd725672da4e",
    //     seq: [["majestic_animations_7", "monster_mash", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "monster_mash",
    //   },
    //   {
    //     name: ("anim.e60af3f75142037d89b0d6eaa61bcee7"),
    //     id: "42cf8d3017193cc8ed74089e6ff8788f",
    //     seq: [["majestic_animations_7", "feel_the_flow", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "feel_the_flow",
    //   },
    //   {
    //     name: ("anim.b4164f15834011684ecba06adfe893c8"),
    //     id: "abda41aed5613fe0e78ecef381a2fbf4",
    //     seq: [["majestic_animations_7", "copines", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "copines",
    //   },
    //   {
    //     name: ("anim.1dfb003c2898bae9b4e3f75be2103780"),
    //     id: "f613e11e9d4d3eeda1517a0a22c3cd78",
    //     seq: [["majestic_animations_7", "jiggle", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "jiggle",
    //   },
    //   {
    //     name: ("anim.de23a1519b108bc2f8ae7bc4c3b85149"),
    //     id: "a94b3bd8d913523c568ee8c8d524ab3e",
    //     seq: [["majestic_animations_7", "forget_me", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "forget_me",
    //   },
    //   {
    //     name: ("anim.2523f6858f89a4b017f178b38f9b3c7b"),
    //     id: "761b3d8d1124b03f7ab3e218b8b71404",
    //     seq: [["majestic_animations_7", "chilled", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "chilled",
    //   },
    //   {
    //     name: ("anim.59f5a7c7d83425503c675b7145b227bc"),
    //     id: "c21d7df4a2e6ede40a47fe071f797394",
    //     seq: [["majestic_animations_7", "distraction", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "distraction",
    //   },
    //   {
    //     name: ("anim.503b6f3e80ae484026d80e143fae4082"),
    //     id: "713844d06095ec787235f7efae16e9a8",
    //     seq: [["majestic_animations_7", "ucan_cme", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "ucan_cme",
    //   },
    //   {
    //     name: ("anim.bafff103d8b33085517e3bc1f764829b"),
    //     id: "d89ffd99a08f3f350ec1624aac6e9269",
    //     seq: [["majestic_animations_props", "taco_time", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "taco_time",
    //     prop: [
    //       {
    //         name: ("prop_taco_01"),
    //         attach: {
    //           bone: 6286,
    //           offsetPos: { x: 0, y: 0, z: 0 },
    //           offsetRot: { x: 0, y: 0, z: 0 },
    //         },
    //       },
    //       {
    //         name: ("prop_taco_01"),
    //         attach: {
    //           bone: 36029,
    //           offsetPos: { x: 0, y: 0, z: 0 },
    //           offsetRot: { x: 0, y: 0, z: 0 },
    //         },
    //       },
    //     ],
    //   },
    //   {
    //     name: ("anim.a84e1ca0a00482ad374b4449b7b0c680"),
    //     id: "4ce31aefd13e18a0cf36446c4dc05d73",
    //     seq: [["majestic_animations_props_2", "snowglobe", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "snowglobe",
    //     prop: [
    //       {
    //         name: ("mj_snowglobe_prop"),
    //         anim: ["majestic_animations_props_2", "snowglobe_prop"],
    //         attach: {
    //           bone: 6286,
    //           offsetPos: { x: 0, y: 0, z: 0 },
    //           offsetRot: { x: 0, y: 0, z: 0 },
    //         },
    //       },
    //       {
    //         name: ("mj_snowflake"),
    //         anim: ["majestic_animations_props_2", "snowflake"],
    //         attach: {
    //           bone: 0,
    //           offsetPos: { x: 0, y: 0, z: 0 },
    //           offsetRot: { x: 0, y: 0, z: 0 },
    //         },
    //       },
    //     ],
    //   },
    //   {
    //     name: ("anim.12e20f38ff548fefa8c95b851c5467bb"),
    //     id: "9b4e98e94011e042bcc33f65c7c4e5da",
    //     seq: [["majestic_animations_props_2", "mj_sleigh_player", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "mj_sleigh_player",
    //     prop: [
    //       {
    //         name: ("mj_sleigh_dlc"),
    //         anim: ["majestic_animations_props_2", "mj_sleigh_dlc"],
    //         attach: {
    //           bone: 6286,
    //           offsetPos: { x: 0, y: 0, z: 0 },
    //           offsetRot: { x: 0, y: 0, z: 0 },
    //         },
    //       },
    //       {
    //         name: ("mj_sleigh"),
    //         anim: ["majestic_animations_props_2", "snowflake"],
    //         attach: {
    //           bone: 0,
    //           offsetPos: { x: 0, y: 0, z: 0 },
    //           offsetRot: { x: 0, y: 0, z: 0 },
    //         },
    //       },
    //     ],
    //   },
    //   {
    //     name: ("anim.68d29606ae42c936f1cc0a6c0f11f232"),
    //     id: "59a932115ada8e27d525c23247e1b3ae",
    //     seq: [["majestic_animations_props_2", "sing_along_player", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "sing_along_player",
    //     prop: [
    //       {
    //         name: ("mj_sleigh_dlc"),
    //         anim: ["majestic_animations_props_2", "mj_sleigh_dlc"],
    //         attach: {
    //           bone: 6286,
    //           offsetPos: { x: 0, y: 0, z: 0 },
    //           offsetRot: { x: 0, y: 0, z: 0 },
    //         },
    //       },
    //       {
    //         name: ("mj_sleigh"),
    //         anim: ["majestic_animations_props_2", "snowflake"],
    //         attach: {
    //           bone: 0,
    //           offsetPos: { x: 0, y: 0, z: 0 },
    //           offsetRot: { x: 0, y: 0, z: 0 },
    //         },
    //       },
    //     ],
    //   },
    //   {
    //     name: ("anim.41534f6baa1779f413926b4fb36c8d11"),
    //     id: "01b6ae1c74b0519730359cd7f8c0f452",
    //     seq: [["majestic_animations_props_2", "unwrapped_player", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "unwrapped_player",
    //     prop: [
    //       {
    //         name: ("mj_unwrapped_prop"),
    //         anim: ["majestic_animations_props_2", "unwrapped_prop"],
    //         attach: {
    //           bone: 0,
    //           offsetPos: { x: 0, y: 0, z: 0 },
    //           offsetRot: { x: 0, y: 0, z: 0 },
    //         },
    //       },
    //     ],
    //   },
    //   {
    //     name: ("anim.dd9ff20d264f7716fc30d950b0d07463"),
    //     id: "09a2a9a8072c6d5d1cc43d05f651a932",
    //     seq: [["majestic_animations_7", "double_up", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "double_up",
    //   },
    //   {
    //     name: ("anim.31833b1206921b576f27b47841ef6ab9"),
    //     id: "cb1a4448a80be4c994158a9db6228964",
    //     seq: [["majestic_animations_7", "sway_1", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "sway_1",
    //   },
    //   {
    //     name: ("anim.7933a5c887576241ed1198573e6ec23b"),
    //     id: "fb3a0f860483a25b8f8f8b4f7b7c3a2f",
    //     seq: [["majestic_animations_7", "its_dynamite", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "its_dynamite",
    //   },
    //   {
    //     name: ("anim.21b8b05a58ba910aab0bfb75fa7c7cdb"),
    //     id: "4c9f57c2c774703d8f9d2cc2828359b4",
    //     seq: [["majestic_animations_props_2", "mayahi_player", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "mayahi_player",
    //     prop: [
    //       {
    //         name: ("mj_mayahi_prop"),
    //         anim: ["majestic_animations_props_2", "mayahi_prop"],
    //         attach: {
    //           bone: 0,
    //           offsetPos: { x: 0, y: 0, z: 0 },
    //           offsetRot: { x: 0, y: 0, z: 0 },
    //         },
    //       },
    //     ],
    //   },
    //   {
    //     name: ("anim.be27f5cad50b2eb14c98a9eb82605729"),
    //     id: "e1a5fb2960da8b309fc17580f301882a",
    //     seq: [["majestic_animations_props_2", "jug", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "jug",
    //   },
    //   {
    //     name: ("anim.3f90aa5879d0eb4ca7c0f9a6d0d6fea3"),
    //     id: "e871649aa99da1829db09f45398f25e0",
    //     seq: [["majestic_animations_props_2", "get_swifty_1", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "get_swifty_1",
    //   },
    //   {
    //     name: ("anim.30d0e81566e639928f65b52aa2c4f456"),
    //     id: "3e2fbf99456eafdb88ebb48822b50fd7",
    //     seq: [["majestic_animations_props_2", "shanty", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "shanty",
    //   },
    //   {
    //     name: ("anim.187b2d681f4fbb476eebfd8b1eb93a35"),
    //     id: "c9f8d78fe5aec869c27d55802fa55917",
    //     seq: [["majestic_animations_props_2", "prancer_player", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "prancer_player",
    //   },
    //   {
    //     name: ("anim.198a0978cc9b6c088b2a085458b00c55"),
    //     id: "50426fbbff23d4c7ccacbce3b9d62e68",
    //     seq: [["majestic_animations_props_2", "slalom_player", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "slalom_player",
    //   },
    //   {
    //     name: ("anim.5a6468540fa00e352f68c3fa92c23c13"),
    //     id: "a791c013ed9c80199f77426d5e9cc9e7",
    //     seq: [["majestic_animations_7", "bounce_wit_it", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "bounce_wit_it",
    //   },
    //   {
    //     name: ("anim.f6abca9e79b38bb454b06045a2d39cd7"),
    //     id: "9775836f014f3f11e1e9bb875dabf739",
    //     seq: [["majestic_animations_7", "dance_monkey", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "dance_monkey",
    //   },
    //   {
    //     name: ("anim.c3db4a6420fe999e551564a60db5dc2e"),
    //     id: "1c27bf6c6a7b9c220cf0f18dba14ae8e",
    //     seq: [["majestic_animations_8", "side_shuffle", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "side_shuffle",
    //   },
    //   {
    //     name: ("anim.3bc9e6df27cbf923c23a8a58c63b4907"),
    //     id: "9558559fef344a3b7c6cd1b49e2e5542",
    //     seq: [["majestic_animations_8", "flapper", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "flapper",
    //   },
    //   {
    //     name: ("anim.cd31f8ecad42d1713dc1ae7e943e8b74"),
    //     id: "2bf77ec6aa4e2df8862556ad6b3159ae",
    //     seq: [["majestic_animations_8", "vibin", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "vibin",
    //   },
    //   {
    //     name: ("anim.55127986a38909bfe8fc5241ffab26ac"),
    //     id: "9e43edbbf5da5f7d3832ba70723ec3a8",
    //     seq: [["majestic_animations_8", "the_robot", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "the_robot",
    //   },
    //   {
    //     name: ("anim.c8d007f8b7fa16d3186875d345e52534"),
    //     id: "d7af66638cde189c2836c5cb97fe2d5a",
    //     seq: [["majestic_animations_8", "groove_jam", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "groove_jam",
    //   },
    //   {
    //     name: ("anim.2f5f0208cd493b8c2f256f594623cb7b"),
    //     id: "5162fbf0ccb058b10150a5c12a990d73",
    //     seq: [["majestic_animations_8", "flamenco", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "flamenco",
    //   },
    //   {
    //     name: ("anim.3fe751824a6a3ad9a57e190de79f90b5"),
    //     id: "32231b19db725ef32081f356abf5be8b",
    //     seq: [["majestic_animations_8", "rick_dance", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "rick_dance",
    //   },
    //   {
    //     name: ("anim.81babc5f6f8343379126fcb9cdf9d129"),
    //     id: "6a4731337a6ebb7ee0f69bbca0301b07",
    //     seq: [["majestic_animations_8", "crackdown", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "crackdown",
    //   },
    //   {
    //     name: ("anim.38bd7116bdd1b18b1a87defe8bf469a5"),
    //     id: "56e1069eff64d38331de22040cfff476",
    //     seq: [["majestic_animations_8", "primo_moves", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "primo_moves",
    //   },
    //   {
    //     name: ("anim.b3647cc539accf76eebea08cac4e4186"),
    //     id: "465b4da3c66ccfedea63700fb5341e52",
    //     seq: [["majestic_animations_8", "balletic", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "balletic",
    //   },
    //   {
    //     name: ("anim.bf68993bfea7f1371c632aa9822820ec"),
    //     id: "5ef5a0a6c154aefb36553e88b19ee4af",
    //     seq: [["majestic_animations_8", "infinite_dab", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "infinite_dab",
    //   },
    //   {
    //     name: ("anim.d4fffad6dedc43f5f939e2491c384709"),
    //     id: "c9aa6cdb0d4973ce7eb0a88ba06d8fd6",
    //     seq: [["majestic_animations_8", "hand_signals", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "hand_signals",
    //   },
    //   {
    //     name: ("anim.2b8e7bdd5a19831499a8628838bfccbf"),
    //     id: "a9aa6bb86c6c70269153c30ec5df4a7b",
    //     seq: [["majestic_animations_8", "fancy_feet", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "fancy_feet",
    //   },
    //   {
    //     name: ("anim.15afb1e86910c6101082b6b0d6b490ad"),
    //     id: "788961b01714fd45947dd5f826b7432d",
    //     seq: [["majestic_animations_8", "clean_groove", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "clean_groove",
    //   },
    //   {
    //     name: ("anim.3687cc088be93aa1c6182c6a67cfe21e"),
    //     id: "4c7cf766817a49a30811801be44ac07a",
    //     seq: [["majestic_animations_8", "old_school", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "old_school",
    //   },
    //   {
    //     name: ("anim.b510b5d5cb0a8dd47e7683e7dbe6a243"),
    //     id: "c40e8f4812be7f0e4b3051ea16938212",
    //     seq: [["majestic_animations_8", "introducing", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "introducing",
    //   },
    //   {
    //     name: ("anim.a675c4a2786c7f373436709952781696"),
    //     id: "b8542209f53c8f98d82a0a6c4a9cb626",
    //     seq: [["majestic_animations_8", "terrestrial", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "terrestrial",
    //   },
    //   {
    //     name: ("anim.af89a7d85b80c4643d7d1cf221aab3fa"),
    //     id: "dfda4ddd2f75eea585bf1ceafa61b247",
    //     seq: [["majestic_animations_8", "youre_awesome", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "youre_awesome",
    //   },
    //   {
    //     name: ("anim.2039e966dd1baf4053c9188e972b78b1"),
    //     id: "ec3bd4aa8a838985cc397dfedb02814b",
    //     seq: [["majestic_animations_8", "cluck_strut", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "cluck_strut",
    //   },
    //   {
    //     name: ("anim.27f937367e976568f25fcf2479244582"),
    //     id: "c64ac43bcc77897bc5e890fb8da25a3b",
    //     seq: [["majestic_animations_8", "slitherin", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "slitherin",
    //   },
    //   {
    //     name: ("anim.3e2ef3e0c37575e0719e93478b01652e"),
    //     id: "6b6acedf2cdb89e4a2dfcc6335444efc",
    //     seq: [["majestic_animations_8", "its_go_time", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "its_go_time",
    //   },
    //   {
    //     name: ("anim.ece457045f1577453ce9c35e38973276"),
    //     id: "dee85179fdf1c85a574d71481da69526",
    //     seq: [["majestic_animations_8", "get_funky", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "get_funky",
    //   },
    //   {
    //     name: ("anim.dc45a8a4b98830f537e4ae36eff0b974"),
    //     id: "2349cd701d2bbc200b95cc015f719d77",
    //     seq: [["majestic_animations_8", "nana_nana", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "nana_nana",
    //   },
    //   {
    //     name: ("anim.e973bcaae3997b24187c803b990831d8"),
    //     id: "6a877e4c914b6399906c006ebf7003ac",
    //     seq: [["majestic_animations_8", "side_hustle", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "side_hustle",
    //   },
    //   {
    //     name: ("anim.e843454deac4dd4ac8afc6f2b770f503"),
    //     id: "d7c95899ed2e970e919068918e1e5524",
    //     seq: [["majestic_animations_8", "droop", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "droop",
    //   },
    //   {
    //     name: ("anim.12846dc0db0542dbe10e3fb58cb64edc"),
    //     id: "e769409a31678c8d93d459f0e090c5d6",
    //     seq: [["majestic_animations_8", "mashed_potato", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "mashed_potato",
    //   },
    //   {
    //     name: ("anim.5563e2f5bc405dbdec2c14b98b072295"),
    //     id: "642590294df5ebe63f185edb93a607d5",
    //     seq: [["majestic_animations_8", "verve", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "verve",
    //   },
    //   {
    //     name: ("anim.a219bbbc0f8b9bb7aa72ccad5696ce76"),
    //     id: "433b14c23f8170ca1f8c8a78fad67a82",
    //     seq: [["majestic_animations_8", "gloss", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "gloss",
    //   },
    //   {
    //     name: ("anim.49c372d49973737094fbbd0dfa1dc6b1"),
    //     id: "80bba88498042f3f5a422d241d6cdc0b",
    //     seq: [["majestic_animations_8", "my_idol", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "my_idol",
    //   },
    //   {
    //     name: ("anim.189441293700fedea20600e9321b2bbc"),
    //     id: "706cd8a63d33dcec1052ac3ac7aff67d",
    //     seq: [["majestic_animations_9", "paws_claws", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "paws_claws",
    //   },
    //   {
    //     name: ("anim.8984f472b3ea40469b37d13bd12c925e"),
    //     id: "4d717e277e11f15b288474473d84e8b8",
    //     seq: [["majestic_animations_9", "running_man", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "running_man",
    //   },
    //   {
    //     name: ("anim.7b6e30a83a4de0b399037997e2c06334"),
    //     id: "ea4fd8d58d528902786ced144fcfb75f",
    //     seq: [["majestic_animations_9", "living_large", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "living_large",
    //   },
    //   {
    //     name: ("anim.df17a2ab0908b8a72ccd5ac1c6439f4e"),
    //     id: "5fcf15ca040072b26d1094937c45c50a",
    //     seq: [["majestic_animations_9", "hootenanny", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "hootenanny",
    //   },
    //   {
    //     name: ("anim.ff56dba67424cf4e9d9967ec085ed75c"),
    //     id: "b2c99db589034ca1312f41fd3f5724b4",
    //     seq: [["majestic_animations_9", "dirtbike_challenge", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "dirtbike_challenge",
    //   },
    //   {
    //     name: ("anim.56841a8dae46817c36a98558255d681b"),
    //     id: "146bfc7a696d590f3083443366788c68",
    //     seq: [["majestic_animations_9", "lunar_party", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "lunar_party",
    //   },
    //   {
    //     name: ("anim.b87ee87562852a91fa57e4a0a0e0215b"),
    //     id: "1c0e4c748f994267c77b94d98e9c3c10",
    //     seq: [["majestic_animations_9", "the_look", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "the_look",
    //   },
    //   {
    //     name: ("anim.0bf29b0728773aa968e8679cb3e6a848"),
    //     id: "537c29aa5c6cbc90cea8d649ba595422",
    //     seq: [["majestic_animations_9", "revel", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "revel",
    //   },
    //   {
    //     name: ("anim.a0f27919ed8c552c7967a8aa1d0a5bb7"),
    //     id: "58f13d0057b89c9dc14c86a8b8b213c3",
    //     seq: [["majestic_animations_9", "im_diamond", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "im_diamond",
    //   },
    //   {
    //     name: ("anim.a81aee9692d80a6f0845d1c3cf7d0e1c"),
    //     id: "30d62850cbc3ae3ed785fd195fd3f954",
    //     seq: [["majestic_animations_9", "hitchhiker", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "hitchhiker",
    //   },
    //   {
    //     name: ("anim.be0abc8aab58008a99f79927faed96d9"),
    //     id: "f3ce5d716cbc7a2f0462e83533910355",
    //     seq: [["majestic_animations_9", "waterworks", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "waterworks",
    //   },
    //   {
    //     name: ("anim.b7203d2972001fc77dd4323ef5148f61"),
    //     id: "e29d1c3ec9c7af1131dfe19871bb0d86",
    //     seq: [["majestic_animations_9", "pick_it_up", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "pick_it_up",
    //   },
    //   {
    //     name: ("anim.937c161cf2f5055c48498a839b089e67"),
    //     id: "4fc549563a50b6040c72d6486a438836",
    //     seq: [["majestic_animations_9", "california_gurls", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "california_gurls",
    //   },
    //   {
    //     name: ("anim.22d7e66573861051a4f1a82d391fcaf5"),
    //     id: "d3aefd02304d9833706145b42bffac2d",
    //     seq: [["majestic_animations_9", "bboom_bboom", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "bboom_bboom",
    //   },
    //   {
    //     name: ("anim.9bdf517462d92586de8a322b318e1def"),
    //     id: "1e4cbd59736660efb02fbf30f70a43dc",
    //     seq: [["majestic_animations_10", "hang_loose_celebration", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "hang_loose_celebration",
    //   },
    //   {
    //     name: ("anim.69fcad11acd8d79af8ce0027878b69b3"),
    //     id: "dea7f012fa86e17e3c96ac0f64f2d73d",
    //     seq: [["majestic_animations_10", "tootsee", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "tootsee",
    //   },
    //   {
    //     name: ("anim.cfad78d45e20d13ca5b7cc2c9401e32d"),
    //     id: "f395b494488f8dbe914e00e2ef6e0d30",
    //     seq: [["majestic_animations_10", "the_dance_laroi", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "the_dance_laroi",
    //   },
    //   {
    //     name: ("anim.1869e328fdf5091641fa0cd1a5471c47"),
    //     id: "f5c078cb3673796e323c52de91130a60",
    //     seq: [["majestic_animations_10", "dance_off", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "dance_off",
    //   },
    //   {
    //     name: ("anim.9f207d35797e68a6498f624bb7831c3a"),
    //     id: "eecc7ba2f61e94a52e69f5a0e3bff0eb",
    //     seq: [["majestic_animations_10", "fishy_flourish", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "fishy_flourish",
    //   },
    //   {
    //     name: ("anim.dd8f93f7c467a4934f2cc6e92d20f9b5"),
    //     id: "ed79f578f11abd40dc57671291c74e73",
    //     seq: [["majestic_animations_10", "freestylin", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "freestylin",
    //   },
    //   {
    //     name: ("anim.cce7ea835faf2a9c09d2406076426c5a"),
    //     id: "651717228ace2a5f8b481265c17a6809",
    //     seq: [["majestic_animations_10", "glyphic", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "glyphic",
    //   },
    //   {
    //     name: ("anim.6a91bd58de9206f040904c625c0d24e6"),
    //     id: "d1993d5680eff5b0f9b67010f59b7715",
    //     seq: [["majestic_animations_10", "fandalangle", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "fandalangle",
    //   },
    //   {
    //     name: ("anim.f6212f0c832a0451a76f0729d9547e20"),
    //     id: "efe0b435aede8fd3f6fb8324d2d12529",
    //     seq: [["majestic_animations_10", "marsh_walk", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "marsh_walk",
    //   },
    //   {
    //     name: ("anim.0deb5adf8356be388afd7fe664c2a5e3"),
    //     id: "13b49945805b0e84f630cba3f34534c2",
    //     seq: [["majestic_animations_10", "lazy_shuffle", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "lazy_shuffle",
    //   },
    //   {
    //     name: ("anim.56827256887706048927bd1f687a63cd"),
    //     id: "4e9681670a9d8d9f835dd03f7a08635e",
    //     seq: [["majestic_animations_10", "backstroke", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "backstroke",
    //   },
    //   {
    //     name: ("anim.ec7a310b7598ebdb44badd9a7aedf3e3"),
    //     id: "a74e8df829758f50be77042dd4b03256",
    //     seq: [["majestic_animations_10", "criss_cross", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "criss_cross",
    //   },
    //   {
    //     name: ("anim.b3937d38e19b0e2f061984b270cec5fa"),
    //     id: "b422da43c151b8be009a36fcaeafc1b2",
    //     seq: [["majestic_animations_10", "party_hips", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "party_hips",
    //   },
    //   {
    //     name: ("anim.fed71cc74f79c28727693ed355badb9b"),
    //     id: "c2e2990ca89ee961122afe72680f5fe2",
    //     seq: [["majestic_animations_10", "llama_conga", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "llama_conga",
    //   },
    //   {
    //     name: ("anim.73178f981503f7b23a33de0f83986bd7"),
    //     id: "8b3234784aca98a5731f9697380f3bb4",
    //     seq: [["majestic_animations_10", "juming_jacks", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "juming_jacks",
    //   },
    //   {
    //     name: ("anim.cb3b63297f44d1f73af8c2c7c6231d0c"),
    //     id: "a0e6d2215b7c674f4d413ad29a4a9688",
    //     seq: [["majestic_animations_10", "shout", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "shout",
    //   },
    //   {
    //     name: ("anim.a7dfcc3c65b760ac5dd117f72b07ddc4"),
    //     id: "e90643eff75502eef81cbf396df0f3de",
    //     seq: [["majestic_animations_10", "yay", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "yay",
    //   },
    //   {
    //     name: ("anim.3504ae76eee8a500dfc7d8369fb2bff0"),
    //     id: "5702337a4074a43993940b0577c4b72a",
    //     seq: [["majestic_animations_9", "forever", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "forever",
    //   },
    //   {
    //     name: ("anim.1417e2e5197fda525c21406a91d5590a"),
    //     id: "ce579cb220d2bfb5404bc62efca77350",
    //     seq: [["majestic_animations_10", "the_magic_bomb", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "the_magic_bomb",
    //   },
    //   {
    //     name: ("anim.521128a8afdcc8828508359d51872589"),
    //     id: "43ebc0fc8a971a90ceba2597cc4c27d6",
    //     seq: [["majestic_animations_10", "roll_n_rock", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "roll_n_rock",
    //   },
    //   {
    //     name: ("anim.718921751d1ea5811eda0df1c0498432"),
    //     id: "99a5d8a7bb52f8c08d0aaf721fae8596",
    //     seq: [["majestic_animations_11", "warm_up", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "warm_up",
    //   },
    //   {
    //     name: ("anim.bb6d4a1c3daac1280a118509c51021bb"),
    //     id: "74c899b602647881c1eb26b715d5e594",
    //     seq: [["majestic_animations_11", "gungslinger_smokeshow", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "gungslinger_smokeshow",
    //   },
    //   {
    //     name: ("anim.d3bb65fb375081a0c79e4dadd30218c0"),
    //     id: "ac56051f5e0bdb5992ffc5f8d5c103e4",
    //     seq: [["majestic_animations_11", "sweet_shot", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "sweet_shot",
    //   },
    //   {
    //     name: ("anim.31e9bd9b8035f055d40ac6d738f6f762"),
    //     id: "d4550eac297c5db0e4aa792fc024a655",
    //     seq: [["majestic_animations_11", "vibrant_vibin", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "vibrant_vibin",
    //   },
    //   {
    //     name: ("anim.09fdbbe9223115cb37ebbeffc49dacaf"),
    //     id: "a7030da727765f5d7d6487ea59fc1e70",
    //     seq: [["majestic_animations_11", "koi_dance", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "koi_dance",
    //   },
    //   {
    //     name: ("anim.7191c73783b01ae648b687d1b74168f2"),
    //     id: "c4590f3b652c2e20b44c25b5a0b90b61",
    //     seq: [["majestic_animations_11", "quick_style", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "quick_style",
    //   },
    //   {
    //     name: ("anim.cb35e5e75f68657bb3a239969de97b21"),
    //     id: "444deb91676bc2cddbc7dfdc6c73c5a0",
    //     seq: [["majestic_animations_11", "made_you_look", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "made_you_look",
    //   },
    //   {
    //     name: ("anim.636ad593cfa9cdc4beb4668420a2615f"),
    //     id: "ecc7d78f527153bc7bc926e5eb7020cb",
    //     seq: [["majestic_animations_11", "ask_me", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "ask_me",
    //   },
    //   {
    //     name: ("anim.b8095a3cd759911593be9a192d4b6687"),
    //     id: "4c345a85c235336cbf5f19f0cc972233",
    //     seq: [["majestic_animations_props_3", "atomic_synth_player", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "atomic_synth_player",
    //   },
    //   {
    //     name: ("anim.5d33a351c3cc963cd981ae68c04abe7c"),
    //     id: "fc23db65d6d36718b4267241e1af06a1",
    //     seq: [["majestic_animations_props_2", "sled_player", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "sled_player",
    //   },
    //   {
    //     name: ("anim.69026b641a3597f3e862402d88b5c3a0"),
    //     id: "934ef30356e7141b0d943a8c87544f49",
    //     seq: [["majestic_animations_props_3", "ring_it_on", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "ring_it_on",
    //   },
    //   {
    //     name: ("anim.2a259c053a43154b90d072832099d245"),
    //     id: "fec352b71aabf8cd7e2817577432efb3",
    //     seq: [["majestic_animations_props_3", "boombox_player", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "boombox_player",
    //   },
    //   {
    //     name: ("anim.94617ab0fac95eae24e9220f517c3eae"),
    //     id: "b7621b54fd057a622657c31dd57701f3",
    //     seq: [["majestic_animations_props_3", "boots_n_cats_player", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "boots_n_cats_player",
    //   },
    //   {
    //     name: ("anim.90a1418da3fdafb06342d57c8983ad7e"),
    //     id: "4143c1de5ecb57cae3548b74e9427d2c",
    //     seq: [["majestic_animations_props_3", "mic_stand_player", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "mic_stand_player",
    //   },
    //   {
    //     name: ("anim.7b0f613c98f013217a87461be8dab0f2"),
    //     id: "a1e32fdca984ef4466ce9edad4c18db6",
    //     seq: [["majestic_animations_props_3", "declare", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "declare",
    //   },
    //   {
    //     name: ("anim.5a38058eb0cd4919cc96b176e55b1707"),
    //     id: "27f86f5e9864d3384d8ebd918ae32ef5",
    //     seq: [["majestic_animations_props_3", "rocket_rodeo_player", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "rocket_rodeo_player",
    //   },
    //   {
    //     name: ("anim.bfda02872506e3e1f747cec061a563e9"),
    //     id: "6571d02815a7ec1a9f6e1c13693867bf",
    //     seq: [["majestic_animations_props_3", "drum_major_player", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "drum_major_player",
    //   },
    //   {
    //     name: ("anim.f5a53b565dbfcdfe423b3dc6b4437071"),
    //     id: "f231fd82e4d1a9076c86a2ec50ad719d",
    //     seq: [["majestic_animations_props_3", "pump_it_up", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "pump_it_up",
    //   },
    //   {
    //     name: ("anim.5383ae9281e3506cf4d33e356d94f3d7"),
    //     id: "2c2b54b627c5f4ba60233dc182905666",
    //     seq: [["majestic_animations_props_3", "cheer_up", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "cheer_up",
    //   },
    //   {
    //     name: ("anim.6925dbcc7a7db8235270a726d040b9ce"),
    //     id: "994383f7ea9979a5f75fd3105fcf02be",
    //     seq: [["majestic_animations_props_3", "empress_fan_dance", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "empress_fan_dance",
    //   },
    //   {
    //     name: ("anim.94e3602c480ac39c71d7b13f4ef701b3"),
    //     id: "8f8b87f4f3128c1bb0aa5ea76e549599",
    //     seq: [["majestic_animations_dances_1", "manera", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "manera",
    //   },
    //   {
    //     name: ("anim.9a49742efa700a33582c24fc28ae54d5"),
    //     id: "46ad0276a95341fb08a80f6a02eed95d",
    //     seq: [["majestic_animations_11", "air_shredder", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "air_shredder",
    //   },
    //   {
    //     name: ("anim.069093599dfe9ade79c2301cef16481c"),
    //     id: "97802ba4e17a712d8332c6f61e960246",
    //     seq: [["majestic_animations_11", "crazy_boy", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "crazy_boy",
    //   },
    //   {
    //     name: ("anim.dea07e50db1785503101051f0dba99ce"),
    //     id: "4d39a437f4d06b6f3b388e0fbcb7ac99",
    //     seq: [["majestic_animations_11", "fishin", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "fishin",
    //   },
    //   {
    //     name: ("anim.996186007d3710b1c7aa4f024e3e5df1"),
    //     id: "6b4564d65ac70604b8396adee4aaf684",
    //     seq: [["majestic_animations_11", "ninja_style", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "ninja_style",
    //   },
    //   {
    //     name: ("anim.f099811bd910dfba6042f1eb5df8b26d"),
    //     id: "3c81fd0dac61b86c5c721be25f3dc2b3",
    //     seq: [["majestic_animations_11", "the_worm", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "the_worm",
    //   },
    //   {
    //     name: ("anim.79402f09fb1648659adbec0f3edf1beb"),
    //     id: "a7f0da15bc2e2cff3e44423664958b44",
    //     seq: [["majestic_animations_11", "wiggle", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "wiggle",
    //   },
    //   {
    //     name: ("anim.a850b84d5c904ead060824a45a1e1e9c"),
    //     id: "6c05562921eec961a2fc910c8dff2a1c",
    //     seq: [["majestic_animations_11", "star_power", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "star_power",
    //   },
    //   {
    //     name: ("anim.e138b333846a61c9d9178c4c80664bbe"),
    //     id: "87699887c083ec4e5422f7ab72c50de0",
    //     seq: [["majestic_animations_12", "rambunctious", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "rambunctious",
    //   },
    //   {
    //     name: ("anim.538a398279e870564848b06e55bdddcf"),
    //     id: "796ce1e4a16bfe19a76a4a6b7e7932e5",
    //     seq: [["majestic_animations_12", "rawr", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "rawr",
    //   },
    //   {
    //     name: ("anim.1560a77d8d5752d37bbddcb98caa4754"),
    //     id: "e61d1a0f10234266bcc76fc5ff5aee09",
    //     seq: [["majestic_animations_12", "fast_feet", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "fast_feet",
    //   },
    //   {
    //     name: ("anim.c70f1d6a2f4f4b72cbfaf167fa0a5404"),
    //     id: "64a073fd1e746b641b04a74b32555e6b",
    //     seq: [["majestic_animations_12", "capoeira", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "capoeira",
    //   },
    //   {
    //     name: ("anim.b988776185e7b7cc9e1f6bf15e0a6073"),
    //     id: "820ab688a368254e3ef6fd1dc5c717a5",
    //     seq: [["majestic_animations_12", "bobbin", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "bobbin",
    //   },
    //   {
    //     name: ("anim.1bfe93b3c411cfa6a0b6d038ad6ec928"),
    //     id: "a8f0cf2877068defdc0200854550d786",
    //     seq: [["majestic_animations_12", "overdrive", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "overdrive",
    //   },
    //   {
    //     name: ("anim.cf1286ab61637adcd6a7e6c0024a3dc3"),
    //     id: "9319e9fb89bac6180070ea9a6d174016",
    //     seq: [["majestic_animations_12", "fanciful", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "fanciful",
    //   },
    //   {
    //     name: ("anim.973429d9ae070e1220a14138c3829c5f"),
    //     id: "ef813b6707f458f448cd4dd372fa29a8",
    //     seq: [["majestic_animations_12", "bunny_hop", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "bunny_hop",
    //   },
    //   {
    //     name: ("anim.0d71ee52298f8d7c80bc21a6d261424f"),
    //     id: "e3c7a8838b4ff9d047a97a97565edef7",
    //     seq: [["majestic_animations_12", "no_sweat", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "no_sweat",
    //   },
    //   {
    //     name: ("anim.bc775f3142a43b406df0e39e95f82a4b"),
    //     id: "77aef50e3a477715fb5de116058dd8f5",
    //     seq: [["majestic_animations_12", "windmill_floss", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "windmill_floss",
    //   },
    //   {
    //     name: ("anim.54ceddcf3902288daf373187518e3f7f"),
    //     id: "90b4f1aaad616f3b0699e0c455764095",
    //     seq: [["majestic_animations_12", "swole_cat", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "swole_cat",
    //   },
    //   {
    //     name: ("anim.388b2dd92dce7b4ff7638b6a5cd08079"),
    //     id: "b4dda46abb0ff21ac623724630f9b5ba",
    //     seq: [["majestic_animations_12", "head_banger", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "head_banger",
    //   },
    //   {
    //     name: ("anim.1404d2151065f6048b266a886cbb12e5"),
    //     id: "9069c50cd0ee442bf6d90bb2928a9378",
    //     seq: [["majestic_animations_12", "get_loose", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "get_loose",
    //   },
    //   {
    //     name: ("anim.7414f5a62eceb22c100980e31c10d3ba"),
    //     id: "8a3255de3b5b32366a02aa2158861c3a",
    //     seq: [["majestic_animations_12", "bully", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "bully",
    //   },
    //   {
    //     name: ("anim.c6c82849748cdd5a8dcc184acabfe7e1"),
    //     id: "fc23c09e0f9e39140aef74fd0ac71138",
    //     seq: [["majestic_animations_12", "bring_it_around", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "bring_it_around",
    //   },
    //   {
    //     name: ("anim.1f91ae4e61e4f4ed38fcaf80108641e1"),
    //     id: "096bddb74bf5e3b08428610aacf15bcd",
    //     seq: [["majestic_animations_12", "square_up", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "square_up",
    //   },
    //   {
    //     name: ("anim.29665e800c8099989f0086ae8e7715c4"),
    //     id: "5f3bbba357fc3bc7e1686b6ed5d000ca",
    //     seq: [["majestic_animations_12", "without_you", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "without_you",
    //   },
    //   {
    //     name: ("anim.a835af182e73fc475a4f202d8b168aab"),
    //     id: "8e0466c7a1d17bbb73369db87cdfede8",
    //     seq: [["majestic_animations_12", "run_it_down", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "run_it_down",
    //   },
    //   {
    //     name: ("anim.4ef335fb5a0acf2b92adda343e3aa380"),
    //     id: "a94b7a3091ded47c2437a64fc74cc162",
    //     seq: [["majestic_animations_12", "goated", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "goated",
    //   },
    //   {
    //     name: ("anim.3a65c6f89e38fbc5cec2dce2740d215e"),
    //     id: "12c39b4a46d8093e09d755324a288a20",
    //     seq: [["majestic_animations_12", "celebrate_me", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "celebrate_me",
    //   },
    //   {
    //     name: ("anim.31ce775d88c6c593cca6e8255b53ddca"),
    //     id: "55547458a8cc78a585b9942a37481f9d",
    //     seq: [["majestic_animations_12", "pay_it_off", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "pay_it_off",
    //   },
    //   {
    //     name: ("anim.038f99eae60ffaffef16bcfd504e86fc"),
    //     id: "4593c145e69062cd26a65c86277753f0",
    //     seq: [["majestic_animations_12", "fast_flex", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "fast_flex",
    //   },
    //   {
    //     name: ("anim.289354c241afe3247e223cf7968d0095"),
    //     id: "2f292e730a36ac2eaeb426d383283bdb",
    //     seq: [["majestic_animations_12", "get_out_of_your_mind", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "get_out_of_your_mind",
    //   },
    //   {
    //     name: ("anim.a9fd8e971faf9ec9a49df5c03f8c2a9f"),
    //     id: "9e5a93e26b0b3881e6be1dd268b91a2c",
    //     seq: [["majestic_animations_dances_1", "lit_dance", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "lit_dance",
    //   },
    //   {
    //     name: ("anim.366774be6bca5e3117fa594afaa84c0d"),
    //     id: "6a7a80bf89013d673fb79564bcd02475",
    //     seq: [["majestic_animations_props_7", "take_the_elf", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "take_the_elf",
    //   },
    //   {
    //     name: ("anim.d8b1454bc3e99d686b7eac17289b2b19"),
    //     id: "4ccb7f7038fa3b5bffd47ca0d9c0f88c",
    //     seq: [["majestic_animations_props_7", "snowman_player", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "snowman_player",
    //   },
    //   {
    //     name: ("anim.0c74ffd419a406514a7f1ec2b5ca62d7"),
    //     id: "16b88c4afaf3e35c91ec8e8c6b48e651",
    //     seq: [["majestic_animations_props_6", "choice_knit_player", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "choice_knit_player",
    //   },
    //   {
    //     name: ("anim.6d4fc447d3f1d1b03d063bb3d1e5f035"),
    //     id: "7b9ccace4bb65d324a9858f7acf8ee89",
    //     seq: [["majestic_animations_props_6", "shaolin_sip", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "shaolin_sip",
    //   },
    //   {
    //     name: ("anim.83360d67f2f5b2a22bbf8e1d75da2ae6"),
    //     id: "432d2589e30d058842e5f276d1c35bdc",
    //     seq: [["majestic_animations_props_6", "treat_player", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "treat_player",
    //   },
    //   {
    //     name: ("anim.6438c65cc88958812a53ee8e8dd9ba41"),
    //     id: "9d885030249b6fc85f2099fd529276f1",
    //     seq: [["majestic_animations_props_6", "sparkler", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "sparkler",
    //   },
    //   {
    //     name: ("anim.3e26874dc90d7a176d9cb8de65f44213"),
    //     id: "2079668f30b9a5a8bd5dc4f638d4c691",
    //     seq: [["majestic_animations_props_6", "telekinetic_player", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "telekinetic_player",
    //   },
    //   {
    //     name: ("anim.06149dcaa27ee4c251b22fc4b608e0d5"),
    //     id: "0de791a580566717e7df7606e0906c68",
    //     seq: [["majestic_animations_props_6", "tangerine_player", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "tangerine_player",
    //   },
    //   {
    //     name: ("anim.ea5914e5bf484a8454f918dab7a78d1a"),
    //     id: "b65ed9c8622111b3824e417d6c69ed17",
    //     seq: [["majestic_animations_props_7", "heart_attach_player", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "heart_attach_player",
    //   },
    //   {
    //     name: ("anim.0c3ab562f25be147b15a7c97f1a87e29"),
    //     id: "23d7dd8f2715f18c7341bf4ef25c694b",
    //     seq: [["majestic_animations_props_7", "omg_love_player", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "omg_love_player",
    //   },
    //   {
    //     name: ("anim.36666df6c06afb1dd0a3fadd641ee933"),
    //     id: "e0e20f852cf83066f5b773481c2ce9c0",
    //     seq: [["majestic_animations_13", "planetary_vibe", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "planetary_vibe",
    //   },
    //   {
    //     name: ("anim.9d7760500e344d79238d5018b8c290ba"),
    //     id: "28c71206fbce6d1231c64c57972ffe40",
    //     seq: [["majestic_animations_13", "pump_me_up", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "pump_me_up",
    //   },
    //   {
    //     name: ("anim.f147321f3344453e0c92cffc8f71f7bf"),
    //     id: "712511fab84f95df6349a96ce56cb6a0",
    //     seq: [["majestic_animations_13", "headbanger_2", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "headbanger_2",
    //   },
    //   {
    //     name: ("anim.e435c2d3a6e046e791fdef12dde055f5"),
    //     id: "7411c522916d52dcd413e41ce293d86d",
    //     seq: [["majestic_animations_13", "culture_festival", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "culture_festival",
    //   },
    //   {
    //     name: ("anim.a6ea0a1aee4a70d6cb791950e7795468"),
    //     id: "96fb7369d9911c6c8daf4aba96140ff6",
    //     seq: [["majestic_animations_13", "bust_a_move_1", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "bust_a_move_1",
    //   },
    //   {
    //     name: ("anim.4fd88dc8092efd0eb81c4a3a9d7dc12e"),
    //     id: "6da5c321c4af068f9e852c2407b66af4",
    //     seq: [["majestic_animations_13", "boys_a_liar", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "boys_a_liar",
    //   },
    //   {
    //     name: ("anim.09fdfe63141df9152c6e828be250a14a"),
    //     id: "0cf65df92566a3fac6b34105fcaa74d8",
    //     seq: [["majestic_animations_13", "bizcochito", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "bizcochito",
    //   },
    //   {
    //     name: ("anim.021da950885c188a570b3de6dd593959"),
    //     id: "d6d383fd29e3b437bc6b2889bfae32d1",
    //     seq: [["majestic_animations_13", "night_out", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "night_out",
    //   },
    //   {
    //     name: ("anim.9f5a6290499aedf5d588430c99b92c48"),
    //     id: "b7cd6dddd925aba51c5c3f9e63f0480e",
    //     seq: [["majestic_animations_13", "start_it_up", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "start_it_up",
    //   },
    //   {
    //     name: ("anim.959e56d62f307a258763a10ec806c03e"),
    //     id: "22e56ca38dc1315e246fd36427a77005",
    //     seq: [["majestic_animations_13", "wind_up", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "wind_up",
    //   },
    //   {
    //     name: ("anim.919d56e05ef9a6c01523138fe0f40201"),
    //     id: "ae47772066c9cd945da0d1d963660b5e",
    //     seq: [["majestic_animations_13", "starlit", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "starlit",
    //   },
    //   {
    //     name: ("anim.304cf157d7604ce454137c4a876750d7"),
    //     id: "b34ee4352211d722a5acd7f5f4496d6e",
    //     seq: [["majestic_animations_dances_1", "dom_yes", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "dom_yes",
    //   },
    //   {
    //     name: ("anim.91e688c0cffab9a4025276e0379fe060"),
    //     id: "ea81f9ba9e6754c36665de8c6de846cc",
    //     seq: [["majestic_animations_dances_1", "wanna_dance", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "wanna_dance",
    //   },
    //   {
    //     name: ("anim.468f95f65f3a308d22b8522e54e7cf7b"),
    //     id: "671050e592adc97497b6afb8644e857b",
    //     seq: [["majestic_animations_props_4", "called_shot", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "called_shot",
    //   },
    //   {
    //     name: ("anim.e1300ac4ffc6625136c21c4b0bf39931"),
    //     id: "60d10b43d1d831addd1fbca4c12e1411",
    //     seq: [["majestic_animations_props_4", "witch_way_player", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "witch_way_player",
    //   },
    //   {
    //     name: ("anim.613e117454302a8e4546d637661b3557"),
    //     id: "a39523887e98de407c6a5cf6025c5069",
    //     seq: [["majestic_animations_props_4", "cardistry_player", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "cardistry_player",
    //   },
    //   {
    //     name: ("anim.89b9279c5a26c82b33dff4b96080adfc"),
    //     id: "7333d605ab29c5fe83089b21a7692a54",
    //     seq: [["majestic_animations_props_4", "target_training", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "target_training",
    //     prop: [
    //       {
    //         name: ("mj_boxing_glove_left"),
    //         attach: {
    //           bone: 28422,
    //           offsetPos: { x: 0, y: 0, z: 0 },
    //           offsetRot: { x: 0, y: 0, z: 0 },
    //         },
    //       },
    //       {
    //         name: ("mj_boxing_glove_right"),
    //         attach: {
    //           bone: 60309,
    //           offsetPos: { x: 0, y: 0, z: 0 },
    //           offsetRot: { x: 0, y: 0, z: 0 },
    //         },
    //       },
    //       {
    //         name: ("mj_boxing_target"),
    //         attach: {
    //           bone: 36029,
    //           offsetPos: { x: 0, y: 0, z: 0 },
    //           offsetRot: { x: 0, y: 0, z: 0 },
    //         },
    //       },
    //       {
    //         name: ("mj_boxing_target"),
    //         attach: {
    //           bone: 6286,
    //           offsetPos: { x: 0, y: 0, z: 0 },
    //           offsetRot: { x: 0, y: 0, z: 0 },
    //         },
    //       },
    //     ],
    //   },
    //   {
    //     name: ("anim.5496e5036d5786cb181ebc8019675a0f"),
    //     id: "bb4ce7846cf53d5182891e65c8608cc5",
    //     seq: [["majestic_animations_props_4", "crispy", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "crispy",
    //   },
    //   {
    //     name: ("anim.187bdc351bd53bdf237e06321c5a764f"),
    //     id: "bc0a98c04b9a3071c7d6978d5d63ee13",
    //     seq: [["majestic_animations_props_4", "sprout_of_tune_player", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "sprout_of_tune_player",
    //   },
    //   {
    //     name: ("anim.62f7382c2c156fed4b09c3b4eaffa42c"),
    //     id: "fac3399c4f6507ffaabe78476b66c5f9",
    //     seq: [["majestic_animations_props_4", "click_click_flash", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "click_click_flash",
    //     prop: [
    //       {
    //         name: ("ch_prop_ch_phone_ing_01a"),
    //         attach: {
    //           bone: 6286,
    //           offsetPos: { x: 0, y: 0, z: 0 },
    //           offsetRot: { x: 0, y: 0, z: 0 },
    //         },
    //       },
    //     ],
    //   },
    //   {
    //     name: ("anim.05172b8f631b6ee0ff88431675487c97"),
    //     id: "568da74296a9188030d53a23258492f3",
    //     seq: [["majestic_animations_props_4", "pony_up", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "pony_up",
    //     prop: [
    //       {
    //         name: ("h4_prop_battle_hobby_horse"),
    //         attach: {
    //           bone: 36029,
    //           offsetPos: { x: 0, y: 0, z: 0 },
    //           offsetRot: { x: 0, y: 0, z: 0 },
    //         },
    //       },
    //     ],
    //   },
    //   {
    //     name: ("anim.484e44f67995e573b252b9bbda6979a9"),
    //     id: "42e10f02954ab8470df096b75fcc75c8",
    //     seq: [["majestic_animations_props_8", "kiss_kiss", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "kiss_kiss",
    //     prop: [
    //       {
    //         name: ("mj_kiss_hearts"),
    //         anim: ["majestic_animations_props_8", "kiss_kiss_prop"],
    //         attach: {
    //           bone: 36029,
    //           offsetPos: { x: 0, y: 0, z: 0 },
    //           offsetRot: { x: 0, y: 0, z: 0 },
    //         },
    //       },
    //     ],
    //   },
    //   {
    //     name: ("anim.85bb00971d8e6a013dac851b72f94461"),
    //     id: "ab029f45b10d0705ef9a6bcd03a17638",
    //     seq: [["majestic_animations_props_8", "heart_sign", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "heart_sign",
    //     prop: [
    //       {
    //         name: ("mj_heart_sign"),
    //         anim: ["majestic_animations_props_8", "heart_sign_prop"],
    //         attach: {
    //           bone: 36029,
    //           offsetPos: { x: 0, y: 0, z: 0 },
    //           offsetRot: { x: 0, y: 0, z: 0 },
    //         },
    //       },
    //     ],
    //   },
    //   {
    //     name: ("anim.Ambitious"),
    //     id: "Ambitious",
    //     seq: [["majestic_animations_14", "ambitious", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "ambitious",    
    //   },
    //   {
    //     name: ("anim.BadGuy"),
    //     id: "BadGuy",
    //     seq: [["majestic_animations_14", "bad_guy", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "bad_guy",
    // },
    // {
    //     name: ("anim.BoneyBounce"),
    //     id: "BoneyBounce",
    //     seq: [["majestic_animations_14", "boney_bounce", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "boney_bounce",
    // },
    // {
    //     name: ("anim.BoodUpGroove"),
    //     id: "BoodUpGroove",
    //     seq: [["majestic_animations_14", "bood_up_groove", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "bood_up_groove",
    // },
    // {
    //     name: ("anim.Carefree"),
    //     id: "Carefree",
    //     seq: [["majestic_animations_14", "carefree", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "carefree",
    // },
    // {
    //     name: ("anim.Classy"),
    //     id: "Classy",
    //     seq: [["majestic_animations_14", "classy", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "classy",
    // },
    // {
    //     name: ("anim.DancinDomino"),
    //     id: "DancinDomino",
    //     seq: [["majestic_animations_14", "dancin_domino", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "dancin_domino",
    // },
    // {
    //     name: ("anim.EvilPlan"),
    //     id: "EvilPlan",
    //     seq: [["majestic_animations_14", "evil_plan", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "evil_plan",
    // },
    // {
    //     name: ("anim.GoWithTheFlow"),
    //     id: "GoWithTheFlow",
    //     seq: [["majestic_animations_14", "go_with_the_flow", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "go_with_the_flow",
    // },
    // {
    //     name: ("anim.Hooray"),
    //     id: "Hooray",
    //     seq: [["majestic_animations_14", "hooray", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "hooray",
    // },
    // {
    //     name: ("anim.JubiSlide"),
    //     id: "JubiSlide",
    //     seq: [["majestic_animations_14", "jubi_slide", 33]],
    //     upper: false,
    //     loop: true,
    //     song: "jubi_slide",
    // },
    // {
    //     name: ("anim.MakeSomeWaves"),
    //     id: "MakeSomeWaves",
    //     seq: [["majestic_animations_14", "make_some_waves", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "make_some_waves",
    // },
    // {
    //     name: ("anim.NoCure"),
    //     id: "NoCure",
    //     seq: [["majestic_animations_14", "no_cure", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "no_cure",
    // },
    // {
    //     name: ("anim.PopularVibe"),
    //     id: "PopularVibe",
    //     seq: [["majestic_animations_14", "popular_vibe", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "popular_vibe",
    // },
    // {
    //     name: ("anim.RainCheck"),
    //     id: "RainCheck",
    //     seq: [["majestic_animations_14", "rain_check", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "rain_check",
    // },
    // {
    //     name: ("anim.RealSlimShady"),
    //     id: "RealSlimShady",
    //     seq: [["majestic_animations_14", "real_slim_shady", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "real_slim_shady",
    // },
    // {
    //     name: ("anim.Rebellious"),
    //     id: "Rebellious",
    //     seq: [["majestic_animations_14", "rebellious", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "rebellious",
    // },
    // {
    //     name: ("anim.ShowYa"),
    //     id: "ShowYa",
    //     seq: [["majestic_animations_14", "show_ya", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "show_ya",
    // },
    // {
    //     name: ("anim.SocialClimber"),
    //     id: "SocialClimber",
    //     seq: [["majestic_animations_14", "social_climber", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "social_climber",
    // },
    // {
    //     name: ("anim.SwagShuffle"),
    //     id: "SwagShuffle",
    //     seq: [["majestic_animations_14", "swag_shuffle", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "swag_shuffle",
    // },
    // {
    //     name: ("anim.TheSquabble"),
    //     id: "TheSquabble",
    //     seq: [["majestic_animations_14", "the_squabble", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "the_squabble",
    // },
    // {
    //     name: ("anim.ToTheBeat"),
    //     id: "ToTheBeat",
    //     seq: [["majestic_animations_14", "to_the_beat", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "to_the_beat",
    // },
    // {
    //     name: ("anim.YouAWinner"),
    //     id: "YouAWinner",
    //     seq: [["majestic_animations_14", "you_a_winner", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "you_a_winner",
    // },
    // {
    //     name: ("anim.YouShouldSeeMeInACrown"),
    //     id: "YouShouldSeeMeInACrown",
    //     seq: [["majestic_animations_14", "you_should_see_me_in_a_crown", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "you_should_see_me_in_a_crown",
    // },
    // {
    //     name: ("anim.JustWannaRock"),
    //     id: "JustWannaRock",
    //     seq: [["majestic_animations_dances_1", "just_wanna_rock", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "wanna_rock",
    // },
    // {
    //     name: ("anim.9mmGoBang"),
    //     id: "9mmGoBang",
    //     seq: [["majestic_animations_dances_1", "9mm_go_bang", 1]],
    //     upper: false,
    //     loop: true,
    //     song: "mm_go_bang",
    // }
    ],
  },
  {
    id: "5",
    name: ("anim.f3ab746beed63060d3e058070f314982"),
    img: "poses",
    anims: [
      {
        name: ("anim.4489cbbc3e5d7e3a18082ac2f598bca6"),
        id: "b3fb3d3f814414067b427036fd02d5bd",
        seq: "WORLD_HUMAN_GUARD_STAND",
        upper: false,
        loop: false,
      },
      {
        name: ("anim.4a668c61f1e62974806a12d66609583b"),
        id: "784ef311acc52613fa86780ba702437e",
        seq: [
          [
            "switch@michael@rejected_entry",
            "001396_01_mics3_6_rejected_entry_idle_bouncer",
          ],
        ],
        upper: true,
        loop: true,
      },
      {
        name: ("anim.ee58814bc704b422e03610669c715886"),
        id: "0a5b5ab31291e4d3532be312f699e21e",
        seq: "WORLD_HUMAN_GUARD_STAND",
        upper: false,
        loop: false,
      },
      {
        name: ("anim.1ef363c4f843106444d5aa8c23497586"),
        id: "8b31fa6cd66f1e76728a26282272d34e",
        seq: [["special_ped@impotent_rage@base", "base", 1]],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.d0152e6ff52ea8b779fd51dc97df3851"),
        id: "a94e7fa962ea096764df2700dcc84a69",
        seq: [["timetable@amanda@ig_3", "ig_3_base_tracy", 1]],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.ef1dfeb3f2300d8e3c0e8622bce7efc7"),
        id: "ce14b85f6d3234bac854c89806eef8a1",
        seq: [["special_ped@impotent_rage@base", "base", 1]],
        upper: true,
        loop: true,
      },
      {
        name: ("anim.f1ba6040f9944d6af8d9571560f1f0ea"),
        id: "57a3190ca035c220bc7eae67d1679aa5",
        seq: [
          [
            "switch@trevor@bear_in_floyds_face",
            "bear_in_floyds_face_loop_floyd",
            1,
          ],
        ],
        upper: true,
        loop: true,
      },
      {
        name: ("anim.dff7121789e09ca8f692137c46914068"),
        id: "7231ad8e7076dd0ab38e76d98ba78b65",
        seq: [["mp_am_hold_up", "handsup_base", 1]],
        upper: true,
        loop: true,
      },
      {
        name: ("anim.10406d2cf0893f9a33b22feca5937b80"),
        id: "d9cee0e0a3e00661ac62e861dac7091f",
        seq: [["anim@miss@low@fin@vagos@", "idle_ped06", 1]],
        upper: true,
        loop: true,
      },
      {
        name: ("anim.4bb9d67c9ac0bebbfdf83e4e97876605"),
        id: "7381d535710a80768963fa41b6106aae",
        seq: [["busted", "idle_a", 1]],
        upper: true,
        loop: true,
      },
      {
        name: ("anim.3c2c2da6133792019a0c39f70cd7cae8"),
        id: "9559a76a9b05f44b988b7deffbab236c",
        seq: [["special_ped@jane@base", "base", 1]],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.9ef9d38799103be8cc0f60fa06f4fa11"),
        id: "64c9ee8c128d46c70c9f21db4b0450b1",
        seq: [
          ["special_ped@mime@intro", "idle_intro", 1],
          ["special_ped@mime@base", "base", 1],
        ],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.d5dc7f598b273f0c8030f66870d764fb"),
        id: "2f6368bd369b4b76c17d32d4cf3b3f83",
        seq: [
          [
            "switch@franklin@lamar_tagging_wall",
            "lamar_tagging_wall_loop_franklin",
            1,
          ],
        ],
        upper: true,
        loop: true,
      },
      {
        name: ("anim.1ac2fabd762174e7654847a4dd11dda6"),
        id: "420a3155fe8edfc26c0e233873a789bf",
        seq: [["amb@world_human_cop_idles@female@idle_b", "idle_e", 1]],
        upper: true,
        loop: true,
      },
      {
        name: ("anim.b5a10a75e58c47c4c253b620e2914dc6"),
        id: "4fb40cd985a1e715d871a6824e175fd1",
        seq: [
          ["anim@heists@heist_corona@single_team", "single_team_intro_boss", 1],
        ],
        upper: true,
        loop: true,
      },
      {
        name: ("anim.1fc10c6d47ff901a371d39ff717373e6"),
        id: "2a261616d54bdde5c26fed6e0fd95f5b",
        seq: [
          [
            "amb@world_human_hang_out_street@female_arms_crossed@base",
            "base",
            1,
          ],
        ],
        upper: true,
        loop: true,
      },
      {
        name: ("anim.db73ead08fd11a180e443aa903f1e82d"),
        id: "adaf4c46ff9aaf0fe3fb53b5000d59e1",
        seq: [["rcmme_amanda1", "stand_loop_cop", 1]],
        upper: true,
        loop: true,
      },
      {
        name: ("anim.553c39e9447ad0b4368b80e01e9a20c8"),
        id: "8ad7a00ae201d20fc8bb5b14e355e902",
        seq: [
          [
            "switch@michael@sitting_on_car_bonnet",
            "sitting_on_car_bonnet_loop",
            1,
          ],
        ],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.6f73c91d692b3ee223a0b855898b1a0b"),
        id: "b47192975c91004fcfced2c107574ce9",
        seq: [
          [
            "amb@lo_res_idles@",
            "world_human_lean_male_legs_crossed_lo_res_base",
            1,
          ],
        ],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.e4506b6b5fcdd477ff5648bbb113937c"),
        id: "920ccd292b24af0da2eb2777650ec7e9",
        seq: [
          ["amb@lo_res_idles@", "world_human_lean_male_foot_up_lo_res_base", 1],
        ],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.4bb0db6c36146358410cbd44097285f5"),
        id: "6af7eefa1b3ba11c9875ed65b5b18884",
        seq: "WORLD_HUMAN_LEANING",
        upper: false,
        loop: false,
      },
      {
        name: ("anim.f54567b1e463058a5b8c3892ec14f1b4"),
        id: "ce6f30b0760b51b3edfa0003d3c97923",
        seq: "PROP_HUMAN_BUM_SHOPPING_CART",
        upper: false,
        loop: false,
      },
      {
        name: ("anim.57d3a783b36dca2380ba274425a8ae48"),
        id: "b1b8221c950076c955a4d6d64e567f36",
        seq: [["anim@heists@ornate_bank@hostages@hit", "hit_loop_ped_a", 1]],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.3860fe342bc87d312f9a37f75db62340"),
        id: "aebc29afb305c399cd69c422c6f47833",
        seq: [
          [
            "amb@world_human_bum_slumped@male@laying_on_right_side@idle_a",
            "idle_a",
            1,
          ],
        ],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.68bac6910d5d9b93347df8eeec0f7e01"),
        id: "3afd06a76cac9d0eb0f653cc2480ca5b",
        seq: "WORLD_HUMAN_SUNBATHE",
        upper: false,
        loop: false,
      },
      {
        name: ("anim.56df2cbba4e2eed7bc31caf5e713197c"),
        id: "e0dfb94040f1b2cf3e715119c9b88a7b",
        seq: [["amb@world_human_sunbathe@female@front@idle_a", "idle_c", 1]],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.61770a72308de4e688684b981d713166"),
        id: "6c4b9420b57fefcd64a92b20e6aeba36",
        seq: "WORLD_HUMAN_SUNBATHE_BACK",
        upper: false,
        loop: false,
      },
      {
        name: ("anim.a584614a14bf7b8a06501af6ea325766"),
        id: "1c37049897413c3d9ab84ea42c1b6dc9",
        seq: [["amb@world_human_sunbathe@female@back@idle_a", "idle_a", 1]],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.74bcc7c4f452d349d0ad02b496aa5642"),
        id: "8a798f9a727f9d51e203b8cfc2059457",
        seq: [["combat@damage@rb_writhe", "rb_writhe_loop", 1]],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.08fbc9e43b75e3d583ea3abeae69adc9"),
        id: "3a83050b76a8d6ce0236a2db007a630c",
        seq: "WORLD_HUMAN_PROSTITUTE_HIGH_CLASS",
        upper: false,
        loop: false,
      },
      {
        name: ("anim.a4dabd74d88d2bbc5a14286637d09a82"),
        id: "eb35230525cfc745b156f04765c77f4a",
        seq: "WORLD_HUMAN_PROSTITUTE_LOW_CLASS",
        upper: false,
        loop: false,
      },
      {
        name: ("anim.c49f6eeed18b244b8e74d042f2ad68b8"),
        id: "c55807ddd0b2c5856601ffbbd880ca21",
        seq: [["move_crawl", "onback_fwd", 1]],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.4d2117e29c431ae5302517bfe7c92c3e"),
        id: "9c1e49576f7b9ed24c66ea94162e1b5c",
        seq: [["move_crawl", "onfront_fwd", 1]],
        upper: false,
        loop: true,
      },
    ],
  },
  {
    id: "6",
    name: ("anim.231dd00eb3f83532f13f2e9c225ed87c"),
    img: "sit",
    anims: [
      {
        name: ("anim.44a5bd67b5d7ddc409ee9548dba4d59d"),
        id: "f210842c80e918b52e643ebe5fe64942",
        seq: "PROP_HUMAN_SEAT_BENCH",
        upper: false,
        loop: false,
      },
      {
        name: ("anim.ed97de8536f6256f6f15dc9411db07e8"),
        id: "f81ffad1c4530e02faa140e339612d0a",
        seq: [["rcmtmom_1leadinout", "tmom_1_rcm_p3_leadout_loop", 1]],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.ed25f4406793ab4b966d137463b4c140"),
        id: "76fb47dfe8a4c5075fa71d640555c664",
        seq: [["timetable@ron@ig_5_p3", "ig_5_p3_base", 1]],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.07d8aae62a23b7c584f468fa48027577"),
        id: "8e1f547edc9f3e5d2af25902771940c2",
        seq: [
          [
            "switch@michael@tv_w_kids",
            "001520_02_mics3_14_tv_w_kids_idle_mic",
            1,
          ],
        ],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.ec14f25952e1808a4e2cad12a6a1119b"),
        id: "111a5441380e9ea76c69efd89e480c8c",
        seq: [["timetable@ron@ig_3_couch", "base", 1]],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.e7b9db865b78adac97a129286e79c918"),
        id: "3df0ae9af4df29ac96f4eb1eeaf5b955",
        seq: [
          [
            "anim@amb@business@cfid@cfid_desk_no_work_bgen_chair_no_work@",
            "sleep_cycle_lazyworker",
            1,
          ],
        ],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.9a12552b2dbe44cbb436a0d129df599e"),
        id: "c84d6b6e38d191c8fa700a93ab6564e3",
        seq: [
          ["timetable@tracy@famr_ig_5", "famr_ig_5_iamabouttocrackthis", 1],
          ["timetable@tracy@famr_ig_5", "famr_ig_5_iamtotallyontop", 1],
          ["timetable@tracy@famr_ig_5", "famr_ig_5_iamtryingtoconcentrate", 1],
          ["timetable@tracy@famr_ig_5", "famr_ig_5_thiscollegestuff", 1],
        ],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.10ff588abf790fecd8505b032f2d3c5d"),
        id: "19ad7d868cbbba4af1dbc73f8fdeecac",
        seq: [["busted", "idle_a", 1]],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.2075498b9b71d451a070548abfd0bb3a"),
        id: "972569968ce59d0c65079f300520609b",
        seq: [["rcmminute2", "kneeling_arrest_idle", 1]],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.7fc44ef8ed5d4b0a0d984d9ad6e0f5e0"),
        id: "b541c43f295c8c102638dc796edaa749",
        seq: [["amb@code_human_cower@male@react_cowering", "base_left", 1]],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.bc4d8fbcc09efa3e5b932e2d6f088d62"),
        id: "a19f6169a833127ff2b48826037e135b",
        seq: [
          ["amb@medic@standing@kneel@enter", "enter", 1],
          ["amb@medic@standing@kneel@base", "base", 1],
        ],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.95691cf560937c1963be01bb5c990837"),
        id: "fa63a0d5f1bb048f0723c2ceb5d61456",
        seq: [["amb@medic@standing@tendtodead@base", "base", 1]],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.424f430a66f68563f5b374eb5863e272"),
        id: "d981e098848416ae6b1f859e4fe01751",
        seq: [["amb@world_human_bum_wash@male@low@idle_a", "idle_a", 1]],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.6160aa9b120139b8d7a6b24706d509fe"),
        id: "c10946500f8ad8fcf160c3b0c5523647",
        seq: [
          [
            "special_ped@mani@trevor_1@trevor_1h",
            "convo_trevor_whahellholaamigo_7",
            1,
          ],
          [
            "special_ped@mani@trevor_1@trevor_1i",
            "convo_trevor_whahellholaamigo_8",
            1,
          ],
        ],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.9160d39d3b2f73e1efb26a06d97b6269"),
        id: "e2faf53cd4494f58c53d6e76ef5adec2",
        seq: [
          ["amb@world_human_picnic@female@base", "base", 1],
          ["amb@world_human_picnic@female@idle_a", "idle_a", 1],
          ["amb@world_human_picnic@female@idle_a", "idle_c", 1],
          ["amb@world_human_picnic@female@idle_a", "idle_b", 1],
        ],
        upper: false,
        loop: true,
      },
      {
        name: ("anim.eec8ab2688e7039e825fc19998f1df67"),
        id: "1ccd5e2ad2977ca6e13f1d66239822e5",
        seq: [
          [
            "anim@amb@business@bgen@bgen_no_work@",
            "sit_phone_phoneputdown_fallasleep_nowork",
            1,
          ],
        ],
        upper: false,
        loop: true,
      },
    ],
  },
  {
    id: "7",
    name: ("anim.91a0dc74212c07fcafcd23434c7aeb63"),
    img: "speach",
    anims: [
      {
        name: ("anim.93f3655bf536d710c0af7ddfa6ff1b0d"),
        id: "74fe63e62c2125b22cd7fd8bff279e80",
        seq: [
          [
            "special_ped@baygor@monologue_6@monologue_6a",
            "salvation_comes_at_a_price_0",
            1,
          ],
          [
            "special_ped@baygor@monologue_6@monologue_6b",
            "salvation_comes_at_a_price_1",
            1,
          ],
          [
            "special_ped@baygor@monologue_6@monologue_6c",
            "salvation_comes_at_a_price_2",
            1,
          ],
          [
            "special_ped@baygor@monologue_6@monologue_6d",
            "salvation_comes_at_a_price_3",
            1,
          ],
          [
            "special_ped@baygor@monologue_6@monologue_6e",
            "salvation_comes_at_a_price_4",
            1,
          ],
          [
            "special_ped@baygor@monologue_6@monologue_6f",
            "salvation_comes_at_a_price_5",
            1,
          ],
          [
            "special_ped@baygor@monologue_6@monologue_6g",
            "salvation_comes_at_a_price_6",
            1,
          ],
          [
            "special_ped@baygor@monologue_6@monologue_6h",
            "salvation_comes_at_a_price_7",
            1,
          ],
          [
            "special_ped@baygor@monologue_6@monologue_6i",
            "salvation_comes_at_a_price_8",
            1,
          ],
          [
            "special_ped@baygor@monologue_6@monologue_6j",
            "salvation_comes_at_a_price_9",
            1,
          ],
          [
            "special_ped@baygor@monologue_6@monologue_6k",
            "salvation_comes_at_a_price_10",
            1,
          ],
          [
            "special_ped@baygor@monologue_6@monologue_6l",
            "salvation_comes_at_a_price_11",
            1,
          ],
        ],
        upper: false,
        loop: false,
      },
      {
        name: ("anim.779bec5b6a23099b4842f1dd39c52cfd"),
        id: "d5b77948f31c4d80d22efb7de3edc619",
        seq: [
          [
            "special_ped@baygor@monologue_7@monologue_7a",
            "do_you_want_happiness_0",
            1,
          ],
          [
            "special_ped@baygor@monologue_7@monologue_7b",
            "do_you_want_happiness_1",
            1,
          ],
          [
            "special_ped@baygor@monologue_7@monologue_7c",
            "do_you_want_happiness_2",
            1,
          ],
          [
            "special_ped@baygor@monologue_7@monologue_7d",
            "do_you_want_happiness_3",
            1,
          ],
          [
            "special_ped@baygor@monologue_7@monologue_7e",
            "do_you_want_happiness_4",
            1,
          ],
          [
            "special_ped@baygor@monologue_7@monologue_7f",
            "do_you_want_happiness_5",
            1,
          ],
          [
            "special_ped@baygor@monologue_7@monologue_7g",
            "do_you_want_happiness_6",
            1,
          ],
          [
            "special_ped@baygor@monologue_7@monologue_7h",
            "do_you_want_happiness_7",
            1,
          ],
          [
            "special_ped@baygor@monologue_7@monologue_7i",
            "do_you_want_happiness_8",
            1,
          ],
        ],
        upper: false,
        loop: false,
      },
      {
        name: ("anim.8625363871c275fb0315225192aae6fc"),
        id: "ba53fba3b0d7cdd76d61760e243a1c28",
        seq: [
          [
            "special_ped@baygor@monologue_8@monologue_8a",
            "im_an_epsilonist_0",
            1,
          ],
          [
            "special_ped@baygor@monologue_8@monologue_8b",
            "im_an_epsilonist_1",
            1,
          ],
          [
            "special_ped@baygor@monologue_8@monologue_8c",
            "im_an_epsilonist_2",
            1,
          ],
          [
            "special_ped@baygor@monologue_8@monologue_8d",
            "im_an_epsilonist_3",
            1,
          ],
          [
            "special_ped@baygor@monologue_8@monologue_8e",
            "im_an_epsilonist_4",
            1,
          ],
          [
            "special_ped@baygor@monologue_8@monologue_8f",
            "im_an_epsilonist_5",
            1,
          ],
          [
            "special_ped@baygor@monologue_8@monologue_8g",
            "im_an_epsilonist_6",
            1,
          ],
          [
            "special_ped@baygor@monologue_8@monologue_8h",
            "im_an_epsilonist_7",
            1,
          ],
          [
            "special_ped@baygor@monologue_8@monologue_8i",
            "im_an_epsilonist_8",
            1,
          ],
          [
            "special_ped@baygor@monologue_8@monologue_8j",
            "im_an_epsilonist_9",
            1,
          ],
        ],
        upper: false,
        loop: false,
      },
      {
        name: ("anim.580137f4355ea1247d862b95e60029a6"),
        id: "2c75a20814b7f7d2fe365e2f7149c90e",
        seq: [
          [
            "special_ped@bill@monologue_4@monologue_4a",
            "bill_ig_1_b_01_imofferingironclad_0",
            1,
          ],
          [
            "special_ped@bill@monologue_4@monologue_4b",
            "bill_ig_1_b_01_imofferingironclad_1",
            1,
          ],
          [
            "special_ped@bill@monologue_4@monologue_4c",
            "bill_ig_1_b_01_imofferingironclad_2",
            1,
          ],
          [
            "special_ped@bill@monologue_4@monologue_4d",
            "bill_ig_1_b_01_imofferingironclad_3",
            1,
          ],
          [
            "special_ped@bill@monologue_4@monologue_4e",
            "bill_ig_1_b_01_imofferingironclad_4",
            1,
          ],
          [
            "special_ped@bill@monologue_4@monologue_4f",
            "bill_ig_1_b_01_imofferingironclad_5",
            1,
          ],
          [
            "special_ped@bill@monologue_4@monologue_4g",
            "bill_ig_1_b_01_imofferingironclad_6",
            1,
          ],
        ],
        upper: false,
        loop: false,
      },
      {
        name: ("anim.c75ef92be4c52b49377c8056f5e67299"),
        id: "1b1d75987888b26e58068896528339b4",
        seq: [
          [
            "special_ped@clinton@monologue_10@monologue_10a",
            "this_country_used_to_0",
            1,
          ],
          [
            "special_ped@clinton@monologue_10@monologue_10b",
            "this_country_used_to_1",
            1,
          ],
          [
            "special_ped@clinton@monologue_10@monologue_10c",
            "this_country_used_to_2",
            1,
          ],
          [
            "special_ped@clinton@monologue_10@monologue_10d",
            "this_country_used_to_3",
            1,
          ],
        ],
        upper: false,
        loop: false,
      },
      {
        name: ("anim.74f1d55008269182478e32c81de53df9"),
        id: "0830713c72a46ec660db0316b646f6a6",
        seq: [
          [
            "special_ped@clinton@monologue_11@monologue_11a",
            "when_your_deep_in_0",
            1,
          ],
          [
            "special_ped@clinton@monologue_11@monologue_11b",
            "when_your_deep_in_1",
            1,
          ],
          [
            "special_ped@clinton@monologue_11@monologue_11c",
            "when_your_deep_in_2",
            1,
          ],
        ],
        upper: false,
        loop: false,
      },
      {
        name: ("anim.24aa9c17e287ee4175d04125c92d7265"),
        id: "11c359e7a2a40519b4f68d52708027fc",
        seq: [
          [
            "special_ped@clinton@monologue_13@monologue_13a",
            "charlies_coming_back_0",
            1,
          ],
          [
            "special_ped@clinton@monologue_13@monologue_13b",
            "charlies_coming_back_1",
            1,
          ],
          [
            "special_ped@clinton@monologue_13@monologue_13c",
            "charlies_coming_back_2",
            1,
          ],
        ],
        upper: false,
        loop: false,
      },
      {
        name: ("anim.167d38a70a215ac3e85c3879d55c673e"),
        id: "a852438eaa593d82653a87d3739ca02f",
        seq: [
          [
            "special_ped@clinton@monologue_14@monologue_14a",
            "you_know_what_they_0",
            1,
          ],
          [
            "special_ped@clinton@monologue_14@monologue_14b",
            "you_know_what_they_1",
            1,
          ],
          [
            "special_ped@clinton@monologue_14@monologue_14c",
            "you_know_what_they_2",
            1,
          ],
          [
            "special_ped@clinton@monologue_14@monologue_14d",
            "you_know_what_they_3",
            1,
          ],
          [
            "special_ped@clinton@monologue_14@monologue_14e",
            "you_know_what_they_4",
            1,
          ],
          [
            "special_ped@clinton@monologue_14@monologue_14f",
            "you_know_what_they_5",
            1,
          ],
        ],
        upper: false,
        loop: false,
      },
      {
        name: ("anim.d13d3e2ca95470d3c2172b1958d6448d"),
        id: "a9985a42363dff1f6cee188aa888b708",
        seq: [
          [
            "special_ped@clinton@monologue_2@monologue_2a",
            "theyll_kill_ya_0",
            1,
          ],
          [
            "special_ped@clinton@monologue_2@monologue_2b",
            "theyll_kill_ya_1",
            1,
          ],
          [
            "special_ped@clinton@monologue_2@monologue_2c",
            "theyll_kill_ya_2",
            1,
          ],
          [
            "special_ped@clinton@monologue_2@monologue_2d",
            "theyll_kill_ya_3",
            1,
          ],
          [
            "special_ped@clinton@monologue_2@monologue_2e",
            "theyll_kill_ya_4",
            1,
          ],
        ],
        upper: false,
        loop: false,
      },
      {
        name: ("anim.cbb44f490b0a63c13ef85a55be4245e6"),
        id: "01beb0338272ec4343a247e37f27aa96",
        seq: [
          ["special_ped@griff@monologue_1@monologue_1a", "iamnotaracist_0", 1],
          ["special_ped@griff@monologue_1@monologue_1b", "iamnotaracist_1", 1],
          ["special_ped@griff@monologue_1@monologue_1c", "iamnotaracist_2", 1],
          ["special_ped@griff@monologue_1@monologue_1d", "iamnotaracist_3", 1],
          ["special_ped@griff@monologue_1@monologue_1e", "iamnotaracist_4", 1],
          ["special_ped@griff@monologue_1@monologue_1f", "iamnotaracist_5", 1],
          ["special_ped@griff@monologue_1@monologue_1g", "iamnotaracist_6", 1],
          ["special_ped@griff@monologue_1@monologue_1h", "iamnotaracist_7", 1],
        ],
        upper: false,
        loop: false,
      },
      {
        name: ("anim.b7f11d4e26e8478cc5dcefe1772b9e5e"),
        id: "dfbac97d71bf2ae71ae97604863e523c",
        seq: [
          [
            "special_ped@jerome@monologue_2@monologue_2a",
            "iamyourtruesalvation_0",
            1,
          ],
          [
            "special_ped@jerome@monologue_2@monologue_2b",
            "iamyourtruesalvation_1",
            1,
          ],
          [
            "special_ped@jerome@monologue_2@monologue_2c",
            "iamyourtruesalvation_2",
            1,
          ],
          [
            "special_ped@jerome@monologue_2@monologue_2d",
            "iamyourtruesalvation_3",
            1,
          ],
          [
            "special_ped@jerome@monologue_2@monologue_2e",
            "iamyourtruesalvation_4",
            1,
          ],
          [
            "special_ped@jerome@monologue_2@monologue_2f",
            "iamyourtruesalvation_5",
            1,
          ],
          [
            "special_ped@jerome@monologue_2@monologue_2g",
            "iamyourtruesalvation_6",
            1,
          ],
          [
            "special_ped@jerome@monologue_2@monologue_2h",
            "iamyourtruesalvation_7",
            1,
          ],
          [
            "special_ped@jerome@monologue_2@monologue_2i",
            "iamyourtruesalvation_8",
            1,
          ],
        ],
        upper: false,
        loop: false,
      },
    ],
  },
];



export const WALKING_STYLES: { name: langData; id: string, animSet: string }[] = [
  {
    id: "Standard",
    name: "anim.bdfdd9da193ce880914db41c760032af",
    animSet: null
  },
  {
    id: "Alien",
    name: "anim.26f97a67a1c61e3cf9e9a1f6c1270931",
    animSet: "move_m@alien"
  },
  {
    id: "Hölzernes",
    name: "anim.2a15827332d6b1e01ca576639bae9d47",
    animSet: "anim_group_move_ballistic"
  },
  {
    id: "Entspannt",
    name: "anim.3b1cf2024eb4b662e826fd888ceaac5b",
    animSet: "move_f@arrogant@a"
  },
  {
    id: "Rahmen",
    name: "anim.6fa4b3940520c404ba307a593def84d7",
    animSet: "move_m@brave"
  },
  {
    id: "Zuversichtlich 2",
    name: "anim.deda9063e8610408074a1c38be71aaf4",
    animSet: "move_m@casual@a"
  },
  {
    id: "Seltsam",
    name: "anim.4c3b18e24900cbdd362847a9240ac216",
    animSet: "move_m@casual@b"
  },
  {
    id: "Beeil dich",
    name: "anim.1d469771b5c6e48a3ad55484aa5cfe64",
    animSet: "move_m@casual@c"
  },
  {
    id: "Tranquil",
    name: "anim.a6902139fd6f46cc2a21632ce9e8314a",
    animSet: "move_m@casual@d"
  },
  {
    id: "Freilaufend",
    name: "anim.2d4d552fd26514f18c273cc4ea26c1e8",
    animSet: "move_m@casual@e"
  },
  {
    id: "Stripper",
    name: "anim.a23276e47f035e8088ed71c83bafd5b8",
    animSet: "move_f@chichi"
  },
  {
    id: "Offiziell",
    name: "anim.127278ec96e9f154acdb443c3d32bafe",
    animSet: "move_m@confident"
  },
  {
    id: "Offiziell 2",
    name: "anim.1ed8935c0362d2f594f57e3964d9909b",
    animSet: "move_m@business@a"
  },
  {
    id: "Feminin",
    name: "anim.ad330c19085fad2d7427bc28dd064fcd",
    animSet: "move_f@multiplayer"
  },
  {
    id: "Couragiert",
    name: "anim.b968b73a39a9d00b546246036aae9479",
    animSet: "move_m@multiplayer"
  },
  {
    id: "Betrunken",
    name: "anim.357478911490ded585594ea68fe62afe",
    animSet: "move_m@drunk@a"
  },
  {
    id: "gestaffelt",
    name: "anim.bf5bfb5ce9beee2a2491230f5d026cfd",
    animSet: "move_m@drunk@slightlydrunk"
  },
  {
    id: "Stark betrunken",
    name: "anim.ce3a49487aa83d2a79fddb79f4c8fa42",
    animSet: "move_m@drunk@verydrunk"
  },
  {
    id: "Feminin 2",
    name: "anim.119d95a95879326ef0c011b237693287",
    animSet: "move_f@femme@"
  },
  {
    id: "Stier",
    name: "anim.9a5340d59d143752237426698179b7fe",
    animSet: "move_characters@franklin@fire"
  },
  {
    id: "Feminin 3",
    name: "anim.3cd7f501db461c0fa21b12c0c65dcf30",
    animSet: "move_f@flee@a"
  },
  {
    id: "Zuversichtlich 3",
    name: "anim.3fcd9b138e867341af275233d291962b",
    animSet: "move_p_m_one"
  },
  {
    id: "Gangster 1",
    name: "anim.a569c02ee80e65d50cae3030d61cea90",
    animSet: "move_m@gangster@generic"
  },
  {
    id: "Ältere Menschen",
    name: "anim.3d41e1c4154a20855ef51182dd441f36",
    animSet: "move_m@gangster@var_e"
  },
  {
    id: "Traurig",
    name: "anim.3093e8c100f7cf4089af0ae482fd0c9d",
    animSet: "move_m@gangster@var_f"
  },
  {
    id: "Beeil dich 2",
    name: "anim.8f7be648aee58c4e8526388d1835aabe",
    animSet: "move_m@gangster@var_i"
  },
  {
    id: "Twitchy",
    name: "anim.d6a1c7ae26e01da1c5210d7936577735",
    animSet: "anim@move_m@grooving@"
  },
  {
    id: "Stripper 2",
    name: "anim.aa8bfd56701963899469ecc5087e50b8",
    animSet: "move_f@heels@c"
  },
  {
    id: "Gangster 2",
    name: "anim.0d5a30d7fe6a9cdea982ebbe44f4c1ad",
    animSet: "move_m@hipster@a"
  },
  {
    id: "Vorsichtig",
    name: "anim.59a60d855b3b5e2687234ed89f886cd1",
    animSet: "move_f@hurry@a"
  },
  {
    id: "Rahmen 2",
    name: "anim.a95c57b7e0921af3f9659ccf3f504f81",
    animSet: "move_p_m_zero_janitor"
  },
  {
    id: "Gangster 3",
    name: "anim.3360e00f51382ec0d5fb0581a6daaa59",
    animSet: "move_p_m_zero_slow"
  },
  {
    id: "Stripper 3",
    name: "anim.bb137c80cb7ac5e363968a626c7c8f99",
    animSet: "move_f@maneater"
  },
  {
    id: "Gangster 4",
    name: "anim.9119bcdd161f084ce9d97f1707bcf147",
    animSet: "move_m@money"
  },
  {
    id: "Auf chille",
    name: "anim.54c1d2afbe52ee655e4811c07dda45d0",
    animSet: "move_m@muscle@a"
  },
  {
    id: "Feminin 4",
    name: "anim.d23d8db945fa067d38b42b448218c23b",
    animSet: "move_f@posh@"
  },
  {
    id: "Begowaja",
    name: "anim.7860ebe5b0aa69080bc0fb751f599caf",
    animSet: "move_m@quick"
  },
  {
    id: "Kippen",
    name: "anim.b8e33326d0f7212cf8f3f55a9d5db4de",
    animSet: "move_m@sad@a"
  },
  {
    id: "Ängstlich",
    name: "anim.b36d03f35d4a089093a35e9253049560",
    animSet: "move_f@scared"
  },
  {
    id: "Saksi",
    name: "anim.6e1655f57e54b7d3f3fcacd610b97f93",
    animSet: "move_f@sexy@a"
  },
  {
    id: "Gangster 5",
    name: "anim.48af7720509ed38a9374b9071e43db7b",
    animSet: "move_m@shadyped@a"
  },
  {
    id: "Sveg",
    name: "anim.2cd6eb35bc731d5c71f7eb6867aae244",
    animSet: "move_m@swagger"
  },
  {
    id: "Stier 2",
    name: "anim.6d218d8763e59a6a8353cd53e61813ad",
    animSet: "move_p_m_two"
  },
  {
    id: "Fett",
    name: "anim.d3854929a0144b22901a1487d87f1065",
    animSet: "move_m@bag"
  }
]