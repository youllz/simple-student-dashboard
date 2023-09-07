<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import type { PageData } from './$types';
	import { message, superForm } from 'sveltekit-superforms/client';
	import { Reload, Rocket } from 'radix-icons-svelte';
	import * as Alert from '$lib/components/ui/alert';
	import { goto } from '$app/navigation';
	import { registerSchema } from './schema';

	export let data: PageData;
	export let form: FormData;

	$: loading = false;
	let status: number | undefined = undefined;
	let emailFound = '';

	$: if (form?.message) {
		emailFound = form.message;
	}

	const {
		form: loginForm,
		enhance: loginEnhance,
		constraints,
		errors
	} = superForm(data.loginForm, {
		validators: registerSchema,
		onResult({ result }) {
			switch (result.status) {
				case 200:
					loading = false;
					status = 200;
					goto('/login', { replaceState: true });
					break;

				case 400:
					loading = false;
					status = 400;
					break;
			}
		},
		onSubmit({ cancel, formData }) {
			// if()
			const data = Object.fromEntries(formData) as Record<string, string>;
			if (data.password !== data.passwordConfirm) {
				cancel();
			}
			loading = true;
		},

		resetForm: true
	});

	let passwordMatch = true;
	function determinePasswordMatch() {
		if ($loginForm.password !== $loginForm.passwordConfirm) {
			passwordMatch = false;
		} else {
			passwordMatch = true;
		}
	}
</script>

<main class=" w-full h-[100dvh] relative grid place-content-center">
	{#if loading}
		<div class="absolute right-2 bottom-2">
			<Alert.Root variant={status === 200 ? 'destructive' : 'default'}>
				<Rocket class="h-4 w-4" />
				<Alert.Title>{status === 200 ? 'Error' : 'Succsess'}</Alert.Title>
				<Alert.Description>
					{status === 204
						? 'your account has not been registered'
						: 'your account has been successfully registered'}
				</Alert.Description>
			</Alert.Root>
		</div>
	{/if}

	<div class="bg-card border-border border flex flex-col py-[5vw] px-[8vw] gap-8">
		<div>
			<h2 class="mt-2 text-center text-3xl font-bold tracking-tight">Register for an account</h2>
			<p class="text-center mt-1">
				Or <a
					href="/login"
					class=" text-secondary-foreground font-medium hover:cursor-pointer hover:underline"
					>sign in</a
				> if you already have an account.
			</p>
		</div>
		<div class="w-full">
			<form method="POST" use:loginEnhance class="w-full flex flex-col gap-6">
				<div class="flex flex-col gap-2">
					<Label for="name">Name</Label>
					<Input
						bind:value={$loginForm.name}
						type="text"
						name="name"
						id="name"
						required
						autocomplete="off"
						placeholder="Enter your name"
					/>
					{#if $errors.name}
						<p class="text-destructive">{$errors.name}</p>
					{/if}
				</div>
				<div class="flex flex-col gap-2">
					<Label for="email">Email</Label>
					<Input
						on:input={() => {
							emailFound = '';
						}}
						bind:value={$loginForm.email}
						type="email"
						id="email"
						name="email"
						required
						placeholder="Enter your email"
						autocomplete="off"
					/>
					{#if emailFound}
						<p class="text-destructive">{emailFound}</p>
					{/if}
					{#if $errors.email}
						<p class="text-destructive">{$errors.email}</p>
					{/if}
				</div>
				<div class="flex flex-col gap-2">
					<Label for="password">Password</Label>
					<Input
						bind:value={$loginForm.password}
						type="password"
						id="password"
						name="password"
						placeholder="Enter your password"
						required
						autocomplete="off"
					/>
					{#if $errors.password}
						<p class="text-destructive">{$errors.password}</p>
					{/if}
				</div>
				<div class="flex flex-col gap-2">
					<Label for="passwordConfirm">Confirm password</Label>
					<Input
						bind:value={$loginForm.passwordConfirm}
						type="password"
						name="passwordConfirm"
						id="passwordConfirm"
						placeholder="Confirm your password"
						required
						autocomplete="off"
						on:input={determinePasswordMatch}
					/>
					{#if $errors.passwordConfirm}
						<p class="text-destructive">{$errors.passwordConfirm}</p>
					{/if}

					{#if !passwordMatch}
						<p class="text-destructive">passwords do not match</p>
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

<style>
</style>
