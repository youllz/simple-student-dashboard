import { pb } from "$lib/server/pocketbase";
import type { Handle } from "@sveltejs/kit";

export const handle:Handle = async({event, resolve}) => {

  pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '')

  if(pb.authStore.isValid) {


    try {
      pb.collection('users').authRefresh()
    } catch (_) {
      pb.authStore.clear()
    }
  }

  event.locals.pb = pb
  event.locals.user =  structuredClone(pb.authStore.model)

  const response = await resolve(event)

  response.headers.set('set-cookie', event.locals.pb.authStore.exportToCookie())

  return response



}
