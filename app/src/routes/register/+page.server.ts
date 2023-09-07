import type { Actions, PageServerLoad } from './$types';
import { superValidate } from "sveltekit-superforms/server";
import { registerSchema } from "./schema";
import { fail } from '@sveltejs/kit';


export const load = (async () => {
  return {
    loginForm: superValidate(registerSchema)
  };
}) satisfies PageServerLoad;

export const actions: Actions = {
  default: async (event) => {
    const loginForm = await superValidate(event, registerSchema);

    console.log(loginForm)

    if (!loginForm.valid) {
      return fail(400, {
        loginForm
      });
    }




    let emailFound = false

    try {
      const users = await event.locals.pb.collection('users').getFullList()
      // console.log(users)

      for (let i = 0; i < users.length; i++) {
        if (users[i].email === loginForm.data.email) {
          emailFound = true
          console.log(emailFound)
          return fail(400, { loginForm, message: 'this email already use' })
        }
      }
      await event.locals.pb.collection('users').create(loginForm.data)

    } catch (err) {
      console.log('Error: ', err)
      return fail(400, { loginForm })
    }


    return fail(200, { loginForm })
  }
};