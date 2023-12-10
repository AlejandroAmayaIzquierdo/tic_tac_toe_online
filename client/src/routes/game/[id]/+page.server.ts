import type { PageServerLoad } from './$types';

export const load = (async ({params,locals}) => {
    const {id} = params;

    return {
        id,
        authToken: locals.authToken
    };
}) satisfies PageServerLoad;