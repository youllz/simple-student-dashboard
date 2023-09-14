<script lang="ts">
	import type { LayoutData } from './$types';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Dialog from '$lib/components/ui/dialog';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Popover from '$lib/components/ui/popover';
	import {
		ChevronDown,
		Dashboard,
		Table,
		ChevronLeft,
		Half2,
		Plus,
		Gear,
		Target
	} from 'radix-icons-svelte';
	import { fly } from 'svelte/transition';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import * as RadioGroup from '$lib/components/ui/radio-group';
	import * as Avatar from '$lib/components/ui/avatar';
	import * as Accordion from '$lib/components/ui/accordion';
	import { enhance } from '$app/forms';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import type { SubmitFunction } from '@sveltejs/kit';
	import toast, { Toaster } from 'svelte-french-toast';
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';

	export let data: LayoutData;

	type Create = 'workspace' | 'board' | undefined;

	$: ({ allUserWorkspaces } = data);
	$: currentWorkspave = data.allUserWorkspaces.find((item) => item.id === $page.params.wId);
	$: selectWorkspace = allUserWorkspaces.filter((item) => item.id !== currentWorkspave?.id);

	let create: Create = undefined;
	let formIsValid = true;
	let dropdMenuValue = $page.params.wId;
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
					toast.success('your workspace has been created.', {
						duration: 2000
					});
					update({ reset: true });
					//@ts-ignore
					await goto(`/w/${result.data?.workspaceId}/home`, {
						replaceState: true,
						invalidateAll: true
					});
					break;
				case 400:
					toast.error('Fail to create workspace', {
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
					await goto(`/w/${currentWorkspave?.id}/b/${result.data.boardId}`);
					break;
				case 400:
					//@ts-ignore
					toast.error(result.data.message);
			}
		};
	};
</script>

{#if allUserWorkspaces.length !== 0}
	<header class="w-full bg-muted text-muted-foreground px-4 py-3 fixed top-0 z-40">
		<nav class="w-full flex items-center justify-between">
			<ul class="flex items-center gap-8">
				<li>
					<a href="/" class="font-bold">LOGO</a>
				</li>

				<li>
					<DropdownMenu.Root>
						<DropdownMenu.Trigger>
							<Button variant="secondary">
								workspace
								<ChevronDown class="font-bold ml-2 w-4 h-4" />
							</Button>
						</DropdownMenu.Trigger>
						<DropdownMenu.Content class="min-w-[15rem]">
							<DropdownMenu.Group>
								<DropdownMenu.Label>current workspace</DropdownMenu.Label>
								<DropdownMenu.Separator />
								<!-- <DropdownMenu.Item class="hover:bg-inherit"> -->
								<div class="w-full flex gap-2 py-4 px-2">
									<div class="px-3 py-1 bg-primary text-primary-foreground">T</div>
									<span class="self-end">Text</span>
								</div>
								<!-- </DropdownMenu.Item> -->
							</DropdownMenu.Group>
							<DropdownMenu.Group>
								<DropdownMenu.Separator />
								<DropdownMenu.Label>your workspace</DropdownMenu.Label>
								<DropdownMenu.Separator />
								<DropdownMenu.Item>
									<a href="/">
										<div class="flex gap-2 py-1">
											<div class="px-3 py-1 bg-primary text-primary-foreground">T</div>
											<span class="self-end">Text</span>
										</div>
									</a>
								</DropdownMenu.Item>
								<DropdownMenu.Item>
									<a href="/">
										<div class="flex gap-2 py-1">
											<div class="px-3 py-1 bg-primary text-primary-foreground">T</div>
											<span class="self-end">Text</span>
										</div>
									</a>
								</DropdownMenu.Item>
								<DropdownMenu.Item>
									<a href="/">
										<div class="flex gap-2 py-1">
											<div class="px-3 py-1 bg-primary text-primary-foreground">T</div>
											<span class="self-end">Text</span>
										</div>
									</a>
								</DropdownMenu.Item>
							</DropdownMenu.Group>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				</li>

				<li>
					<DropdownMenu.Root>
						<DropdownMenu.Trigger>
							<Button variant="secondary" class="">
								Recent
								<ChevronDown class="font-bold ml-2 w-4 h-4" />
							</Button>
						</DropdownMenu.Trigger>
						<DropdownMenu.Content class="min-w-[15rem]">
							<DropdownMenu.Group>
								<DropdownMenu.Label>current workspace</DropdownMenu.Label>
								<DropdownMenu.Separator />
								<!-- <DropdownMenu.Item class="hover:bg-inherit"> -->
								<div class="w-full flex gap-2 py-4 px-2">
									<div class="px-3 py-1 bg-primary text-primary-foreground">T</div>
									<span class="self-end">Text</span>
								</div>
								<!-- </DropdownMenu.Item> -->
							</DropdownMenu.Group>
							<DropdownMenu.Group>
								<DropdownMenu.Separator />
								<DropdownMenu.Label>your workspace</DropdownMenu.Label>
								<DropdownMenu.Separator />
								<DropdownMenu.Item>
									<a href="/">
										<div class="flex gap-2 py-1">
											<div class="px-3 py-1 bg-primary text-primary-foreground">T</div>
											<span class="self-end">Text</span>
										</div>
									</a>
								</DropdownMenu.Item>
								<DropdownMenu.Item>
									<a href="/">
										<div class="flex gap-2 py-1">
											<div class="px-3 py-1 bg-primary text-primary-foreground">T</div>
											<span class="self-end">Text</span>
										</div>
									</a>
								</DropdownMenu.Item>
								<DropdownMenu.Item>
									<a href="/">
										<div class="flex gap-2 py-1">
											<div class="px-3 py-1 bg-primary text-primary-foreground">T</div>
											<span class="self-end">Text</span>
										</div>
									</a>
								</DropdownMenu.Item>
							</DropdownMenu.Group>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				</li>

				<li>
					<Popover.Root>
						<Popover.Trigger>
							<Button on:click={() => (create = undefined)}>create</Button>
						</Popover.Trigger>
						<Popover.Content class="p-0">
							<div class="flex flex-col gap-1">
								{#if create === undefined}
									<button
										on:click={() => (create = 'board')}
										class="w-full hover:bg-accent py-2 px-2"
									>
										<span class="flex items-center gap-2 w-full font-bold">
											<Dashboard />
											Create board
										</span>
										<p class="text-left mt-2 text-sm">
											A board is made up of cards ordered on lists. Use it to manage projects, track
											information, or organize anything.
										</p>
									</button>
									<button
										on:click={() => (create = 'workspace')}
										class="w-full hover:bg-accent py-2 px-2"
									>
										<span class="flex items-center gap-2 w-full font-bold">
											<Table />
											Create workspace
										</span>
										<p class="text-left mt-2 text-sm">
											A board is made up of cards ordered on lists. Use it to manage projects, track
											information, or organize anything.
										</p>
									</button>
								{:else if create === 'workspace'}
									<div class="full">
										<div class="w-full flex items-center justify-between p-2">
											<Button on:click={() => (create = undefined)} variant="ghost"
												><ChevronLeft />
											</Button><span> create workspace</span>
										</div>
										<form
											action="/w/?/createWorkspace "
											method="POST"
											use:enhance={createFormCheck}
											class="w-full flex gap-4 flex-col p-2 cla"
										>
											<div class="flex flex-col gap-2">
												<Label for="workspaceName">Name *</Label>
												<Input
													type="text"
													name="name"
													id="workspaceName"
													required
													autocomplete="off"
													placeholder="workspace name"
												/>
												{#if !formIsValid}
													<small class="text-destructive">minimal character</small>
												{/if}
											</div>
											<div class="flex flex-col gap-2">
												<Label for="workDescrip">Description (optional)</Label>
												<Textarea
													name="description"
													id="workDescrip"
													autocomplete="off"
													placeholder="workspace description"
												/>
											</div>
											<div>
												<Button type="submit" class="w-full">Create</Button>
											</div>
										</form>
									</div>
								{:else if create === 'board'}
									<div class="w-full py-2">
										<div class="w-full flex items-center justify-between p-2">
											<Button on:click={() => (create = undefined)} variant="ghost"
												><ChevronLeft />
											</Button><span> create board</span>
										</div>

										<form
											action="/w/?/createBoard"
											method="POST"
											use:enhance={createBoardForm}
											class="w-full flex gap-4 flex-col p-2 cla"
										>
											<div class="flex flex-col gap-2">
												<Label for="boardName">Name *</Label>
												<Input
													type="text"
													name="name"
													id="boardName"
													required
													placeholder="board name"
													autocomplete="off"
												/>
												{#if !boardNameIsValid}
													<small class="text-destructive">minimal character</small>
												{/if}
											</div>
											<div class="flex flex-col gap-2">
												<Label for="boardDescription">Description (optional)</Label>
												<Textarea
													name="description"
													id="boardDescription"
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
														value={currentWorkspave?.id}>{currentWorkspave?.name}</option
													>
													{#each selectWorkspace as workspace}
														<option
															class="bg-background text-foreground text-[1rem]"
															value={workspace?.id}>{workspace?.name}</option
														>
													{/each}
												</select>
											</div>

											<div>
												<Button type="submit" class="w-full">Create</Button>
											</div>
										</form>
									</div>
								{/if}
							</div>
						</Popover.Content>
					</Popover.Root>
				</li>
			</ul>

			<ul class="flex items-center gap-4">
				<!-- <li>
					<Popover.Root>
						<Popover.Trigger>
							<Button variant="ghost">
								<Half2 class="w-6 h-6" />
							</Button>
						</Popover.Trigger>
						<Popover.Content class="p-0">
							<form  class="w-full" method="POST" use:enhance>
								<RadioGroup.Root value="system">
									<div class="flex items-center space-x-2">
											<Label for="light" class="w-full flex items-center gap-2 hover:bg-accent p-3">
												<RadioGroup.Item type="submit" formaction="?/theme&theme=light" name="theme" value="light" id="light" />
												<div class="w-[4rem] h-[4rem]">
													<img
														src="/light-theme.svg"
														alt="theme"
														class="object-cover w-full h-full rounded-sm"
													/>
												</div>
												<span>light</span>
											</Label>
									</div>
									<div class="flex items-center space-x-2">
										<Label for="dark" class="w-full flex items-center gap-2 hover:bg-accent p-3">
											<RadioGroup.Item type="submit" formaction="?/theme&theme=dark" name="theme" value="dark" id="dark" />
											<div class="w-[4rem] h-[4rem]">
												<img
													src="/dark-theme.svg"
													alt="theme"
													class="object-cover w-full h-full rounded-sm"
												/>
											</div>
											<span>dark</span>
										</Label>
									</div>
									<div class="flex items-center space-x-2">
										<Label for="system" class="w-full flex items-center gap-2 hover:bg-accent p-3">
											<RadioGroup.Item  type="submit"  formaction="?/theme&theme=system" name="theme" value="system" id="system" />
											<div class="w-[4rem] h-[4rem]">
												<img
													src="/auto-theme.svg"
													alt="theme"
													class="object-cover w-full h-full rounded-sm"
												/>
											</div>
											<span>system</span>
										</Label>
									</div>
									<RadioGroup.Input name="theme" />
								</RadioGroup.Root>
							</form>
						</Popover.Content>
					</Popover.Root>
				</li> -->
				<li>
					<DropdownMenu.Root>
						<DropdownMenu.Trigger>
							<Avatar.Root class="w-[1.5rem] h-[1.5rem] m-0 p-0">
								<!-- <Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" /> -->
								<Avatar.Fallback>CN</Avatar.Fallback>
							</Avatar.Root>
						</DropdownMenu.Trigger>
						<DropdownMenu.Content class="min-w-[15rem]">
							<DropdownMenu.Group>
								<DropdownMenu.Label>
									<small class="text-[0.8rem] opacity-80">ACCOUNT</small>
									<div class="w-full flex gap-2 justify-start mt-3">
										<Avatar.Root class="w-[3rem] h-[3rem]">
											<!-- <Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" /> -->
											<Avatar.Fallback>CN</Avatar.Fallback>
										</Avatar.Root>
										<div class="flex flex-col text-sm self-end">
											<span class="text-[0.8rem]">youssef</span>
											<span class="text-[0.8rem]">youssef@gmail.com</span>
										</div>
									</div>
								</DropdownMenu.Label>
								<DropdownMenu.Separator />
								<DropdownMenu.Item>Profile</DropdownMenu.Item>
								<DropdownMenu.Item>Activity</DropdownMenu.Item>
								<DropdownMenu.Separator />
								<form action="/logout" method="GET">
									<DropdownMenu.Item>
										<button type="submit"> Log out </button>
									</DropdownMenu.Item>
								</form>
							</DropdownMenu.Group>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				</li>
			</ul>
		</nav>
	</header>

	<Toaster />
	<main class="min-h-[100dvh] w-full pt-20 px-[5vw] flex">
		<aside class="w-[15rem] max-h-full flex-shrink-0 sticky top-0 px-2 overflow-y-auto">
			<div>
				<Button class="w-full justify-start gap-2 " variant="ghost">
					<Dashboard />
					Boards
				</Button>
			</div>
			<Separator />
			<div class="w-full flex items-center justify-between mt-2">
				<span> workspaces </span>
				<span>
					<Dialog.Root>
						<Dialog.Trigger>
							<Button variant="ghost" size="icon">
								<Plus />
							</Button>
						</Dialog.Trigger>
						<Dialog.Content>
							<Dialog.Header>
								<Dialog.Title>Create your workspace</Dialog.Title>
								<Dialog.Description>
									This action cannot be undone. This will permanently delete your account and remove
									your data from our servers.
								</Dialog.Description>
							</Dialog.Header>
							<form
								use:enhance={createFormCheck}
								action="/w/?/createWorkspace"
								method="POST"
								class="w-full grid gap-4"
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
										required
										autocomplete="off"
										placeholder="workspace description"
									/>
								</div>
								<div>
									<Button type="submit" class="w-full">Create</Button>
								</div>
							</form>
						</Dialog.Content>
					</Dialog.Root>
				</span>
			</div>
			<div
				class="mt-4 h-[38rem] overflow-y-auto scrollbar scrollbar-track-background scrollbar-thin-accent scrollbar-thumb-accent px-2"
			>
				<Accordion.Root bind:value={dropdMenuValue}>
					{#each allUserWorkspaces as workspace}
						<Accordion.Item value={workspace.id}>
							<div
								class="w-full h-full text-left pl-4 rounded-sm"
								class:bg-secondary={dropdMenuValue === workspace.id}
								data-id={workspace.id}
							>
								<Accordion.Trigger class="rounded-sm pr-2">
									{workspace.name}
								</Accordion.Trigger>
							</div>
							<Accordion.Content>
								<Button
									href="/w/{workspace.id}/home"
									class=" pl-8 w-full justify-start gap-2 "
									variant={`/w/${workspace.id}/home` === $page.url.pathname ? 'default' : 'ghost'}
								>
									<Dashboard />
									Boards
								</Button>
								<Button
									href="/w/{workspace.id}/settings"
									class=" pl-8 w-full justify-start gap-2 "
									variant={`/w/${workspace.id}/settings` === $page.url.pathname
										? 'default'
										: 'ghost'}
								>
									<Gear />
									Settings
								</Button>
							</Accordion.Content>
						</Accordion.Item>
					{/each}
				</Accordion.Root>
			</div>
		</aside>
		<section class="w-full flex-grow min-h-full">
			<slot><!-- optional fallback --></slot>
		</section>
	</main>
{:else}
	<section class="w-full h-full flex flex-col items-center gap-[4rem] p-8">
		<figure class="h-[20rem]">
			<img src="/workspace.png" alt="humman ilustration" class="w-full h-full object-contain" />
		</figure>

		<p class="w-1/2 text-center">
			Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus unde nihil minus,
			officiis architecto ipsa nostrum accusantium. Quaerat adipisci cupiditate ad laudantium
			tempore minima iure.
		</p>

		<Dialog.Root>
			<Dialog.Trigger>
				<Button>
					<!-- <Plus /> -->
					Create your first workspace
				</Button>
			</Dialog.Trigger>
			<Dialog.Content>
				<Dialog.Header>
					<Dialog.Title>Create your workspace</Dialog.Title>
					<Dialog.Description>
						This action cannot be undone. This will permanently delete your account and remove your
						data from our servers.
					</Dialog.Description>
				</Dialog.Header>
				<form
					use:enhance={createFormCheck}
					action="/w/?/createWorkspace"
					method="POST"
					class="w-full grid gap-4"
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
						/>
					</div>
					<div>
						<Button type="submit" class="w-full">Create</Button>
					</div>
				</form>
			</Dialog.Content>
		</Dialog.Root>
	</section>
{/if}

<style>
	:global(p) {
		text-wrap: balance;
	}

	::-webkit-scrollbar {
		width: 0.5rem;
		margin-left: 8px;
	}
</style>
