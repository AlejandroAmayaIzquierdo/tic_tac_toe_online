
<script lang="ts">
	import Board from "$lib/Board.svelte";
    import Icon from '@iconify/svelte';
    import loadingLoop from '@iconify/icons-line-md/loading-loop';
    import arrowLeft from '@iconify/icons-fa/arrow-left';

	import { onMount } from "svelte";
	import type { PageData } from "./$types";
    import { io } from "socket.io-client";
	import { goto } from "$app/navigation";

    export let data: PageData

    $: {
        if(!data.authToken)
            goto('/game');
    }

    const socket = io('ws://localhost:3000',{
        extraHeaders: {
            Authorization: data.authToken ?? ""
        }
    });

    onMount(() => {
        socket.emit('joinRoom', data.id);
    });

    let error = false;
    let redirectTime: number = 5;

    socket.on('joinedRoom',(amIn: boolean) => {
        error = !amIn;

        if(!amIn){
            setInterval(() => {
            redirectTime--;
            if(redirectTime <= 0)
                goto('/');
            },1000);
        }


    });

    let started = false;
    
    let message: string;
    let board = [['', '', ''], ['', '', ''], ['', '', '']];
    let turn = 'X';
	let done = false;

    socket.on('updateRoom', (data: Api.Room) => {
        if(!started)
            started = true;
        board = data.board;
        turn = data.turn;
        done = data.done;

        if(data.done && data.winner){
            message = `${data.winner} wins!`;
            redirectTime = 10;

            setInterval(() => {
                redirectTime--;
                if(redirectTime <= 0)
                    goto('/');
            },1000);
        }else if(data.done && !data.winner){
            message = "Tie game!";
        }

    });


</script>
<div class="h-full w-full absolute top-0 left-0 mx-auto flex justify-center items-center">
    <div 
        style="position: absolute; cursor: pointer; z-index: 1; font-size: 25px; color: white; left: 0; top: 0; margin: 20px;" 
        on:click={() => goto('/game')}
    >
        <Icon icon={arrowLeft} />
    </div>

    {#if !error}
        {#if !started}
            <div class="flex  flex-col justify-center items-center gap-5">
                <span>Waiting for others players to join</span>
                <Icon icon={loadingLoop} style="font-size: xx-large;" />
            </div>
        {:else}
            {#if !done}
                <Board board={board} onClick={(rowIndex,columnIndex) => socket.emit('onClick',{roomID: data.id,rowIndex,columnIndex})}/>
            {:else}
                <div class="flex  flex-col justify-center items-center gap-5">
                    <span>{message}</span>
                    <span>You will be redirected on {redirectTime}</span>
                </div>

            {/if}
        {/if}


    {:else}
        <div class="flex  flex-col justify-center items-center gap-5">
            <span>Error while Joining the room</span>
            <span>You will be redirected on {redirectTime}</span>
            <Icon icon={loadingLoop} style="font-size: xx-large;" />
        </div>
    {/if}


</div>
