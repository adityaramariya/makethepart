import { LOADER_HIDE, LOADER_SHOW } from '../types';

export const actionLoaderShow = () => {
  return {
    type: LOADER_SHOW,
    payload: true
  }
}

export const actionLoaderHide = () => {
  return {
    type: LOADER_HIDE,
    payload: false
  }
}