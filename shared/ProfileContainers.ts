export class BlizzardAccount {

    BattleTag: string;

    CreationDate: Date

    Orders: Array<Order> = new Array<Order>();

    SentGifts: Array<Gift> = new Array<Gift>();

    ReceivedGifts: Array<Gift> = new Array<Gift>();


    OverwatchPlayer: OverwatchPlayer = new OverwatchPlayer();

    OverwatchLootboxes: Array<OverwatchLootbox> = new Array<OverwatchLootbox>();

    BattlePassAppliedTierSkips: Array<BattlePassAppliedTierSkips> = new Array<BattlePassAppliedTierSkips>();

    PlayerMapStats: Array<PlayerMapStat> = new Array<PlayerMapStat>();

    PlayerAllHeroStats: Array<PlayerAllHeroStat> = new Array<PlayerAllHeroStat>();

    HeroStats: Array<HeroStat> = new Array<HeroStat>();

    Achievements: Array<string> = new Array<string>();
    
    RankedRoleData: Array<RankedRoleData> = new Array<RankedRoleData>();


    Warnings: Array<string> = new Array<string>();

    Errors: Array<string> = new Array<string>();
}

export class Order {
    OrderID: number;

    Time: Date;
    
    ProductName: string;

    Currency: string;

    Amount: number;

    Tax: number;

    Status: string;
}

export class Gift {
    BattleTag: string;

    Time: Date;

    Message: string;

    ProductName: string;
}

export class OverwatchPlayer {
    Experience: number;

    Level: number;

    RankedCurrency: number;

    EndorsementLevel: number;
}

export class OverwatchLootbox {
    LootboxID: string;

    Source: string;

    Level: number;

    Opened: boolean;

    Revoked: boolean;

    LootboxUnlocks: Array<OverwwatchLootboxUnlock>;
}

export class OverwwatchLootboxUnlock {
    LootboxID: string;

    UnlockSlot: number;

    UnlockType: UnlockType;

    UnlockName: string;

    OpenedAsDuplicate: boolean
}

export class BattlePassAppliedTierSkips {
    BattlePass: string;

    SkipAmount: number;

    Source: string;
}

export class PlayerMapStat {
    StatContextType: string;

    StatContextName: string;

    Map: string;

    Stat: string;

    Amount: number;
}

export class PlayerAllHeroStat {
    StatContextType: string;

    StatContextName: string;

    Stat: string;

    Amount: number;
}

export class HeroStat {
    Hero: string;

    StatContextType: string;

    StatContextName: string;

    Stat: string;

    Amount: number;
}

export class RankedRoleData {
    Ruleset: string;

    Role: string;

    SR: number;

    HighestSR: number;

    GamesPlayed: number;

    Rank: number;

    RankSubTier: number;

    HighestRank: number;

    HighestRankSubTier: number;

    HighestLeaderboardPosition: number;
}

export enum UnlockType {
    SprayPaint,
    SkinTheme,
    AvatarPortrait,
    VoiceLine,
    Currency,
    Pose,
    PotgAnimation,
    Emote
}