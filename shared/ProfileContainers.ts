export class BlizzardAccount {

    BattleTag: string;

    CreationDate: Date;

    Orders: Array<Order> = new Array<Order>();

    SentGifts: Array<Gift> = new Array<Gift>();

    ReceivedGifts: Array<Gift> = new Array<Gift>();

    OverwatchPlayer: OverwatchPlayer | undefined = undefined;

    OverwatchLootboxes: Array<OverwatchLootbox> = new Array<OverwatchLootbox>();

    BattlePassAppliedTierSkips: Array<BattlePassAppliedTierSkips> = new Array<BattlePassAppliedTierSkips>();

    PlayerMapStats: Array<PlayerMapStat> = new Array<PlayerMapStat>();

    PlayerAllHeroStats: Array<PlayerAllHeroStat> = new Array<PlayerAllHeroStat>();

    HeroStats: Array<HeroStat> = new Array<HeroStat>();

    Achievements: Array<string> = new Array<string>();
    
    RankedRoleData: Array<RankedRoleData> = new Array<RankedRoleData>();

    Warnings: Array<string> = new Array<string>();

    Errors: Array<string> = new Array<string>();

    constructor() {
        this.BattleTag = "";
        this.CreationDate = new Date(0);
    }
}

export class Order {
    OrderID: number;

    Time: Date;
    
    ProductName: string;

    Currency: string;

    Amount: number;

    Tax: number;

    Status: string;

    constructor(orderID: number, time: Date, productName: string, currency: string, amount: number, tax: number, status: string) {
        this.OrderID = orderID;
        this.Time = time;
        this.ProductName = productName;
        this.Currency = currency;
        this.Amount = amount;
        this.Tax = tax;
        this.Status = status;
    }
}

export class Gift {
    BattleTag: string;

    Time: Date;

    Message: string;

    ProductName: string;

    constructor(battleTag: string, time: Date, message: string, productName: string) {
        this.BattleTag = battleTag;
        this.Time = time;
        this.Message = message;
        this.ProductName = productName;
    }
}

export class OverwatchPlayer {
    PlayerIcon: string;

    PlayerIconURL: string;

    Experience: number;

    Level: number;

    RankedCurrency: number;

    EndorsementLevel: number;

    constructor(playerIcon: string, playerIconURL: string, experience: number, level: number, rankedCurrency: number, endorsementLevel: number) {
        this.PlayerIcon = playerIcon;
        this.PlayerIconURL = playerIconURL;
        this.Experience = experience;
        this.Level = level;
        this.RankedCurrency = rankedCurrency;
        this.EndorsementLevel = endorsementLevel;
    }
}

export class OverwatchLootbox {
    LootboxID: string;

    Source: string;

    Level: number;

    Opened: boolean;

    Revoked: boolean;

    LootboxUnlocks: Array<OverwatchLootboxUnlock>;

    constructor(lootboxID: string, source: string, level: number, opened: boolean, revoked: boolean) {
        this.LootboxID = lootboxID;
        this.Source = source;
        this.Level = level;
        this.Opened = opened;
        this.Revoked = revoked;

        this.LootboxUnlocks = new Array<OverwatchLootboxUnlock>();
    }
}

export class OverwatchLootboxUnlock {
    LootboxID: string;

    UnlockSlot: number;

    UnlockType: string;

    UnlockName: string;

    OpenedAsDuplicate: boolean

    constructor(lootboxID: string, unlockSlot: number, unlockType: string, unlockName: string, openedAsDuplicate: boolean) {
        this.LootboxID = lootboxID;
        this.UnlockSlot = unlockSlot;
        this.UnlockType = unlockType;
        this.UnlockName = unlockName;
        this.OpenedAsDuplicate = openedAsDuplicate;
    }
}

export class BattlePassAppliedTierSkips {
    BattlePass: string;

    SkipAmount: number;

    Source: string;

    constructor(battlePass: string, skipAmount: number, source: string) {
        this.BattlePass = battlePass;
        this.SkipAmount = skipAmount;
        this.Source = source;
    }
}

export class PlayerMapStat {
    Name: string;

    Season: number;

    OverwatchVersion: number;

    Map: string;

    Stat: string;

    Type: string;

    Amount: number;

    constructor(name: string, season: number, overwatchVersion: number, map: string, stat: string, type: string, amount: number) {
        this.Name = name;
        this.Season = season;
        this.OverwatchVersion = overwatchVersion;
        this.Map = map;
        this.Stat = stat;
        this.Type = type;
        this.Amount = amount;

        const rpl = new RegExp(/Rpl \{0\}:(.+?):(.+?);/g);

        if (rpl.test(this.Stat)) {
            rpl.lastIndex = 0;
            let matches = rpl.exec(this.Stat)
            if (matches != null) {
                if (this.Amount === 1.0) {
                    this.Stat = this.Stat.replace(rpl, matches[1]);
                } else {
                    this.Stat = this.Stat.replace(rpl, matches[2]);
                }
            }
        }
    }
}

export class PlayerAllHeroStat {
    Name: string;

    Season: number;

    OverwatchVersion: number;

    Stat: string;

    Type: string;

    Amount: number;

    constructor(name: string, season: number, overwatchVersion: number, stat: string, type: string, amount: number) {
        this.Name = name;
        this.Season = season;
        this.OverwatchVersion = overwatchVersion;
        this.Stat = stat;
        this.Type = type;
        this.Amount = amount;

        const rpl = new RegExp(/Rpl \{0\}:(.+?):(.+?);/g);

        if (rpl.test(this.Stat)) {
            rpl.lastIndex = 0;
            let matches = rpl.exec(this.Stat)
            if (matches != null) {
                if (this.Amount === 1.0) {
                    this.Stat = this.Stat.replace(rpl, matches[1]);
                } else {
                    this.Stat = this.Stat.replace(rpl, matches[2]);
                }
            }
        }
    }
}

export class HeroStat {
    Name: string;

    Season: number;

    OverwatchVersion: number;

    Hero: string;

    Stat: string;

    Type: string;

    Amount: number;

    constructor(name: string, season: number, overwatchVersion: number, hero: string, stat: string, type: string, amount: number) {
        this.Name = name;
        this.Season = season;
        this.OverwatchVersion = overwatchVersion;
        this.Hero = hero;
        this.Type = type;
        this.Stat = stat;
        this.Amount = amount;

        const rpl = new RegExp(/Rpl \{0\}:(.+?):(.+?);/g);

        if (rpl.test(this.Stat)) {
            rpl.lastIndex = 0;
            let matches = rpl.exec(this.Stat)
            if (matches != null) {
                if (this.Amount === 1.0) {
                    this.Stat = this.Stat.replace(rpl, matches[1]);
                } else {
                    this.Stat = this.Stat.replace(rpl, matches[2]);
                }
            }
        }
    }
}

export class RankedRoleData {
    Name: string;

    Season: number;

    OverwatchVersion: number;

    Role: string;

    SR: number;

    HighestSR: number;

    GamesPlayed: number;

    Rank: number;

    RankSubTier: number;

    HighestRank: number;

    HighestRankSubTier: number;

    HighestLeaderboardPosition: number;

    constructor(name: string, season: number, overwatchVersion: number, role: string, sr: number, highestSR: number, gamesPlayed: number, rank: number, rankSubTier: number, highestRank: number, highestRankSubTier: number, highestLeaderboardPosition: number) {
        this.Name = name;
        this.Season = season;
        this.OverwatchVersion = overwatchVersion;
        this.Role = role;
        this.SR = sr;
        this.HighestSR = highestSR;
        this.GamesPlayed = gamesPlayed;
        this.Rank = rank;
        this.RankSubTier = rankSubTier;
        this.HighestRank = highestRank;
        this.HighestRankSubTier = highestRankSubTier;
        this.HighestLeaderboardPosition = highestLeaderboardPosition;
    }
}