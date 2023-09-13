import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load = (async () => {
  return {};
}) satisfies PageServerLoad;


export const actions: Actions = {
  editWorkspace: async ({ locals, request, params }) => {
    const formData = Object.fromEntries(await request.formData()) as { name: string, description: string }

    try {
      await locals.pb.collection('workspaces').update(params.wId, formData)
    } catch (err) {
      console.log('fail to edit workspace', err)
      return fail(400, { message: 'Fail to edit workspace' })
    }

    return fail(200)
  }

};