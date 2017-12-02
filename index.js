class dpQLError {
    constructor(message) {
        console.error(`DataPoint dpQL - ${message}`)
    }
}

let internal = {
    generateTransformationExpression(ast) {
        if (ast === '') return '';
        var result = "$";
        if (Object.keys(ast).length == 0) result += ".";
        else {
            const recurse = obj => {
                // console.log(obj);
                const child = obj.child;
                const index = obj.index;
                const suffix = index !== undefined && index !== null ? `[${index}]` : '';
                if (child != null) {
                    result += `${obj.name + suffix}.`;
                    recurse(child);
                } else {
                    result += obj.name + suffix;
                }
            };
            recurse(ast);
        }

        return result;
    },

    generateAbstractSyntaxTree(query, abstractSyntaxTree={}){
        const nextScope = internal.findNextScope(query)

        console.log(`nextScope:`, nextScope);
        console.log(`query:`, query);

        //we should procede reccursively if the next node is not a leaf node
        if(!internal.isLeafNode(nextScope)){
            

            console.log("askdfhlasudhflsuah")
            let tag = internal.findTag(query);
      
            //find index
            let indexQueryRegex = /\[\d+]/g
            if(indexQueryRegex.test(tag)){
                //has index
                let index = tag.match(indexQueryRegex)[0]
                index = index.substring(1, index.length - 1)
      
                return {
                    name: tag.replace(indexQueryRegex, "").trim(),
                    index,
                    child: internal.generateAbstractSyntaxTree(nextScope, abstractSyntaxTree.child)
                }
            }else{
                return {
                    name: tag.trim(),
                    child: internal.generateAbstractSyntaxTree(nextScope, abstractSyntaxTree.child)
                }
            }
        }else{
            return {name: nextScope.trim()}
        }
      },


    findMatchingBracket(string) { //assumes that first char of string is bracket
        let chars = Array.from(string);

        let tally = 0;

        for (let i in chars) {
            if (chars[i] === "{") {
                tally++;
            } else if (chars[i] === "}") {
                tally--;

                if (tally === 0) {
                    return i;
                }
            }

        }
    },

    findNextScope(query) {
        let startingIndex = query.indexOf("{");
        let scopedQuery = query.substring(startingIndex);
        let endIndex = internal.findMatchingBracket(scopedQuery)
        return scopedQuery.substring(1, endIndex)
    },

    findTag(string) {
        return string.trim().match(/.*(?={)/g)[0]
    },

    isLeafNode(scope) {
        return !/{/.test(scope)
    }
}

function dpQL(strings) {
    let completeString = strings.reduce((prev, curr) => prev + curr)
                                .replace(/\s+/g, "") //get rid of whitespace (we don't care about it, it just get's in the way)


    //error check
    if(!completeString){
        throw new Error(`dpQL query - no query detectd in '${completeString}'`)
    }

    return internal.generateTransformationExpression(internal.generateAbstractSyntaxTree(completeString))
}

module.exports = { dpQL, internal };
