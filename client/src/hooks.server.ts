import { authenticateUser } from "$lib/auth";
import { redirect, type Handle } from "@sveltejs/kit";


export const handle: Handle = async ({ event, resolve }) => {
    const auth = await authenticateUser(event);
    event.locals.user = auth?.user;
    event.locals.authToken = auth?.userToken;

    if (event.url.pathname.startsWith('/game/') || event.url.pathname === '/game') {
        // Accessing /game or /game/[id]
        if (!event.locals.user) {
            throw redirect(303, '/');
        }
    } else if (event.url.pathname !== '/') {
        // Redirect to home for any other path (except '/')
        throw redirect(303, '/');
    }


    const response = await resolve(event);

    return response;
}