import express from "express";
import * as cheerio from 'cheerio';
import { BattlePassAppliedTierSkips, BlizzardAccount, Gift, HeroStat, Order, OverwatchLootbox, OverwatchPlayer, OverwatchLootboxUnlock, PlayerMapStat, RankedRoleData, PlayerAllHeroStat } from "../shared/ProfileContainers";
import { parse } from 'csv-parse';
import cors from 'cors';
import axios from "axios";

class RankedRuleset {
    RulesetQueueName: string;

    FriendlyName: string;

    OverwatchVersion: number;

    SeasonNumber: number;
}

class StatContextRuleset {
    StatContextType: string;

    StatContextName: string;

    FriendlyName: string;

    OverwatchVersion: number;

    SeasonNumber: number;

    Type: string;
}

interface ResourceKeyValue {
    ResourceKey: string;

    Value: string;
}

interface AvatarData {
    id: string;

    name: string;

    icon: string;
}

const multer  = require('multer');
const os  = require('os');
const fs  = require('fs');
const upload = multer({ dest: os.tmpdir() });
const app = express();
const port = 8080; // default port to listen

app.use(cors());

let CachedRankedRulesets: Array<RankedRuleset> = new Array<RankedRuleset>();
let CachedStatContextRulesets: Array<StatContextRuleset> = new Array<StatContextRuleset>();
let CachedResourceKeyValues: Array<ResourceKeyValue> = new Array<ResourceKeyValue>();
let CachedAvatarValues: Array<AvatarData> = new Array<AvatarData>();

let CachedBlizzardAccounts: Array<BlizzardAccount> = new Array<BlizzardAccount>();
// Load resource values
(() => {
    if (fs.existsSync("./Storage.json")) {
        CachedBlizzardAccounts = JSON.parse(fs.readFileSync("./Storage.json", { encoding: 'utf-8' }))
    }
    const rankedRuleLookupContent = fs.readFileSync("./resources/RankedRulesetLookup.csv", { encoding: 'utf-8' });
  
    parse(rankedRuleLookupContent, {
      delimiter: ',',
      comment: '#',
      columns: ['RulesetQueueName', 'FriendlyName', 'OverwatchVersion', 'SeasonNumber'],
      skip_empty_lines: true

    }, (error, parsed) => {
      if (error) {
        console.error(error);
      }

      CachedRankedRulesets = parsed;
      console.log(`Loaded ${CachedRankedRulesets.length} ranked rulesets`);

    });

    const statContextRulesetContent = fs.readFileSync("./resources/StatContextRulesetLookup.csv", { encoding: 'utf-8' });
  
    parse(statContextRulesetContent, {
      delimiter: ',',
      comment: '#',
      columns: ['StatContextType', 'StatContextName', 'FriendlyName', 'OverwatchVersion', 'SeasonNumber', 'Type'],
      skip_empty_lines: true

    }, (error, parsed) => {
      if (error) {
        console.error(error);
      }

      CachedStatContextRulesets = parsed;
      console.log(`Loaded ${CachedStatContextRulesets.length} stat contexts`);
    });

    const resourceKeyValuesContent = fs.readFileSync("./resources/ResourceKeyValues.json", { encoding: 'utf-8' });

    CachedResourceKeyValues = JSON.parse(resourceKeyValuesContent);
    console.log(`Loaded ${CachedResourceKeyValues.length} resource keys`);

    axios.get("https://overwatch.blizzard.com/en-us/search/").then(res => {
        const $ = cheerio.load(res.data);
        const searchScript = $('script:contains("avatars")').text() + "\nexport { avatars };";
        fs.writeFileSync('avatar.ts', searchScript);

        var loaded = require("./avatar");

        Object.keys(loaded.avatars).forEach(x => {
            let data = {} as AvatarData;
            let avatar = loaded.avatars[x];

            data.icon = avatar.icon;
            data.id = avatar.id;
            data.name = avatar.name;

            CachedAvatarValues.push(data);
        })

        console.log(`Loaded ${CachedAvatarValues.length} player icons`);
    });

})();

app.post('/upload', upload.single('file'), function(req, res) {
    const { file } = req;

    if (!file) {
        res.status(500).send({ error: 'No file provided' });
        return
    }

    console.log("Processing new file " + file.originalname);

    const $ = cheerio.load(fs.readFileSync(file.path, 'utf8'));
    const returnObject = new BlizzardAccount();
    const startTime = Date.now();
    try {
        tryLoadBnetAccountInfo($, returnObject);

        tryLoadDataTable($, returnObject, "Battle.net Account Purchase Data", "Orders", false, (dataCells) => {
                let order = new Order(tryGetInt($, dataCells[0]),
                    tryGetDate($, dataCells[1]),
                    tryGetString($, dataCells[2]), 
                    tryGetString($, dataCells[3]), 
                    tryGetFloat($, dataCells[4]), 
                    tryGetFloat($, dataCells[5]), 
                    tryGetString($, dataCells[6]));

                returnObject.Orders.push(order);
        });

        tryLoadDataTable($, returnObject, "Battle.net Account Purchase Data","Sent Gifts", false, (dataCells) => {
            returnObject.SentGifts.push(new Gift(tryGetString($, dataCells[0]),
                tryGetDate($, dataCells[1]),
                tryGetString($, dataCells[2]), 
                tryGetString($, dataCells[3])));
        });

        tryLoadDataTable($, returnObject, "Battle.net Account Purchase Data","Received Gifts", false, (dataCells) => {
            returnObject.ReceivedGifts.push(new Gift(tryGetString($, dataCells[0]),
                tryGetDate($, dataCells[1]),
                tryGetString($, dataCells[2]), 
                tryGetString($, dataCells[3])));
        });

        tryLoadDataTable($, returnObject, "Overwatch PC", "Player", true, (dataCells) => {
            returnObject.OverwatchPlayer = new OverwatchPlayer(tryGetString($, dataCells[1]),
                tryGetAvatarURL($, dataCells[1]),
                tryGetInt($, dataCells[0]),
                tryGetInt($, dataCells[5]),
                tryGetInt($, dataCells[7]), 
                tryGetInt($, dataCells[33]));
        });

        tryLoadDataTable($, returnObject, "Overwatch PC", "Player Lootbox", false, (dataCells) => {
            returnObject.OverwatchLootboxes.push(new OverwatchLootbox(tryGetString($, dataCells[0]),
                tryGetString($, dataCells[2]),
                tryGetInt($, dataCells[3]), 
                tryGetBoolean($, dataCells[4]),
                tryGetBoolean($, dataCells[5])));
        });

        tryLoadDataTable($, returnObject, "Overwatch PC", "Player Lootbox Unlock", false, (dataCells) => {
            let lootboxUnlock = new OverwatchLootboxUnlock(tryGetString($, dataCells[0]),
                tryGetInt($, dataCells[1]),
                tryGetString($, dataCells[2]), 
                tryGetString($, dataCells[3]),
                tryGetBoolean($, dataCells[4]));

            returnObject.OverwatchLootboxes.find((x) => x.LootboxID === lootboxUnlock.LootboxID).LootboxUnlocks.push(lootboxUnlock);
        });
        
        tryLoadDataTable($, returnObject, "Overwatch PC", "Player Battle Pass Applied Tier Skips", false, (dataCells) => {
            returnObject.BattlePassAppliedTierSkips.push(new BattlePassAppliedTierSkips(tryGetString($, dataCells[0]),
                tryGetInt($, dataCells[1]),
                tryGetString($, dataCells[2])));
        });

        tryLoadDataTable($, returnObject, "Overwatch PC", "Player Map Stat", true, (dataCells) => {
            const statContextType = tryGetString($, dataCells[0]);
            const statContextName = tryGetString($, dataCells[1]);

            const targetStatContextRuleset = CachedStatContextRulesets.find(x => x.StatContextType === statContextType && x.StatContextName === statContextName);

            if (targetStatContextRuleset === undefined) {
                console.warn(`No matching stat ruleset found for ${statContextType},${statContextName}`);
                return;
            }

            returnObject.PlayerMapStats.push(new PlayerMapStat(targetStatContextRuleset.FriendlyName,
                targetStatContextRuleset.SeasonNumber,
                targetStatContextRuleset.OverwatchVersion,
                tryGetString($, dataCells[2]),
                tryGetString($, dataCells[3]),
                targetStatContextRuleset.Type,
                tryGetFloat($, dataCells[4])));
        });

        tryLoadDataTable($, returnObject, "Overwatch PC", "Player All Hero Stat", true, (dataCells) => {
            const statContextType = tryGetString($, dataCells[0]);
            const statContextName = tryGetString($, dataCells[1]);

            const targetStatContextRuleset = CachedStatContextRulesets.find(x => x.StatContextType === statContextType && x.StatContextName === statContextName);

            if (targetStatContextRuleset === undefined) {
                console.warn(`No matching stat ruleset found for ${statContextType},${statContextName}`);
                return;
            }

            returnObject.PlayerAllHeroStats.push(new PlayerAllHeroStat(targetStatContextRuleset.FriendlyName,
                targetStatContextRuleset.SeasonNumber,
                targetStatContextRuleset.OverwatchVersion,
                tryGetString($, dataCells[2]),
                targetStatContextRuleset.Type,
                tryGetFloat($, dataCells[3])));
        });

        tryLoadDataTable($, returnObject, "Overwatch PC", "Hero Stat", true, (dataCells) => {
            
            const statContextType = tryGetString($, dataCells[1]);
            const statContextName = tryGetString($, dataCells[2]);

            const targetStatContextRuleset = CachedStatContextRulesets.find(x => x.StatContextType === statContextType && x.StatContextName === statContextName);

            if (targetStatContextRuleset === undefined) {
                console.warn(`No matching stat ruleset found for ${statContextType},${statContextName}`);
                return;
            }

            returnObject.HeroStats.push(new HeroStat(targetStatContextRuleset.FriendlyName,
                targetStatContextRuleset.SeasonNumber,
                targetStatContextRuleset.OverwatchVersion,
                tryGetString($, dataCells[0]),
                tryGetString($, dataCells[3]),
                targetStatContextRuleset.Type,
                tryGetFloat($, dataCells[4])));
        });

        tryLoadDataTable($, returnObject, "Overwatch PC", "Player Ranked Role Data", true, (dataCells) => {
            const rulesetName = tryGetString($, dataCells[0]);
            const targetRuleset = CachedRankedRulesets.find(x => x.RulesetQueueName === rulesetName);

            if (targetRuleset === undefined) {
                console.warn(`No matching ruleset found for ${rulesetName}`);
                return;
            }

            const role = tryGetString($, dataCells[3]).replace(" - DND", "");

            returnObject.RankedRoleData.push(new RankedRoleData(targetRuleset.FriendlyName,
                targetRuleset.SeasonNumber,
                targetRuleset.OverwatchVersion,
                role,
                tryGetInt($, dataCells[4]),
                tryGetInt($, dataCells[5]),
                tryGetInt($, dataCells[6]),
                tryGetInt($, dataCells[7]),
                tryGetInt($, dataCells[8]),
                tryGetInt($, dataCells[9]),
                tryGetInt($, dataCells[10]),
                tryGetInt($, dataCells[11]))
            );
        });

    } catch (e) {
        returnObject.Errors.push(e.message);
        console.error(e.message);
    }


    console.log("Done");
    console.log(`Took ${Math.abs(Date.now() - startTime)}ms`);

    removeAccount(returnObject.BattleTag);

    CachedBlizzardAccounts.push(returnObject);

    fs.writeFile("./Storage.json", JSON.stringify(CachedBlizzardAccounts), err => {
        if (err) {
            console.error(err);
        }
    });

    res.json(returnObject);

    //res.sendStatus(200);
});

app.get('/getAccounts', function(req, res) { 
    res.json(CachedBlizzardAccounts);
});

app.delete('/removeAccount/:battleTag', function(req, res) { 
    if (req.params.battleTag !== undefined) {
        removeAccount(req.params.battleTag);
        res.sendStatus(200);
        return;
    }

    res.sendStatus(400)
});

function removeAccount(battleTag: string) {
    const existingAcount = CachedBlizzardAccounts.find(x => x.BattleTag === battleTag)

    if (existingAcount !== undefined) {
        console.log("Updating existing account");
        for (let i = CachedBlizzardAccounts.length - 1; i >= 0; i--) {
            if (CachedBlizzardAccounts[i] === existingAcount) {
              CachedBlizzardAccounts.splice(i, 1);
              break;
            }
        }
    }
}

function tryLoadBnetAccountInfo($: any, returnObject: BlizzardAccount) {
    // Find BattleTag & Email
    let table = $("h2:contains('Battle.net Account')").next();

    if (table === undefined || table.length === 0) {
        throw new Error("Unable to find Battle.net Account info");
    } else {
        returnObject.BattleTag = table.find("td:contains('BattleTag')").next().text().trim()
        returnObject.CreationDate = new Date(table.find("td:contains('Account Create Date')").next().text().trim());
    }
}

function tryLoadDataTable($: any, returnObject: BlizzardAccount, primaryHeaderText: string, secondaryHeaderText: string, warning: boolean, dataSetter: (table: any) => void) {
    let secondaryHeader = $(`h1:contains('${primaryHeaderText}')`).nextUntil(`h1`).filter("h2").filter(function() {
        return $(this).text().trim() === secondaryHeaderText;
    } );

    let table;

    if (secondaryHeader === null) {
        secondaryHeader = $(`h2:contains('${secondaryHeaderText}')`);
        table = secondaryHeader.first().next();
    } else {
        table = secondaryHeader.first().next();
    }

    if (table === undefined || table.length === 0)
    {
        if (warning) {
            // console.warn(`Unable to find table for header: '${secondaryHeaderText}'`);
            returnObject.Warnings.push(`Unable to find table for header: '${secondaryHeaderText}'`);
        } 
    }
    else
    {
        console.info(`Loading ${table.find("tbody tr").length} rows for table ${secondaryHeaderText}`);
        table.find("tbody tr").each((i, e) => {
            dataSetter.call(this, $(e).find("td").toArray());
        })
    }
}

function tryGetString($: any, element: cheerio.Element, lookupResource = true) {
    let value = $(element).text().trim();

    if (lookupResource && value.includes("0x")) {
        const cachedValue = CachedResourceKeyValues.find(x => x.ResourceKey === value);
        if (cachedValue !== undefined) {
            value = cachedValue.Value;
        } else {
            // console.warn(`Attempted lookup for ${value} but couldn't find it!`);
        }
    } 

    return value;
}

function tryGetInt($: any, element: cheerio.Element) {
    return parseInt($(element).text().trim());
}

function tryGetFloat($: any, element: cheerio.Element) {
    return parseFloat($(element).text().trim());
}

function tryGetDate($: any, element: cheerio.Element) {
    return new Date($(element).text().trim());
}

function tryGetBoolean($: any, element: cheerio.Element) {
    var value = $(element).text().trim();

    return value.toLowerCase() === "yes" || value === "1" || value.toLowerCase() === "true";
}

function tryGetAvatarURL($: any, element: cheerio.Element) {
    const targetAvatar = CachedAvatarValues.find(x => x.name == tryGetString($, element));

    if (targetAvatar !== undefined) {
        return targetAvatar.icon;
    }

    return CachedAvatarValues.find(x => x.name === "Overwatch Dark").icon;
}

// start the Express server
app.listen( port, () => {
    console.log( `server started at http://localhost:${ port }` );
} );