import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load = (async () => {
  return {};
}) satisfies PageServerLoad;




export const actions: Actions = {

  createWorkspace: async ({ request, locals }) => {
    const formData = Object.fromEntries(await request.formData()) as { name: string, description: string }

    let workspaceId = ''
    try {
      const record = await locals.pb.collection('workspaces').create({
        name: formData.name,
        description: formData.description,
        user: locals.user?.id
      })

      workspaceId = record.id

    } catch (err) {
      console.log('Fail to create workspace', err)
      return fail(400, { message: 'Fail to create Workspace.' })
    }

    return fail(200, { workspaceId })
  },

  createBoard: async ({ locals, request }) => {
    const formData = Object.fromEntries(await request.formData()) as { name: string, description: string, workspaceId: any }

    let boardId = ''
    try {
      const record = await locals.pb.collection('boards').create(
        {
          name: formData.name, description: formData.description, workspace: formData.workspaceId, user: locals.user?.id
        })
      boardId = record.id
    } catch (err) {
      console.log('Fail to create board', err)
      return fail(400, { message: 'Fail to create board' })
    }

    return fail(200, { message: 'Successfully', boardId })
  }
};