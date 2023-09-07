import { superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';
import { loginSchema } from './schema';
import { fail, redirect } from '@sveltejs/kit';

export const load = (async ({locals}) => {
  if(locals.pb.authStore.isValid) {
    // throw redirect(300,'/w')
  }
  
  return {
    form: superValidate(loginSchema)
  };
}) satisfies PageServerLoad;

export const actions: Actions = {
  default: async (event) => {
    const form = await superValidate(event, loginSchema)

    if (!form.valid) {
      return fail(400, { form })
    }

    try {
      await event.locals.pb.collection('users').authWithPassword(form.data.email, form.data.password)
    } catch (err) {
      console.log('Error: ', err)
      return fail(400, { form })
    }
    return fail(200, { form })
  }

};