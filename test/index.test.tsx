/** @jsx jsx */
/** @jsxImportSource hono/jsx */
/** @jsxFrag */

import { describe, expect, it } from "vitest";
import type { JSX } from "hono/jsx/jsx-runtime";
import { toReactNode } from "../src";

function TestComponent() {
  return (
    <div
      id="foo"
      className="bar"
      baz={{ hello: "world" }}
      qux={{ foo: { bar: "baz" } }}
    >
      foo
    </div>
  );
}

function TestComponentWithChildren({
  children,
  isTest,
}: {
  children: JSX.Element;
  isTest: boolean;
}) {
  return (
    <div
      id="foo"
      className="bar"
      baz={{ hello: "world" }}
      qux={{ foo: { bar: "baz" } }}
      is-test={isTest}
    >
      {children}
    </div>
  );
}

describe("primitives", () => {
  it.each([
    ["string", "foo", "foo"],
    ["number", 42, 42],
    ["boolean", true, true],
    ["null", null, null],
    ["undefined", undefined, null],
  ])("handle %s", (_, input, expected) => {
    expect(toReactNode(input)).toBe(expected);
  });

  it("handle multiple primitives", () => {
    expect(toReactNode(["foo", 42, true])).toMatchInlineSnapshot(`
      [
        "foo",
        42,
        true,
      ]
    `);
  });
});

it("handle empty elements", () => {
  expect(toReactNode(<div />)).toMatchInlineSnapshot(`
      {
        "key": null,
        "props": {
          "children": [],
        },
        "type": "div",
      }
    `);
});

it("handle empty elements with props", () => {
  expect(toReactNode(<div id="foo" />)).toMatchInlineSnapshot(`
      {
        "key": null,
        "props": {
          "children": [],
          "id": "foo",
        },
        "type": "div",
      }
    `);
});

it("handle empty fragments", () => {
  expect(toReactNode(<></>)).toMatchInlineSnapshot(`[]`);
});

it("handle fragments", () => {
  expect(
    toReactNode(
      <>
        <div>foo</div>
        <div>bar</div>
      </>,
    ),
  ).toMatchInlineSnapshot(`
    [
      {
        "key": null,
        "props": {
          "children": "foo",
        },
        "type": "div",
      },
      {
        "key": null,
        "props": {
          "children": "bar",
        },
        "type": "div",
      },
    ]
  `);
});

describe("children", () => {
  it("primitive children", () => {
    expect(toReactNode(<div>foo</div>)).toMatchInlineSnapshot(`
      {
        "key": null,
        "props": {
          "children": "foo",
        },
        "type": "div",
      }
    `);
  });

  it("multiple primitive children", () => {
    expect(
      toReactNode(
        <div>
          foo
          {42}
          bar
        </div>,
      ),
    ).toMatchInlineSnapshot(`
      {
        "key": null,
        "props": {
          "children": [
            "foo",
            42,
            "bar",
          ],
        },
        "type": "div",
      }
    `);
  });

  it("nested children", () => {
    expect(
      toReactNode(
        <div>
          <span>foo</span>
          <span>bar</span>
        </div>,
      ),
    ).toMatchInlineSnapshot(`
      {
        "key": null,
        "props": {
          "children": [
            {
              "key": null,
              "props": {
                "children": "foo",
              },
              "type": "span",
            },
            {
              "key": null,
              "props": {
                "children": "bar",
              },
              "type": "span",
            },
          ],
        },
        "type": "div",
      }
    `);
  });
});

it("handle array of elements", () => {
  expect(toReactNode([<div>foo</div>, <div>bar</div>])).toMatchInlineSnapshot(`
    [
      {
        "key": null,
        "props": {
          "children": "foo",
        },
        "type": "div",
      },
      {
        "key": null,
        "props": {
          "children": "bar",
        },
        "type": "div",
      },
    ]
  `);
});

it("handle array of elements with primitives", () => {
  expect(toReactNode([<div>foo</div>, "bar", <div>baz</div>]))
    .toMatchInlineSnapshot(`
    [
      {
        "key": null,
        "props": {
          "children": "foo",
        },
        "type": "div",
      },
      "bar",
      {
        "key": null,
        "props": {
          "children": "baz",
        },
        "type": "div",
      },
    ]
  `);
});

describe("props", () => {
  it("single prop", () => {
    expect(toReactNode(<div id="foo" />)).toMatchInlineSnapshot(`
      {
        "key": null,
        "props": {
          "children": [],
          "id": "foo",
        },
        "type": "div",
      }
    `);
  });

  it("multiple props", () => {
    expect(
      toReactNode(<div id="foo" className="bar" baz={{ hello: "world" }} />),
    ).toMatchInlineSnapshot(`
      {
        "key": null,
        "props": {
          "baz": {
            "hello": "world",
          },
          "children": [],
          "className": "bar",
          "id": "foo",
        },
        "type": "div",
      }
    `);
  });

  it("deeply nested props", () => {
    expect(
      toReactNode(
        <div
          id="foo"
          className="bar"
          baz={{ hello: "world" }}
          qux={{ foo: { bar: "baz" } }}
        />,
      ),
    ).toMatchInlineSnapshot(`
      {
        "key": null,
        "props": {
          "baz": {
            "hello": "world",
          },
          "children": [],
          "className": "bar",
          "id": "foo",
          "qux": {
            "foo": {
              "bar": "baz",
            },
          },
        },
        "type": "div",
      }
    `);
  });

  it("children and props", () => {
    expect(
      toReactNode(
        <div
          id="foo"
          className="bar"
          baz={{
            hello: "world",
          }}
        >
          hello
        </div>,
      ),
    ).toMatchInlineSnapshot(`
      {
        "key": null,
        "props": {
          "baz": {
            "hello": "world",
          },
          "children": "hello",
          "className": "bar",
          "id": "foo",
        },
        "type": "div",
      }
    `);
  });
});

it("handle single component", () => {
  expect(toReactNode(<TestComponent />)).toMatchInlineSnapshot(`
    {
      "key": null,
      "props": {
        "baz": {
          "hello": "world",
        },
        "children": "foo",
        "className": "bar",
        "id": "foo",
        "qux": {
          "foo": {
            "bar": "baz",
          },
        },
      },
      "type": "div",
    }
  `);
});

it("handle single component with children", () => {
  expect(
    toReactNode(
      <TestComponentWithChildren isTest={true}>
        <h1>Hello!</h1>
      </TestComponentWithChildren>,
    ),
  ).toMatchInlineSnapshot(`
    {
      "key": null,
      "props": {
        "baz": {
          "hello": "world",
        },
        "children": {
          "key": null,
          "props": {
            "children": "Hello!",
          },
          "type": "h1",
        },
        "className": "bar",
        "id": "foo",
        "is-test": true,
        "qux": {
          "foo": {
            "bar": "baz",
          },
        },
      },
      "type": "div",
    }
  `);
});

it("handle multiple components", () => {
  expect(toReactNode([<TestComponent />, <TestComponent />]))
    .toMatchInlineSnapshot(`
    [
      {
        "key": null,
        "props": {
          "baz": {
            "hello": "world",
          },
          "children": "foo",
          "className": "bar",
          "id": "foo",
          "qux": {
            "foo": {
              "bar": "baz",
            },
          },
        },
        "type": "div",
      },
      {
        "key": null,
        "props": {
          "baz": {
            "hello": "world",
          },
          "children": "foo",
          "className": "bar",
          "id": "foo",
          "qux": {
            "foo": {
              "bar": "baz",
            },
          },
        },
        "type": "div",
      },
    ]
  `);
});

it("handle multiple components with children", () => {
  expect(
    toReactNode([
      <TestComponentWithChildren isTest={true}>
        <h1>Hello!</h1>
      </TestComponentWithChildren>,
      <TestComponentWithChildren isTest={true}>
        <h1>Hello!</h1>
      </TestComponentWithChildren>,
    ]),
  ).toMatchInlineSnapshot(`
    [
      {
        "key": null,
        "props": {
          "baz": {
            "hello": "world",
          },
          "children": {
            "key": null,
            "props": {
              "children": "Hello!",
            },
            "type": "h1",
          },
          "className": "bar",
          "id": "foo",
          "is-test": true,
          "qux": {
            "foo": {
              "bar": "baz",
            },
          },
        },
        "type": "div",
      },
      {
        "key": null,
        "props": {
          "baz": {
            "hello": "world",
          },
          "children": {
            "key": null,
            "props": {
              "children": "Hello!",
            },
            "type": "h1",
          },
          "className": "bar",
          "id": "foo",
          "is-test": true,
          "qux": {
            "foo": {
              "bar": "baz",
            },
          },
        },
        "type": "div",
      },
    ]
  `);
});
