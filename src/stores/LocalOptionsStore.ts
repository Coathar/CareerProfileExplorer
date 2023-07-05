import { defineStore } from 'pinia';

export const useLocalOptionsStore = defineStore({
    id: 'localOptiosnStore',
    state: () => {
        if (localStorage.getItem("LocalOptions") && localStorage.getItem("LocalOptions") !== 'undefined') {
            return JSON.parse(localStorage.getItem("LocalOptions")!);
        }
      return {
        disabledAccounts: [] as string[],
        accountSort: [] as string[],
      };
    },
    actions: {
        accountIsEnabled(battleTag :string ) : boolean {
            return this.disabledAccounts.find((x: string) => x === battleTag) === undefined;
        },
        setAccountDisabled(battleTag: string, status: boolean) {
            if (status) {
                this.disabledAccounts.push(battleTag);
            } else {
                delete this.disabledAccounts[this.disabledAccounts.indexOf(battleTag)];
            }
        },
        addAccount(battleTag: string) {
            this.accountSort.push(battleTag);
        },
        removeAccount(battleTag: string) {
            delete this.disabledAccounts[this.disabledAccounts.indexOf(battleTag)];
            delete this.accountSort[this.disabledAccounts.indexOf(battleTag)];
        },
        moveToTopPriority(battleTag: string) {
            let index = this.accountSort.indexOf(battleTag);
            this.accountSort.unshift(this.accountSort.splice(index, 1)[0]);
        }
    }
  });