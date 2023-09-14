import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals }) => {

  const getWorkspace = async () => {
    try {
      const record = await locals.pb.collection('workspaces').getFullList()
      const data = record.filter((item) => item.user === locals.user?.id)
      return structuredClone(data)
    } catch (err: any) {
      console.log('Fail to load workspaces', err)
      throw error((err.status) as number, (err.message) as string)
    }
  }

  return {
    allUserWorkspaces: await getWorkspace()
  };
}) satisfies LayoutServerLoad;