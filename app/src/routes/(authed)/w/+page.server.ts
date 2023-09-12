import type { Actions, PageServerLoad } from './$types';

export const load = (async () => {
  return {};
}) satisfies PageServerLoad;


export const actions: Actions = {
  theme: async({ cookies, url}) => {
    const theme = url.searchParams.get('theme')

    
    if(theme) {
      console.log(theme)
      cookies.set('colorTheme', theme, {
        path: '/',
        maxAge: 60 * 60 * 24 * 365,
        secure: false,
        httpOnly: false
      })
    }
  }
};