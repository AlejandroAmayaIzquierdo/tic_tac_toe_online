

<script lang="ts">
	import { goto } from "$app/navigation";
	import Account from "$lib/Account.svelte";
	import { Cookies } from "../../util/Cookies";
    import type { PageData } from "./$types";
    import Icon from '@iconify/svelte';
    import loadingLoop from '@iconify/icons-line-md/loading-loop';

    export let data: PageData;

    let loading = false;

    const handleSearchGame = async () => {
        try {
            loading = true;
            const resp = await fetch('http://127.0.0.1:3000/game/searchGame', {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": Cookies.getCookie('auth') ?? ""
                }
            });
            const data = await resp.json() as Api.StandardResp;
            
            if(data.status === 0)
                return;

            const room = data.result as App.Room;

            if(room)
                goto(`game/${room.roomId}`);
        } catch (error) {
            loading = false;
        }

    }
</script>

<div class="h-full w-full absolute top-0 left-0 mx-auto flex justify-center items-center">
        {#if data.user}
            <Account user={data.user}/>
        {/if}
        <button on:click|preventDefault={handleSearchGame} class="btn bg-white/20 shadow-sm  rounded-md w-[150px]">
            {#if loading}
                <Icon icon={loadingLoop} />
            {:else}
                Search Game
            {/if}
        </button>


</div>