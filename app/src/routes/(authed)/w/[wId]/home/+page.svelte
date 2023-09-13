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
	import { invalidateAll } from '$app/navigation';

	export let data: PageData;

	$: currentWorkspave = data.allUserWorkspaces.find((item) => item.id === $page.params.wId);

	let editWorkspace = false;
	let formIsValid = true;

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
</script>

<Toaster />

<div class="w-full h-full p-6">
	{#if !editWorkspace}
		<div class="w-full flex flex-col gap-2 mb-2">
			<div class="flex gap-3">
				<div
					class="px-4 py-2 grid rounded-sm place-content-center font-bold text-xl bg-primary text-primary-foreground"
				>
					<span> {currentWorkspave?.name[0]} </span>
				</div>
				<div class="flex flex-col">
					<Button variant="ghost" size="icon" on:click={() => (editWorkspace = !editWorkspace)}>
						<Pencil1 />
					</Button>
					<span> {currentWorkspave?.name} </span>
				</div>
			</div>
			<p class="opacity-70 text-sm max-w-sm">
				{currentWorkspave?.description}
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
					value={currentWorkspave?.name}
				/>
				{#if !formIsValid}
					<small class="text-destructive">minimum 2 chartere</small>
				{/if}
			</div>
			<div class="w-full grid gap-2">
				<Label for="name">Description</Label>
				<Textarea
					name="description"
					id="description"
					autocomplete="off"
					placeholder="workspace description"
					value={currentWorkspave?.description}
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
</div>
