const context = require.context('./src', true, /message\.liquid$/);

const cache = {};

context.keys().forEach(function (key) {
    cache[key] = context(key);
});

function replaceHtml(key, startCommentNode) {
    const commentNodeType = startCommentNode.nodeType;
    while (
        startCommentNode.nextSibling.nodeType !== commentNodeType ||
        !startCommentNode.nextSibling.nodeValue.includes(`hmr-end: ${key}`)
    ) {
        startCommentNode.nextSibling.remove();
    }

    const tpl = document.createElement('template');
    tpl.innerHTML = cache[key];
    startCommentNode.parentNode.insertBefore(tpl.content, startCommentNode.nextSibling);
}

if (module.hot) {
    module.hot.accept(context.id, function () {
        const newContext = require.context('./src', true, /message\.liquid$/);
        const changes = [];
        newContext.keys().forEach(function (key) {
            const newFile = newContext(key);
            if (cache[key] !== newFile) {
                changes.push(key);
                cache[key] = newFile;
            }
        });

        changes.forEach((changedFile) => {
            traverseHMRComments(changedFile, replaceHtml);
        });
    });
}

function traverseHMRComments(file, callback) {
    const nodeIterator = document.createNodeIterator(
        document.body,
        NodeFilter.SHOW_COMMENT,
        function (node) {
            return node.nodeValue.includes(`hmr-start: ${file}`)
                ? NodeFilter.FILTER_ACCEPT
                : NodeFilter.FILTER_REJECT;
        }
    );

    while (nodeIterator.nextNode()) {
        callback(file, nodeIterator.referenceNode);
    }
}
