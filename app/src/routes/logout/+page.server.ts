import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({locals}) => {
  await locals.pb.authStore.clear()
  throw redirect(303, '/login')
  
  return {};
}) satisfies PageServerLoad;