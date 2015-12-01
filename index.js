module.exports = function(pluginArguments) {
    var Plugin = pluginArguments.Plugin;
    var t = pluginArguments.types;

    var commentToIgnoreCoverage = " istanbul ignore next ";

    function addIgnoreComment(context) {
        context.addComment("leading", commentToIgnoreCoverage, true);
    }
    return new Plugin("rewire-ignore-coverage", {
        visitor: {
            Function: {
                exit(path) {
                    // add istanbul ignore on the the rewire injected function statements
                    if (path.id && path.id.name) {
                        if (path.id.name.match(/__GetDependency__|__Rewire__|__ResetDependency__/)) {
                            addIgnoreComment(this);
                        }
                    //  add istanbul ignore for the functions assignments for $Getter, $Setter, $Resetter injections
                    } else if (this.container !== undefined &&
                      this.container.type  !== undefined &&
                      this.container.type.match(/AssignmentExpression/) &&
                      this.container.left !== undefined &&
                      this.container.left.object !== undefined &&
                      this.container.left.object.name.match(/__\$Getters__|__\$Setters__|__\$Resetters__/)) {
                        addIgnoreComment(this);
                    }
                }
            }
        }
    });
};
