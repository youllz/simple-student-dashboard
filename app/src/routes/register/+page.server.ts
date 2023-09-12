import type { Actions, PageServerLoad } from './$types';
import { superValidate } from "sveltekit-superforms/server";
import { registerSchema } from "./schema";
import { fail } from '@sveltejs/kit';


export const load = (async ({locals}) => {


  return {
    loginForm: superValidate(registerSchema),
   
  };
}) satisfies PageServerLoad;

export const actions: Actions = {
  default: async (event) => {
    const loginForm = await superValidate(event, registerSchema);


    if (!loginForm.valid) {
      return fail(400, {
        loginForm
      });
    }




    let emailFound = false

    try {
     
      await event.locals.pb.collection('users').create(loginForm.data)

    } catch (err) {
      console.log('Error: ', err)
      return fail(400, { loginForm })
    }


    return fail(200, { loginForm })
  }
};