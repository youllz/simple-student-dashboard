import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ params, locals }) => {
  const getboards = async () => {
    try {
      const record = await locals.pb.collection('boards').getFullList()
      const data = record.filter((item) => item.user === locals.user?.id && item.workspace === params.wId)
      return structuredClone(data)
    } catch (err: any) {
      console.log('Fail to load boards')
      throw error((err.status) as number, (err.message) as string)
    }
  }
  return {
    boards: await getboards()
  };
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