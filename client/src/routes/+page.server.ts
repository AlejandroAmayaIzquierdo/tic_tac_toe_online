import type { PageServerLoad } from './$types';

export const load = (async ({locals}) => {
    return {
        user: locals.user,
        authToken: locals.authToken
    };
}) satisfies PageServerLoad;