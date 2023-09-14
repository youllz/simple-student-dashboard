<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { Pencil1 } from 'radix-icons-svelte';
	import type { PageData } from './$types';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import type { SubmitFunction } from '@sveltejs/kit';
	import toast, { Toaster } from 'svelte-french-toast';
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { goto, invalidateAll } from '$app/navigation';
	import * as Popover from '$lib/components/ui/popover';

	export let data: PageData;

	$: ({ boards } = data);
	$: currentWorkspace = data.allUserWorkspaces.find((item) => item.id === $page.params.wId);
	$: ({ allUserWorkspaces } = data);
	$: selectWorkspace = allUserWorkspaces.filter((item) => item.id !== currentWorkspace?.id);

	let editWorkspace = false;
	let formIsValid = true;
	let boardNameIsValid = true;

	const createFormCheck: SubmitFunction = ({ cancel, formData }) => {
		const form = Object.fromEntries(formData) as { name: string; description: string };

		if (form.name.length < 2) {
			formIsValid = false;
			cancel();
		}

		return async ({ result, update }) => {
			switch (result.status) {
				case 200:
					await invalidateAll();
					toast.success('your workspace has been edited.', {
						duration: 2000
					});
					await update({ reset: false });

					break;
				case 400:
					toast.error('Fail to edit workspace', {
						duration: 2000
					});
					break;
			}
		};
	};

	const createBoardForm: SubmitFunction = ({ cancel, formData }) => {
		const form = Object.fromEntries(formData) as Record<string, string>;

		if (form.name.length < 2) {
			boardNameIsValid = false;
			cancel();
		}

		return async ({ result, update }) => {
			switch (result.status) {
				case 200:
					await invalidateAll();
					await update({ reset: true });
					//@ts-ignore
					toast.success(result.data.message);
					//@ts-ignore
					await goto(`/w/${currentWorkspace?.id}/b/${result.data.boardId}`);
					break;
				case 400:
					//@ts-ignore
					toast.error(result.data.message);
			}
		};
	};
</script>

<Toaster />

<div class="w-full h-full p-6">
	{#if !editWorkspace}
		<div class="w-full flex flex-col gap-2 pb-4">
			<div class="flex gap-3">
				<div
					class="px-4 py-2 grid rounded-sm place-content-center font-bold text-xl bg-primary text-primary-foreground"
				>
					<span> {currentWorkspace?.name[0]} </span>
				</div>
				<div class="flex gap-1 flex-col">
					<Button variant="outline" size="icon" on:click={() => (editWorkspace = !editWorkspace)}>
						<Pencil1 />
					</Button>
					<span> {currentWorkspace?.name} </span>
				</div>
			</div>
			<p class="opacity-70 text-sm max-w-sm">
				{currentWorkspace?.description}
			</p>
		</div>
	{:else}
		<form
			use:enhance={createFormCheck}
			action="?/editWorkspace"
			method="POST"
			class="w-full grid gap-4 max-w-md mb-4"
		>
			<div class="w-full grid gap-2">
				<Label for="name">Name *</Label>
				<Input
					on:input={() => (formIsValid = true)}
					type="text"
					name="name"
					id="name"
					required
					autocomplete="off"
					placeholder="workspace name"
					value={currentWorkspace?.name}
				/>
				{#if !formIsValid}
					<small class="text-destructive">minimal character</small>
				{/if}
			</div>
			<div class="w-full grid gap-2">
				<Label for="name">Description</Label>
				<Textarea
					name="description"
					id="description"
					autocomplete="off"
					placeholder="workspace description"
					value={currentWorkspace?.description}
				/>
			</div>
			<div class="flex gap-1 items-center">
				<Button type="submit" class="w-full flex-grow flex-shrink-1">Edit</Button>
				<Button
					on:click={() => (editWorkspace = !editWorkspace)}
					type="button"
					variant="secondary"
					class="w-full flex-grow flex-shrink-1">Cancel</Button
				>
			</div>
		</form>
	{/if}

	<Separator />

	{#if boards.length !== 0}
		<div class="w-full pt-4 h-auto">
			<div class="text-md font-bold flex items-center gap-2">
				<span>
					<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"
						><path
							fill="currentColor"
							d="M18.39 14.56C16.71 13.7 14.53 13 12 13s-4.71.7-6.39 1.56A2.97 2.97 0 0 0 4 17.22V20h16v-2.78c0-1.12-.61-2.15-1.61-2.66zM18 18H6v-.78c0-.38.2-.72.52-.88C7.71 15.73 9.63 15 12 15c2.37 0 4.29.73 5.48 1.34c.32.16.52.5.52.88V18zm-8-6h4c1.66 0 3-1.34 3-3c0-.73-.27-1.4-.71-1.92c.13-.33.21-.7.21-1.08a3 3 0 0 0-1.86-2.77C14 2.48 13.06 2 12 2s-2 .48-2.64 1.23A3 3 0 0 0 7.5 6c0 .38.08.75.21 1.08C7.27 7.6 7 8.27 7 9c0 1.66 1.34 3 3 3zm-.76-3.63c.87-1.04.26-2 .26-2.37c0-.41.24-.77.62-.92c.29-.12.55-.31.75-.54c.17-.21.55-.54 1.13-.54s.96.33 1.13.53c.2.24.46.42.75.54a1 1 0 0 1 .62.93c0 .37-.61 1.33.26 2.37c.58.69.04 1.63-.76 1.63h-4c-.8 0-1.34-.94-.76-1.63z"
						/></svg
					>
				</span>
				<span> Your boards </span>
			</div>
			<ul class="mt-3">
				{#each boards as board}
					<li>
						<a href="/w/{$page.params.wId}/b/{board.id}">
							<div
								class="w-full h-full bg-accent text-accent-foreground p-4 flex flex-col justify-between"
							>
								<span class="font-bold">
									{board.name}
								</span>
								<p class="opacity-80">
									{board.description}
								</p>
							</div>
						</a>
					</li>
				{/each}
				<li>
					<Popover.Root positioning={{ placement: 'right-start' }}>
						<Popover.Trigger class="w-full h-full">
							<button
								class="bg-accent text-accent-foreground w-full h-full opacity-60 hover:opacity-100"
							>
								<div class="w-full">Create new board</div>
							</button>
						</Popover.Trigger>
						<Popover.Content class="max-w-md min-w-[300px] w-[23rem]">
							<div class="w-full">
								<span class="text-sm text-center">Create board</span>
							</div>
							<form
								use:enhance={createBoardForm}
								action="?/createBoard"
								method="POST"
								class="w-full grid gap-4 max-w-md mt-6 mb-4"
							>
								<div class="w-full grid gap-2">
									<Label for="name">Name *</Label>
									<Input
										on:input={() => (formIsValid = true)}
										type="text"
										name="name"
										id="name"
										required
										autocomplete="off"
										placeholder="board name"
									/>
									{#if !boardNameIsValid}
										<small class="text-destructive">minimal character</small>
									{/if}
								</div>
								<div class="w-full grid gap-2">
									<Label for="name">Description (optional)</Label>
									<Textarea
										name="description"
										id="description"
										autocomplete="off"
										placeholder="board description"
									/>
								</div>
								<div class="w-full grid gap-2">
									<Label for="workspaceId" class="w-full grid gap-2">workspace</Label>
									<select
										name="workspaceId"
										id="workspaceId"
										class="mt-1.5 w-full rounded-lg py-2.5 px-2 border-input border bg-background text-foreground sm:text-sm"
									>
										<option
											class="bg-background text-foreground text-[1rem]"
											value={currentWorkspace?.id}>{currentWorkspace?.name}</option
										>
										{#each selectWorkspace as workspace}
											<option
												class="bg-background text-foreground text-[1rem]"
												value={workspace?.id}>{workspace?.name}</option
											>
										{/each}
									</select>
								</div>
								<div class="flex gap-1 items-center">
									<Button type="submit" class="w-full flex-grow flex-shrink-1">Create</Button>
								</div>
							</form>
						</Popover.Content>
					</Popover.Root>
				</li>
			</ul>
		</div>
	{:else}
		<div class="w-full flex flex-col items-center gap-8 relative">
			<figure class="w-full h-[15rem]">
				<img src="/board.svg" alt="board" class="w-full h-full object-contain" />
			</figure>
			<p class="text-center">
				Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ratione voluptates optio ipsa
				enim,
			</p>

			<div>
				<Popover.Root positioning={{ placement: 'right' }}>
					<Popover.Trigger class="w-full h-full">
						<Button>Create your first board</Button>
					</Popover.Trigger>
					<Popover.Content class="max-w-md min-w-[300px] w-[23rem]">
						<div class="w-full">
							<span class="text-sm text-center">Create board</span>
						</div>
						<form
							use:enhance={createBoardForm}
							action="?/createBoard"
							method="POST"
							class="w-full grid gap-4 max-w-md mt-6 mb-4"
						>
							<div class="w-full grid gap-2">
								<Label for="name">Name *</Label>
								<Input
									on:input={() => (formIsValid = true)}
									type="text"
									name="name"
									id="name"
									required
									autocomplete="off"
									placeholder="board name"
								/>
								{#if !boardNameIsValid}
									<small class="text-destructive">minimal character</small>
								{/if}
							</div>
							<div class="w-full grid gap-2">
								<Label for="name">Description (optional)</Label>
								<Textarea
									name="description"
									id="description"
									autocomplete="off"
									placeholder="board description"
								/>
							</div>
							<div class="w-full grid gap-2">
								<Label for="workspaceId" class="w-full grid gap-2">workspace</Label>
								<select
									name="workspaceId"
									id="workspaceId"
									class="mt-1.5 w-full rounded-lg py-2.5 px-2 border-input border bg-background text-foreground sm:text-sm"
								>
									<option
										class="bg-background text-foreground text-[1rem]"
										value={currentWorkspace?.id}>{currentWorkspace?.name}</option
									>
									{#each selectWorkspace as workspace}
										<option class="bg-background text-foreground text-[1rem]" value={workspace?.id}
											>{workspace?.name}</option
										>
									{/each}
								</select>
							</div>
							<div class="flex gap-1 items-center">
								<Button type="submit" class="w-full flex-grow flex-shrink-1">Create</Button>
							</div>
						</form>
					</Popover.Content>
				</Popover.Root>
			</div>
		</div>
	{/if}
</div>

<style>
	ul {
		width: 100%;
		display: grid;
		gap: 20px;
		grid-template-columns: repeat(auto-fill, minmax(13rem, auto));
		grid-auto-rows: minmax(6rem, auto);
	}
</style>
