/**
 * @module
 * A small library to convert Hono JSX to React JSX
 */

import type { Child } from "hono/jsx";
import type { HtmlEscapedString } from "hono/utils/html";

export type HonoElement = HtmlEscapedString | Promise<HtmlEscapedString>;
export interface ReactElement {
  type: string;
  props: object;
  key: string | null;
}

/**
 * Converts Hono JSX elements to React-compatible elements.
 *
 * @template TJSX - The type of the input JSX element, extending Child.
 * @template TReturnType - The return type, determined based on the input type.
 *
 * @param {TJSX} jsx - The Hono JSX element to convert.
 * @returns {TReturnType} The converted React-compatible element.
 *
 * @throws {TypeError} If async components is used (not yet supported).
 */
export function toReactNode<
  const TJSX extends Child,
  TReturnType = TJSX extends HonoElement[]
    ? ReactElement[]
    : TJSX extends HonoElement
      ? ReactElement
      : TJSX,
>(
  jsx: TJSX,
): TReturnType {
  if (!jsx) return null as TReturnType;
  if (Array.isArray(jsx)) {
    return jsx.map((child) => toReactNode(child)) as TReturnType;
  }
  if (typeof jsx === "string") return jsx as TReturnType;
  if (typeof jsx === "number") return jsx as TReturnType;
  if (typeof jsx === "boolean") return jsx as TReturnType;

  if (typeof jsx === "object" && jsx instanceof Promise) {
    throw new TypeError("Async Components is not yet supported");
  }

  if (typeof jsx.tag === "function") {
    const node = jsx.tag({ ...jsx.props, children: jsx.children });

    return !node.tag ? toReactNode(node.children) : toReactNode(node);
  }

  const { tag, props } = jsx;

  const children = jsx.children?.map((child) =>
    toReactNode(child as HonoElement),
  );

  return {
    type: tag,
    key: null,
    props: {
      ...props,
      children: children.length === 1 ? children[0] : children,
    },
  } as TReturnType;
}
