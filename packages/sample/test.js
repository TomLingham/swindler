(async () => console.log(await { then: (r, j) => r("foo") }))();

async function foo() {
  console.log("Hello,");
  const v = await { then: () => "World!" };
  console.log(v);
}

foo();

// (async () => {
//   console.log("Hello");
//   const s = await { then: (r, j) => r("test") };
//   console.log("world", { s });
// })();
