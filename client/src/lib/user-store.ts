
// userStore.ts

import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';


export const CurrentUser: Writable<App.User | null> = writable(null);

export function setUser(userData: App.User) {
    CurrentUser.set(userData);
}
