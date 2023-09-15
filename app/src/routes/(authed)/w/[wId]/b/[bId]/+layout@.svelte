<script lang="ts">
	import type { LayoutData } from './$types';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';
	import { ChevronDown, ChevronLeft, Dashboard, Plus, Table } from 'radix-icons-svelte';
	import * as Popover from '$lib/components/ui/popover';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import * as Avatar from '$lib/components/ui/avatar';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { page } from '$app/stores';
	import toast, { Toaster } from 'svelte-french-toast';
	import { goto, invalidateAll } from '$app/navigation';
	import { enhance } from '$app/forms';
	import Separator from '$lib/components/ui/separator/separator.svelte';

	export let data: LayoutData;

	type Create = 'workspace' | 'board' | undefined;

	$: currentWorkspace = data.allUserWorkspaces.find((item) => item.id === $page.params.wId);
	$: ({ allUserWorkspaces } = data);
	$: selectWorkspace = allUserWorkspaces.filter((item) => item.id !== currentWorkspace?.id);
	$: ({ currentBoardCourses } = data);

	let create: Create = undefined;
	let formIsValid = true;
	let boardNameIsValid = true;
	let courseNameIsValid = true;

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

	const addCourseForm: SubmitFunction = ({ formData, cancel }) => {
		const form = Object.fromEntries(formData) as Record<string, string>;

		if (form.name.length < 2) {
			courseNameIsValid = false;
			cancel();
		}

		return async ({ result, update }) => {
			switch (result.status) {
				case 200:
					await invalidateAll();
					await update({ reset: true });
					toast.success('successful');
					//@ts-ignore
					await goto(`/w/${$page.params.wId}/b/${$page.params.bId}/c/${result.data.courseId}`);
					break;

				case 400:
					await update({ reset: false });
					toast.error('Fail to add course', {
						duration: 2000
					});
					break;
			}
		};
	};
</script>

<Toaster />
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
								<div class="px-3 py-1 bg-primary rounded-sm font-bold text-primary-foreground">
									{currentWorkspace?.name[0]}
								</div>
								<span class="self-end">{currentWorkspace?.name}</span>
							</div>
							<!-- </DropdownMenu.Item> -->
						</DropdownMenu.Group>
						<DropdownMenu.Group>
							<DropdownMenu.Separator />
							<DropdownMenu.Label>your workspaces</DropdownMenu.Label>
							<DropdownMenu.Separator />
							{#each selectWorkspace as workspace}
								<DropdownMenu.Item>
									<a href="/w/{workspace.id}/home">
										<div class="flex gap-2 py-1">
											<div
												class="px-3 py-1 bg-primary rounded-sm font-bold text-primary-foreground"
											>
												{workspace.name[0]}
											</div>
											<span class="self-end">{workspace.name}</span>
										</div>
									</a>
								</DropdownMenu.Item>
							{/each}
							<!-- <DropdownMenu.Item>
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
							</DropdownMenu.Item> -->
						</DropdownMenu.Group>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</li>

			<li>
				<DropdownMenu.Root>
					<DropdownMenu.Trigger disabled>
						<Button disabled variant="secondary" class="">
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
										action="/w/{currentWorkspace?.id}/b/?/createWorkspace"
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
												<small class="text-destructive">minimal 2 character</small>
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
										action="/w/{currentWorkspace?.id}/b/?/createBoard"
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

<main class="w-full min-h-[100dvh] flex pt-14">
	<aside class="w-[20rem] flex-shrink-0 min-h-full">
		<div class="p-3 w-full flex justify-between items-center">
			<div class="flex gap-2">
				<Button class="fon-bold">t</Button>
				<span class="self-end">test</span>
			</div>
			<Button variant="secondary" size="icon">
				<ChevronLeft />
			</Button>
		</div>
		<Separator />
		<div class="w-full pt-2">
			<Button class="w-full justify-start gap-2 " variant="ghost">
				<Dashboard />
				Boards
			</Button>
		</div>
		<div class="w-full flex items-center justify-between p-3">
			<span class="font-Bold">Your courses</span>
			<span>
				<Popover.Root>
					<Popover.Trigger>
						<Button variant="ghost" size="icon">
							<Plus />
						</Button>
					</Popover.Trigger>
					<Popover.Content>
						<div class="w-full">
							<span class="text-sm">Add courses</span>
						</div>
						<!-- ADD COURSE -->
						<form
							use:enhance={addCourseForm}
							action="/w/{$page.params.wId}/b/{$page.params.bId}?/addCourse"
							method="POST"
							class="w-ful grid gap-4 mt-8"
						>
							<div class="grid gap-2">
								<Label for="name">Name *</Label>
								<Input
									type="text"
									id="name"
									name="name"
									required
									autocomplete="off"
									placeholder="course name"
									on:input={() => (courseNameIsValid = true)}
								/>
								{#if !courseNameIsValid}
									<small class="text-destructive">minimal 2 character</small>
								{/if}
							</div>
							<div class="grid gap-2">
								<Label for="coefficient">Coefficient</Label>
								<Input
									type="number"
									id="coefficient"
									name="coefficient"
									min="1"
									value="1"
									required
									autocomplete="off"
									placeholder="course coefficient"
								/>
							</div>
							<div class="grid gap-2">
								<Label for="name">Description (optional)</Label>
								<Textarea
									id="description"
									autocomplete="off"
									name="description"
									placeholder="course description"
								/>
							</div>
							<div>
								<Button class="w-full">Add</Button>
							</div>
						</form>
					</Popover.Content>
				</Popover.Root>
			</span>
		</div>
		<ul class="w-full h-[76.8%] overflow-y-auto">
			{#each currentBoardCourses as course}
				<li class="w-full">
					<Button
						variant={`/w/${$page.params.wId}/b/${$page.params.bId}/c/${course.id}` ===
						$page.url.pathname
							? 'secondary'
							: 'ghost'}
						href="/w/{$page.params.wId}/b/{$page.params.bId}/c/{course.id}"
						class="w-full justify-start"
					>
						{course.name}
					</Button>
				</li>
			{/each}
		</ul>
	</aside>

	<section class="flex-grow min-h-full bg-black">
		<slot />
	</section>
</main>
