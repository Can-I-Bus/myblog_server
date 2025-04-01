const marked = require('marked');
const toc = require('markdown-toc');
const md5 = require('md5');

function buildTree(flatList) {
    const root = [];
    const stack = [];

    flatList.forEach((item) => {
        // 生成唯一ID：层级 + 内容MD5前8位
        const hash = md5(item.content).slice(0, 8);
        const node = {
            name: item.content,
            id: `h${item.lvl}-${hash}`,
            level: item.lvl,
            children: [],
        };

        while (stack.length && stack[stack.length - 1].level >= node.level) {
            stack.pop();
        }

        if (stack.length) {
            stack[stack.length - 1].children.push(node);
        } else {
            root.push(node);
        }

        stack.push(node);
    });

    return root;
}

module.exports.formatToc = (markdown) => {
    //生成带唯一ID的HTML
    const renderer = new marked.Renderer();

    renderer.heading = (text, level) => {
        const hash = md5(text).slice(0, 8);
        const id = `h${level}-${hash}`;
        return `<h${level} id="${id}">${text}</h${level}>`;
    };

    //生成HTML
    const html = marked.parse(markdown, { renderer });

    //生成目录树（使用相同ID生成逻辑）
    const tocData = toc(markdown).json.map((item) => ({
        ...item,
        id: `h${item.lvl}-${md5(item.content).slice(0, 8)}`,
    }));

    return {
        html,
        tree: buildTree(tocData),
    };
};
