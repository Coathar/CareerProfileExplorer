<script lang="ts" setup>
import { useAccountDataStore } from '@/stores/AccountDataStore';
import { HeroStat } from "@/shared/ProfileContainers";
import { getRoundedHoursFromSeconds } from "@/util.ts";
import { useLocalOptionsStore } from '@/stores/LocalOptionsStore';
const accountStore = useAccountDataStore();
const optionsStore = useLocalOptionsStore();

const modeToColor = {
    'Competitive': "#ec3e68",
    'Unranked': "#0aa4ff",
    'Arcade': "#0ac20a",
    'Experimental': "#fc6415",
}

const playtime = getTimePlayedBreakdown();

function getTimePlayedBreakdown() {
            const accountStore = useAccountDataStore();
            const playtime = {
                Competitive: 0,
                Unranked: 0,
                Arcade: 0,
                Experimental: 0,
                Total: 0
            };

            accountStore.getEnabledAccounts().forEach(x => x.HeroStats.filter((hs: HeroStat) => hs.Stat === "Time Played").forEach((y: HeroStat) => {
                if (y.Type === "Competitive") {
                    playtime.Competitive += y.Amount;
                } else if (y.Type ==="Unranked") {
                    playtime.Unranked += y.Amount;
                } else if (y.Type === "Experimental") {
                    playtime.Experimental += y.Amount;
                } else if (y.Type === "Arcade") {
                    playtime.Arcade += y.Amount;
                }
            }));

            playtime.Total = getRoundedHoursFromSeconds(playtime.Arcade + playtime.Competitive + playtime.Unranked + playtime.Experimental);
            
            console.log(`Comp ${playtime.Competitive / 60 / 60}`);
            console.log(`Unranked ${playtime.Unranked / 60 / 60}`);
            console.log(`Arcade ${playtime.Arcade / 60 / 60}`);
            console.log(`Experimental ${playtime.Experimental / 60 / 60}`);
            return playtime;
        }

</script>

<template>
    <div class="time-played-container">
        <div class="total-time-background">
            <p class="time-played-title title-font-regular">TIME PLAYED</p>
            <p class="time-played-text title-font">{{ playtime.Total.toLocaleString() }} HRS</p>
        </div>
        <div class="playtime-breakdown">
            <template v-for="time in Object.entries(playtime).filter(x => x[0] !== 'Total')">
                <div class="playtime-entry" :style="'background-color: ' + modeToColor[time[0]]">
                    <div class="playtime-game-icon" ><img :src="'./img/' + time[0] + '.png'" /></div>
                    <div class="playtime-entry-mode title-font">{{ time[0].toUpperCase() }}</div>
                    <div class="playtime-entry-hours title-font">{{ getRoundedHoursFromSeconds(time[1]).toLocaleString() }} HRS</div>
                </div>
            </template>
        </div>
    </div>
</template>

<style scoped>
.total-time-background {
  margin-top: 2rem;
  margin-bottom: 2rem;
  width: 15rem;
  height: 15rem;
  margin-left: auto;
  margin-right: auto;
  padding: 1.5rem;
  display: grid;
  place-items: center;
  aspect-ratio: 1/1;
  border-radius: 50%;
  font-size: 1.5em;
  color: white;
  background-color: #475569;
  border: .4rem solid #7ea2ce;
  box-shadow: 0 0 0 .3rem #475569;
  align-content: center;
}

.time-played-container {
    width: 24rem;
    margin-top: 4rem;
    margin-left: 1rem;
    border-radius: 3px;
    background-color: #b1bbce;
}

.time-played-title {
    font-size: 1.3rem;
}

.time-played-text {
    font-size: 2rem;
    color: #1afefe;
}

.playtime-breakdown {
    margin-left: 2rem;
    margin-right: 2rem;
}

.playtime-entry {
    font-size: 1.2rem;
    display: flex;
    margin-top: 10px;
    margin-bottom: 10px;
    padding: 5px;
}

.playtime-entry-unranked:after {
    content: '\A';
    position: absolute;
    background: black;
    top: 0; bottom: 0;
    left: 0; 
    width: 50%; /* End width.. */
    -webkit-animation: filler 2s ease-in-out;
    -moz-animation: filler 2s ease-in-out;
    animation: filler 2s ease-in-out;
}

.playtime-entry > * {
    margin-left: 10px;
    margin-right: 10px;
}

.playtime-entry-hours {
    margin-left: auto;
}

.playtime-game-icon  {
    display: flex;
    justify-content: center;
}

.playtime-game-icon img {
    width: 32px;
    height: 32px;
}
</style>