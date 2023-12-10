<!-- YOU CAN DELETE EVERYTHING IN THIS PAGE -->

<script lang="ts">
	import { goto } from "$app/navigation";
	import Account from "$lib/Account.svelte";
    import { Cookies } from "../util/Cookies";
	import type { PageData } from "./$types";

    export let data: PageData;

    let userName: string;

	const handleLogIn = async () => {
    try {
        const body = {
            userName: userName,
            password: "password"
        };

        const resp = await fetch('http://127.0.0.1:3000/user/login', {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        });
		const dataResp = await resp.json() as Api.StandardResp;

        if (dataResp.status === 0) {
            // Handle error here, e.g., show an error message
            console.error("Login failed:", dataResp.error);
            return;
        }

        const session = dataResp.result as Api.Session;
        Cookies.setCookie('auth', session.sessionId, 10);
        goto('/');
    } catch (error) {
        console.error("Error during login:", error);
        // Handle the error, e.g., show an error message to the user
    }
};

</script>
<div class="h-full w-full absolute top-0 left-0 mx-auto flex justify-center items-center">
    {#if !data.user}
        <div>
            <label for="first_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">UserName</label>
            <input bind:value={userName} type="text" id="first_name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John" required>
        </div>
        <button on:click|preventDefault={handleLogIn} class="btn bg-white/20 shadow-sm  rounded-md">
            Log In
        </button>
    {:else}
        <Account user={data.user}/>
    {/if}

</div>
