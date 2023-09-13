import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = (async ({locals}) => {

  const getAllWorkspace = async () => {
    try {
      const record = await locals.pb.collection('workspaces').getFullList()
      const data = record.filter((item) => item.user === locals.user?.id)
      return structuredClone(data)  
    } catch (err:any) {
      console.log('Fail to load all user workspaces', err);
      throw error((err.status) as number, {
        message: (err.message) as string
      })
      
    }

  }
  
  
  return {
    allUserWorkspaces: await getAllWorkspace()
  };
}) satisfies LayoutServerLoad;