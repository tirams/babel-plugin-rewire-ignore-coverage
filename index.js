// support for commenting out rewire code for istanbul coverage
module.exports = function({types: t}) {
    var commentToIgnoreCoverage = " istanbul ignore next ";
    var methodsToIgnoreRegEx =
        /_get__|_get_original__|_assign__|_set_original__|_update_operation__|_set__|_reset__|_with__|_filterWildcardImport__|addNonEnumerableProperty/;

    function addIgnoreComment(context, addBefore) {
        var where = addBefore ? "leading" : "trailing" ;
        context.addComment(where, commentToIgnoreCoverage, true);
    }

    return {
        visitor: {
            Function(path) {
                // add istanbul ignore on the the rewire injected function statements
                if (path.node.id && path.node.id.name) {
                    if (methodsToIgnoreRegEx.exec(path.node.id.name) !== null) {
                        addIgnoreComment(path, true);
                    }
                    if (path.node.id.name === 'addNonEnumerableProperty') {
                        addIgnoreComment(path, false);
                    }
                }
            },
            VariableDeclaration: function VariableDeclaration(path) {
                if (path.node.kind == 'var') {
                    for (var i = 0; i < path.node.declarations.length; i++) {
                        var declar = path.node.declarations[i];
                        if (declar.id && declar.id.name && declar.id.name == '_typeof') {
                            addIgnoreComment(path, true);
                        }
                    }
                }
            }
        }
    };
};
