// support for commenting out rewire code for istanbul coverage
module.exports = function({types: t}) {
    var commentToIgnoreCoverage = " istanbul ignore next ";
    var methodsToIgnoreRegEx =
        /_get__|_get_original__|_assign__|_set_original__|_update_operation__|_set__|_reset__|_with__/;
    function addIgnoreComment(context) {
        context.addComment("leading", commentToIgnoreCoverage, true);
    }
    return {
        visitor: {
            Function(path) {
                // add istanbul ignore on the the rewire injected function statements
                if (path.node.id && path.node.id.name &&
                    methodsToIgnoreRegEx.exec(path.node.id.name) !== null) {
                    addIgnoreComment(path);
                }
            }
        }

    };
};
