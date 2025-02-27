/**
 * @module Agents
 * @description
 * This module provides a set of constants to detect the user agent.
 */
export const isFirefox = typeof window !== 'undefined' && window.navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
export const isSafari = typeof window !== 'undefined' && window.navigator.userAgent.toLowerCase().indexOf('safari') > -1;
export const isMobile = typeof window !== 'undefined' && /Mobi/.test(window.navigator.userAgent);
export const isTouchDevice = typeof window !== 'undefined' && 'ontouchstart' in window;
export const isIE = typeof window !== 'undefined' && window.navigator.userAgent.indexOf('MSIE') !== -1;
export const isEdge = typeof window !== 'undefined' && window.navigator.userAgent.indexOf('Edge') !== -1;
export const isChrome = typeof window !== 'undefined' && window.navigator.userAgent.indexOf('Chrome') !== -1;
export const isOpera = typeof window !== 'undefined' && window.navigator.userAgent.indexOf('OPR') !== -1;
export const isBlink = typeof window !== 'undefined' && (isChrome || isOpera) && !!window.CSS;
export const isMac = typeof window !== 'undefined' && window.navigator.platform.toUpperCase().indexOf('MAC') >= 0;
export const isWindows = typeof window !== 'undefined' && window.navigator.platform.toUpperCase().indexOf('WIN') >= 0;
export const isLinux = typeof window !== 'undefined' && window.navigator.platform.toUpperCase().indexOf('LINUX') >= 0;
export const isAndroid = typeof window !== 'undefined' && window.navigator.userAgent.indexOf('Android') !== -1;
export const isIOS = typeof window !== 'undefined' && /iPad|iPhone|iPod/.test(window.navigator.userAgent);