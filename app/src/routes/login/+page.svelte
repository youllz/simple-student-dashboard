<script lang="ts">
	import { Reload } from 'radix-icons-svelte';
	import type { PageData } from './$types';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import { superForm } from 'sveltekit-superforms/client';
	import { Input } from '$lib/components/ui/input';
	import { goto } from '$app/navigation';

	export let data: PageData;

	$: loading = false;
	let failToAuth = false;

	const { form, enhance } = superForm(data.form, {
		onResult({ result }) {
			console.log(result);

			switch (result.status) {
				case 200:
					goto('/w', { replaceState: true });
					break;
				case 400:
					failToAuth = true;
			}
		}
	});
</script>

<main class="w-full h-[100dvh] grid place-content-center">
	<div class="bg-card border-border border flex flex-col py-[5vw] px-[8vw] gap-8">
		<div>
			<h2 class="mt-2 text-center text-3xl font-bold tracking-tight text-base-content">
				Login to your account
			</h2>
			<p class="text-center text-muted-foreground mt-1">
				Or <a
					href="/register"
					class="text-secondary-foreground font-medium hover:cursor-pointer hover:underline"
					>register</a
				> if you don't already have an account.
			</p>
		</div>
		<div class="w-full">
			<form method="POST" use:enhance class="w-full flex flex-col gap-6">
				<div class="flex flex-col gap-2">
					<Label for="email">Email</Label>
					<Input
						bind:value={$form.email}
						type="email"
						id="email"
						name="email"
						required
						placeholder="Enter your email"
						autocomplete="off"
					/>
				</div>
				<div class="flex flex-col gap-2">
					<Label for="password">Password</Label>
					<Input
						bind:value={$form.password}
						type="password"
						id="password"
						name="password"
						placeholder="Enter your password"
						required
						autocomplete="off"
					/>

					{#if failToAuth}
						<p class="text-destructive">Error password or email is incorrect</p>
					{/if}
				</div>

				<div>
					<Button disabled={loading} type="submit">
						{#if loading}
							<Reload class="mr-2 h-4 w-4 animate-spin" />
						{/if}
						Submit
					</Button>
				</div>
			</form>
		</div>
	</div>
</main>
