export const UPDATE_MENU = 'UPDATE_MENU';

export function updateMenu(menu) {
  return {
    type: UPDATE_MENU,
    menu,
  };
}
