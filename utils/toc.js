const toc = require('markdown-toc');
const marked = require('marked');

function buildTreeWithIds(flatList) {
    const root = [];
    const stack = [];
    let idCounter = 0;

    return flatList.map((item) => {
        const node = {
            name: item.content,
            id: `heading-${++idCounter}`, // 生成唯一ID
            level: item.lvl,
            children: [],
        };

        // 保持原有层级处理逻辑
        if (stack.length === 0) {
            root.push(node);
            stack.push(node);
        } else {
            while (stack.length && stack[stack.length - 1].level >= node.level) {
                stack.pop();
            }
            if (stack.length) {
                stack[stack.length - 1].children.push(node);
            } else {
                root.push(node);
            }
            stack.push(node);
        }
        return node;
    });
}

module.exports.formatToc = (markdown) => {
    // 1. 生成带ID的HTML
    const renderer = new marked.Renderer();
    const headingIds = new Map(); // 存储标题与ID的映射

    renderer.heading = (text, level) => {
        const slug = toc.slugify(text);
        const id = `h${level}-${slug}`; // 生成层级化ID
        headingIds.set(text, id);
        return `<h${level} id="${id}">${text}</h${level}>`; // 直接输出带ID的HTML
    };

    const html = marked(markdown, { renderer });

    // 2. 生成与HTML对应的目录树
    const tocData = toc(markdown).json.map((item) => ({
        ...item,
        id: headingIds.get(item.content), // 同步ID
    }));

    return {
        html, // 带ID的HTML内容
        tree: buildTreeWithIds(tocData), // 包含同步ID的目录树
    };
};
