const { dpQL, internal } = require("./index");

describe("Unit Tests", () => {
    describe("Query String → AST", () => {
        describe("Find Tag", ()=>{
            test("Base Case", ()=>{
                let query = `
                hello{
                    foo{
                        bar
                    }
                }
                `

                expect(internal.findTag(query)).toBe("hello")
            })

            test("Empty Case", ()=>{
                let query = `
                {
                    foo{
                        bar
                    }
                }
                `

                expect(internal.findTag(query)).toBe("")
            })

        })
    })

    describe("AST → Transformation Expression", () => {
        describe("Case: Empty", () => {
            test("Empty query", () => {
                const ast = {};
                expect(internal.generateTransformationExpression(ast)).toBe("$.");
            });
        })

        describe("Case: No Child", () => {
            test("Base Case", () => {
                const ast = {
                    name: "id1"
                };
                expect(internal.generateTransformationExpression(ast)).toBe("$id1");
            });

            test("Case: With undefined index", () => {
                const ast = {
                    name: "id1",
                    index: null
                };
                expect(internal.generateTransformationExpression(ast)).toBe("$id1");
            });

            test("Case: With index 0", () => {
                const ast = {
                    name: "id1",
                    index: 0
                };
                expect(internal.generateTransformationExpression(ast)).toBe("$id1[0]");
            });
        })

        describe("Case: Single Child", () => {
            test("Base Case", () => {
                const ast = {
                    name: "id1",
                    child: {
                        name: "id2"
                    }
                };
                expect(internal.generateTransformationExpression(ast)).toBe("$id1.id2");
            });

            test("Single child with index on parent", () => {
                const ast = {
                    name: "id1",
                    index: 0,
                    child: {
                        name: "id2"
                    }
                };
                expect(internal.generateTransformationExpression(ast)).toBe("$id1[0].id2");
            });

            test("Single child with index on child", () => {
                const ast = {
                    name: "id1",
                    child: {
                        name: "id2",
                        index: 0
                    }
                };
                expect(internal.generateTransformationExpression(ast)).toBe("$id1.id2[0]");
            });

            test("Single child with index on both the parent and the child", () => {
                const ast = {
                    name: "id1",
                    index: 0,
                    child: {
                        name: "id2",
                        index: 0
                    }
                };
                expect(internal.generateTransformationExpression(ast)).toBe("$id1[0].id2[0]");
            });
        })

        describe("Case: Double Child", () => {
            test("Base Case", () => {
                const ast = {
                    name: "id1",
                    child: {
                        name: "id2",
                        child: {
                            name: "id3"
                        }
                    }
                };
                expect(internal.generateTransformationExpression(ast)).toBe("$id1.id2.id3");
            });

            test("Double child with index on last child", () => {
                const ast = {
                    name: "id1",
                    child: {
                        name: "id2",
                        child: {
                            name: "id3",
                            index: 1
                        }
                    }
                };
                expect(internal.generateTransformationExpression(ast)).toBe("$id1.id2.id3[1]");
            });

            test("Double child with index on root last child", () => {
                const ast = {
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
                expect(internal.generateTransformationExpression(ast)).toBe("$id1[0].id2.id3[1]");
            });

            test("Double child with index on all", () => {
                const ast = {
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
                expect(internal.generateTransformationExpression(ast)).toBe("$id1[0].id2[1231].id3[1]");
            });
        })
    })
})

describe("Product Tests", () => {
    //we test different use-cases
    describe("Use-Case Testing", () => {
        test("#1", () => {
            let query = dpQL`
                {
                    hello{
                        foo{
                            bar
                        }
                    }
                }
            `
            expect(query).toBe("$.hello.foo.bar")
        })

        test("#2", () => {
            let query = dpQL`{hello}
        `
            expect(query).toBe("$hello")
        })
    })

    describe("Error Checking Tests", () => {
        test("Empty string", () => {
            expect(() => dpQL``).toThrow(/no query detectd/)
        })

        test("Empty query object", () => {
            let result = dpQL`{}`
            expect(result).toBe("$.")
        })

        test("White Space Only", () => {
            expect(() => dpQL`
                             
                        

            ` ).toThrow(/no query detectd/)
        })

        describe.skip("Unbalenced Brackets", () => {

            test("Unbalenced Brackets #1", () => {
                let result = dpQL`
                {
                    foo{
                        bar
                    }}
                }}
                `
                expect(result).toThrow(/unexpected amount of closing brackets/)
            })

            test("Unbalenced Brackets #2", () => {
                let result = dpQL`
                {{
                    foo{{
                        bar
                    }
                }
                `
                expect(result).toThrow(/unexpected bracket/)
            })

            test("Unbalenced Brackets #3", () => {
                let result = dpQL`
                {
                    foo{a{
                        bar
                    }
                }}
                `

                //the query above get's interpreted as:
                /*
                    {
                        foo{
                            {
                                bar
                            }
                        }
                    }
                    
                    {
                        "name":"",
                        "child":{
                            "name":"foo{",
                            "child":{
                                "name":"",
                                "child":{
                                    "name":"bar"
                                }
                            }
                        }
                    }
    
    
                    $.foo{..bar
                */

                console.log(`result:`, result);

                expect(result).toThrow()
            })


            test("Balenced - Brackets Only", () => {
                let result = dpQL`{  { {      {}}}    }`
                expect(result).toThrowError()
            })

            test("Unbalenced Brackets Only", () => {
                let result = dpQL`
                    {{{{{}}
                `
                expect(result).toThrowError()
            })

        })

    })
})


//integration tests are full tests where we actually create data points and test various data point functionality like hash, tranform, etc
describe("Integration Tests", () => {
    //todo: implement integration tests
    test.skip("todo", ()=>{
        return false;
    })
})