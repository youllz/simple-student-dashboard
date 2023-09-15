import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals, params }) => {

  const getWorkspace = async () => {
    try {
      const record = await locals.pb.collection('workspaces').getFullList({
        sort: '-created'
      })
      const data = record.filter((item) => item.user === locals.user?.id)
      return structuredClone(data)
    } catch (err: any) {
      console.log('Fail to load workspaces', err)
      throw error((err.status) as number, (err.message) as string)
    }
  }

  const getCourses = async () => {
    try {
      const record = await locals.pb.collection('courses').getFullList({
        sort: '-created'
      })
      const data = record.filter((item) => item.board === params.bId && item.user === locals.user?.id)
      return structuredClone(data)
    } catch (err: any) {
      console.log('Fail to load courses')
      throw error((err.status) as number, (err.message) as string)
    }
  }

  return {
    allUserWorkspaces: await getWorkspace(),
    currentBoardCourses: await getCourses()
  };
}) satisfies LayoutServerLoad;