import { Component, HostBinding } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  query,
  animateChild,
  group,
  // ...
} from '@angular/animations';

export const slideInAnimation = trigger('routeAnimations', [
  transition('HomePage => AboutPage', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
      }),
    ]),
    query(':enter', [style({ left: '-100%' })]),
    query(':leave', animateChild()),
    group([
      query(':leave', [animate('300ms ease-out', style({ left: '100%' }))]),
      query(':enter', [animate('300ms ease-out', style({ left: '0%' }))]),
    ]),
    query('@*', [animateChild()], { optional: true }),
  ]),
  transition('HomePage => IngresoPage', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
      }),
    ]),
    query(':enter', [style({ top: '-100%' })]),
    query(':leave', animateChild()),
    group([
      query(':leave', [animate('300ms ease-out', style({ top: '100%' }))]),
      query(':enter', [animate('300ms ease-out', style({ top: '0%' }))]),
    ]),
    query('@*', [animateChild()], { optional: true }),
  ]),
  transition('AboutPage => HomePage', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
      }),
    ]),
    query(':enter', [style({ left: '100%' })]),
    query(':leave', animateChild()),
    group([
      query(':leave', [animate('300ms ease-out', style({ left: '-100%' }))]),
      query(':enter', [animate('300ms ease-out', style({ left: '0%' }))]),
    ]),
    query('@*', [animateChild()], { optional: true }),
  ]),
  transition('IngresoPage => HomePage', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
      }),
    ]),
    query(':enter', [style({ top: '100%' })]),
    query(':leave', animateChild()),
    group([
      query(':leave', [animate('300ms ease-out', style({ top: '-100%' }))]),
      query(':enter', [animate('300ms ease-out', style({ top: '0%' }))]),
    ]),
    query('@*', [animateChild()], { optional: true }),
  ]),
]);

// export const homesAnimation = trigger('homesAnimations', [
//   transition('* <=> *', [
//     group([
//       query(
//         ':enter',
//         [
//           style({ transform: 'translateX({{offsetEnter}}%)' }),
//           animate('0.4s ease-in-out', style({ transform: 'translateX(0%)' })),
//         ],
//         { optional: true }
//       ),
//       query(
//         ':leave',
//         [
//           style({ transform: 'translateX(0%)' }),
//           animate(
//             '0.4s ease-in-out',
//             style({ transform: 'translateX({{offsetLeave}}%)' })
//           ),
//         ],
//         { optional: true }
//       ),
//     ]),
//   ]),
// ]);
