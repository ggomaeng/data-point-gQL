const dataPointQL = require("./index");

test("Empty query test", () => {
  const query = {};
  console.log(`query: {}, output: $.`)
  expect(dataPointQL.gql(query)).toBe("$.");
});

test("No child", () => {
  const query = {
      name: "id1"
    };
  console.log(`query: ${JSON.stringify(query)}, output: $id1`)
  expect(dataPointQL.gql(query)).toBe("$id1");
});

test("No child with undefined index", () => {
  const query = {
      name: "id1",
      index: null
    };
  console.log(`query: ${JSON.stringify(query)}, output: $id1`)
  expect(dataPointQL.gql(query)).toBe("$id1");
});

test("No child with index 0", () => {
  const query = {
      name: "id1",
      index: 0
    };
  console.log(`query: ${JSON.stringify(query)}, output: $id1[0]`)
  expect(dataPointQL.gql(query)).toBe("$id1[0]");
});

test("Single child", () => {
  const query = {
      name: "id1",
      child: {
          name: "id2"
      }
    };
  console.log(`query: ${JSON.stringify(query)}, output: $id1.id2`)
  expect(dataPointQL.gql(query)).toBe("$id1.id2");
});

test("Single child with index on parent", () => {
  const query = {
      name: "id1",
      index: 0,
      child: {
          name: "id2"
      }
    };
  console.log(`query: ${JSON.stringify(query)}, output: $id1[0].id2`)
  expect(dataPointQL.gql(query)).toBe("$id1[0].id2");
});

test("Single child with index on child", () => {
  const query = {
      name: "id1",
      child: {
          name: "id2",
          index: 0
      }
    };
  console.log(`query: ${JSON.stringify(query)}, output: $id1.id2[0]`)
  expect(dataPointQL.gql(query)).toBe("$id1.id2[0]");
});

test("Single child with index on both the parent and the child", () => {
  const query = {
      name: "id1",
      index: 0,
      child: {
          name: "id2",
          index: 0
      }
    };
  console.log(`query: ${JSON.stringify(query)}, output: $id1[0].id2[0]`)
  expect(dataPointQL.gql(query)).toBe("$id1[0].id2[0]");
});


test("Double child", () => {
  const query = {
      name: "id1",
      child: {
          name: "id2",
          child: {
              name: "id3"
          }
      }
    };
  console.log(`query: ${JSON.stringify(query)}, output: $id1.id2.id3`)
  expect(dataPointQL.gql(query)).toBe("$id1.id2.id3");
});

test("Double child with index on last child", () => {
  const query = {
      name: "id1",
      child: {
          name: "id2",
          child: {
              name: "id3",
              index: 1
          }
      }
    };
  console.log(`query: ${JSON.stringify(query)}, output: $id1.id2.id3[1]`)
  expect(dataPointQL.gql(query)).toBe("$id1.id2.id3[1]");
});

test("Double child with index on root last child", () => {
  const query = {
      name: "id1",
      index: 0,
      child: {
          name: "id2",
          child: {
              name: "id3",
              index: 1
          }
      }
    };
  console.log(`query: ${JSON.stringify(query)}, output: $id1[0].id2.id3[1]`)
  expect(dataPointQL.gql(query)).toBe("$id1[0].id2.id3[1]");
});

test("Double child with index on all", () => {
  const query = {
      name: "id1",
      index: 0,
      child: {
          name: "id2",
          index: 1231,
          child: {
              name: "id3",
              index: 1
          }
      }
    };
  console.log(`query: ${JSON.stringify(query)}, output: $id1[0].id2[1231].id3[1]`)
  expect(dataPointQL.gql(query)).toBe("$id1[0].id2[1231].id3[1]");
});

test("100% TEST COVERAGE", () => {
console.log('\x1b[36m%s\x1b[0m', `                                                                                                   
 ___   ___ ___ __ __    _____ _____ _____ _____    _____ _____ _____ _____ _____ _____ _____ _____ 
|_  | |   |   |__|  |  |_   _|   __|   __|_   _|  |     |     |  |  |   __| __  |  _  |   __|   __|
 _| |_| | | | |   __|    | | |   __|__   | | |    |   --|  |  |  |  |   __|    -|     |  |  |   __|
|_____|___|___|__|__|    |_| |_____|_____| |_|    |_____|_____|\___/|_____|__|__|__|__|_____|_____|
                                                                                                  `);
} )
