
/// <reference types="App" />
declare namespace App {
	interface StandarFact {
		id: number;
		category: categories;
		fact: string;
	}
	
	type categories = "cats" | "dogs";

	interface CronTask {
		handle();
	}

	interface DbCron {
		id: number;
		name: string;
		schedule: string;
		is_active: number;
		lastEnd: string | null;
	}
}


/// <reference types="lucia" />
declare namespace Lucia {
	type Auth = import("./lucia.js").Auth;
	type DatabaseUserAttributes = {
		userName: string;
	};
	type DatabaseSessionAttributes = {};

	interface User {
		userId: string;
		providerId: string;
		providerUserId: string;
		passwordDefined: boolean;
	}
	interface Session {
		user: User;
		sessionId: string;
        activePeriodExpiresAt: string;
        idlePeriodExpiresAt: string;
        state: string;
        fresh: boolean;
	}
	type Providers = "id";
}

/// <reference types="Api" />
declare namespace Api {
	interface Response {
		status: number;
		error?: string | number | object | boolean | unknown;
		result?: string | number | object | boolean | unknown;
	}
	interface RegisterUserBody {
		userName: string;
		password: string;
	}
	interface Error {
		code: number;
		message: string;
	}

	interface Room {
		id: number;
		players: string;
		maxUsers: number;
		isActive: number;
		isEnded: number;
		endedAt: string;
	}
}
  