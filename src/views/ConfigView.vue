<script lang="ts" setup>
import { useAccountDataStore } from '@/stores/AccountDataStore';
import { useLocalOptionsStore } from '@/stores/LocalOptionsStore';

const accountStore = useAccountDataStore();

const optionsStore = useLocalOptionsStore();
</script>


<script lang="ts">
export default {
    methods: {
        fileChange(event: Event) {
            let files = (event.target as HTMLInputElement).files;
        
            if (files === null)
            {
                return;
            }

            let formData = new FormData();
            formData.append('file', files[0]);

            const store = useAccountDataStore();
            this.$refs.profileInput.disabled = true;
            this.$refs.loadingText.style.display = "inline";
            store.loadAccountData(formData).then((x: BlizzardAccount) => {
                store.addAccount(x);
                this.$refs.profileInput.disabled = false;
                this.$refs.profileInput.value = null;
                this.$refs.loadingText.style.display = "none";
            });
        },
        profileCheckboxChange(event: Event, battleTag: string) {
            const optionsStore = useLocalOptionsStore();
            optionsStore.setAccountDisabled(battleTag, !(event.target as HTMLInputElement).checked);
        },
        deleteAccount(account: BlizzardAccount) {
            const store = useAccountDataStore();
            store.removeAccount(account);
        },
        moveToTopPriority(account: BlizzardAccount) {
            const store = useLocalOptionsStore();
            store.moveToTopPriority(account.BattleTag);
        }
  }
}
</script>

<template>
    <div class="config-container title-font title-shadow">
        <h1>PROFILES</h1>
        <div>
            <table class="profileTable">
                <tbody>
                    <template v-for="account in accountStore.getAccounts">
                        <tr class="profileListRow">
                            <td><input type="checkbox" :checked='optionsStore.accountIsEnabled(account.BattleTag)' @change='(e) => profileCheckboxChange(e, account.BattleTag)'/></td>
                            <td><img class="playerIconList" v-bind:src="account.OverwatchPlayer.PlayerIconURL"></td>
                            <td class="profileListText title-font-bold ">{{ account.BattleTag.toUpperCase() }}</td>
                            <td><img class="playerIconButton" src="/src/assets/trash.svg" @click="(e) => deleteAccount(account)" /></td>
                            <td><img class="playerIconButton" src="/src/assets/caret-up.svg" @click="(e) => moveToTopPriority(account)"/></td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>
    </div>

    <div class="config-container title-font title-shadow">
        <h1>IMPORT</h1>
        <label for="file-upload" class="upload-button">Upload File</label>
        <input type="file" ref="profileInput" id="file-upload" @change="fileChange"/>
        <span ref="loadingText" class="loadingText">Loading...</span>
    </div>
</template>

<style scoped>
.config-container {
    width: 50vw;
}

.upload-button {
    background-color: var(--color-button-secondary);
    padding: 5px;
    font-size: 1.5rem;
    cursor: pointer;
}

.help-text {
    font-size: 1.1rem;
    margin-top: 5px;
}

.loadingText {
    display: none;
}

#file-upload {
    opacity: 0;
    position: absolute;
    z-index: -1;
}

.profileListRow {
    background-color: #fafdff;
    color: #1a2036;
    font-size: 24px;
    margin: 10px;
}

.profileListRow td {
    padding: 3px;
}

.profileTable {
    border-collapse: separate;
    border-spacing: 0 10px;
}

.profileListText {
    color: #1a2036;
}

.profileListRow img {
    display: block;
    margin: auto;
}

.playerIconList {
    height: 64px;
    width: 64px;
}

.playerIconButton {
    height: 24px;
    width: 24px;
}
</style>