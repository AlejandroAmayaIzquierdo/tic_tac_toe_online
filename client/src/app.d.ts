// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	interface Locals {
		user: User | undefined;
		authToken: string | undefined;
	}
	// interface PageData {}
	// interface Error {}
	// interface Platform {}

	interface User {
		userName: string;
		userId: string;
	}
	interface Room {
		roomId: number;
		currentUsers: User[];
	}
}

declare namespace Api {

	interface StandardResp {
		status: number;
		result: unknown;
		error?: string;
	}
	interface Session {
		user: App.User;
		sessionId: string;
		activePeriodExpiresAt: string;
		idlePeriodExpiresAt: string;
		state: string;
		fresh: boolean;
	}

	interface Room {
		board: string[][];
		turn: string;
		done: boolean;
		winner: string | null;
	}
}
