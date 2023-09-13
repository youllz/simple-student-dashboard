import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load = (async () => {
  return {};
}) satisfies PageServerLoad;


export const actions: Actions = {
  // theme: async({ cookies, url}) => {
  //   const theme = url.searchParams.get('theme')


  //   if(theme) {
  //     console.log(theme)
  //     cookies.set('colorTheme', theme, {
  //       path: '/',
  //       maxAge: 60 * 60 * 24 * 365,
  //       secure: false,
  //       httpOnly: false
  //     })
  //   }
  // }

  createWorkspace: async ({request, locals}) => {
    const formData = Object.fromEntries(await request.formData()) as {name:string, description:string}

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
      return fail(400, {message: 'Fail to create Workspace.'})
    }

    return fail(200, {workspaceId})
  }
};


