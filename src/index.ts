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

export function toReactNode<
  const TJSX extends Child,
  TReturnType = TJSX extends HonoElement[]
    ? ReactElement[]
    : TJSX extends HonoElement
      ? ReactElement
      : TJSX,
>(
  jsx_: TJSX,
): TReturnType {
  const jsx = jsx_ as Exclude<Child, Promise<string>>;

  if (!jsx) return null as TReturnType;
  if (Array.isArray(jsx)) {
    return jsx.map(toReactNode) as TReturnType;
  }

  if (typeof jsx === "string") return jsx as TReturnType;
  if (typeof jsx === "number") return jsx as TReturnType;
  if (typeof jsx === "boolean") return jsx as TReturnType;

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
