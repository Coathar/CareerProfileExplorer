import { BlizzardAccount } from "/shared/ProfileContainers";
import { defineStore } from 'pinia';
import { useLocalOptionsStore } from '@/stores/LocalOptionsStore';

const apiUrl = "http://localhost:8080";

export const useAccountDataStore = defineStore({
    id: 'accountDataStore',
    state: () => {
      return {
        accounts: [] as BlizzardAccount[],
      };
    },
    getters: {
      getAccounts() : BlizzardAccount[] {
        const optionsStore = useLocalOptionsStore();
        this.accounts.sort(function(x, y) {
          return optionsStore.accountSort.indexOf(x.BattleTag) - optionsStore.accountSort.indexOf(y.BattleTag);
        });

        return this.accounts;
      }
    },
    actions: {
      async fetchAllAccounts() {
        const result = await fetch(`${apiUrl}/getAccounts`);
        const data = await result.json();
        this.accounts = data;
        const optionsStore = useLocalOptionsStore();

        this.accounts.forEach(x => optionsStore.addAccount(x.BattleTag));
      },
      getEnabledAccounts() {
        const optionsStore = useLocalOptionsStore();

        return this.accounts.filter(x => !optionsStore.disabledAccounts.includes(x.BattleTag));
      },
      loadAccountData(formData: FormData): Promise<BlizzardAccount> {
        const options: RequestInit= {
              method: "POST",
              body: formData
            }
            return fetch( `${apiUrl}/upload`, options).then(async (res) => {
              if (res.ok) {
                return res.json();
              } else {
                throw res.json().then((res) => new Error(res.message));
              }
            });
      },
      addAccount(account: BlizzardAccount) {
        this.accounts.filter((x: BlizzardAccount) => x.BattleTag === account.BattleTag)
          .forEach((x: BlizzardAccount) => this.removeAccount(x));

        this.accounts.push(account);

        const optionsStore = useLocalOptionsStore();
        optionsStore.addAccount(account.BattleTag);
      },
      removeAccount(account: BlizzardAccount) {
        fetch(`${apiUrl}/removeAccount/${encodeURIComponent(account.BattleTag)}`, { method: 'DELETE' });

        for (let i = this.accounts.length - 1; i >= 0; i--) {
          if (this.accounts[i] === account) {
            this.accounts.splice(i, 1);
            break;
          }
        }

        const optionsStore = useLocalOptionsStore();
        optionsStore.removeAccount(account.BattleTag);
      }
    }  
  });