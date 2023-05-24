import { HTMLElements } from "./supportedElements";

import {
  DetailedHTMLFactory,
  ForwardRefExoticComponent,
  HTMLAttributes,
  PropsWithoutRef,
  ReactHTML,
  RefAttributes
} from "react";

export type MotionProps = {
  enter?: Keyframe[] | PropertyIndexedKeyframes | null;
  leave?: Keyframe[] | PropertyIndexedKeyframes | null;
  children?: React.ReactNode;
};

export type ForwardRefComponent<T, P> = ForwardRefExoticComponent<
  PropsWithoutRef<P> & RefAttributes<T>
>;

type UnwrapFactoryAttributes<F> = F extends DetailedHTMLFactory<infer P, any>
  ? P
  : never;
type UnwrapFactoryElement<F> = F extends DetailedHTMLFactory<any, infer P>
  ? P
  : never;

type HTMLAttributesWithoutMotionProps<
  Attributes extends HTMLAttributes<Element>,
  Element extends HTMLElement
> = { [K in Exclude<keyof Attributes, keyof MotionProps>]?: Attributes[K] };

export type HTMLMotionProps<
  TagName extends keyof ReactHTML
> = HTMLAttributesWithoutMotionProps<
  UnwrapFactoryAttributes<ReactHTML[TagName]>,
  UnwrapFactoryElement<ReactHTML[TagName]>
> &
  MotionProps;

export type HTMLMotionComponents = {
  [K in HTMLElements]: ForwardRefComponent<
    UnwrapFactoryElement<ReactHTML[K]>,
    HTMLMotionProps<K>
  >;
};
