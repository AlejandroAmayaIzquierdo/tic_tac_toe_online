

<script lang="ts">
    import Icon from '@iconify/svelte';
    import profileFill from '@iconify/icons-iconamoon/profile-fill';

    export let user: App.User;


    const handleLogOut = () => {}
</script>


<div class="absolute right-2 top-2 flex items-center rounded-xl backdrop-blur-xl shadow-xl bg-white/20 gap-4 px-2 sm:px-4 py-1 sm:py-2 sm:text-2xl">
    <Icon icon={profileFill} class="w-8 h-8 sm:w-12 sm:h-12 select-none rounded-full"/>
    <div class="flex flex-col items-start font-bold">
        <p class="max-w-[200px] overflow-hidden overflow-ellipsis whitespace-nowrap">
            {user.userName}
        </p> 
        <div class="flex items-center gap-2">
            <button on:click|preventDefault={handleLogOut}
            class="ml-1 origin-center text-right text-sm text-red-800 font-bold transition-transform hover:scale-105 active:scale-95">
                Log out
            </button>
        </div> 
    </div> 
</div>