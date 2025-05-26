import { expect, test } from "vitest";
import { normalizeURL, getURLsFromHTML } from "./crawl";
import { JSDOM } from "jsdom";





// normalizeUrl tests
test("case1: remove https and extra /", () => {
    expect(normalizeURL("https://blog.boot.dev/path/")).toBe("blog.boot.dev/path");
});

test("case2: remove https",() => {
    expect(normalizeURL("https://blog.boot.dev/path")).toBe("blog.boot.dev/path");
});

test("case3: remove http:// and extra /", ()=>{
    expect(normalizeURL("http://blog.boot.dev/path/")).toBe("blog.boot.dev/path");
});

test("case4: remove http://", () => {
    expect(normalizeURL("http://blog.boot.dev/path")).toBe("blog.boot.dev/path");
});



