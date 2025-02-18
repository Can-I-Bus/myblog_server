const toc = require('markdown-toc');

const test = `# 服务器测试数据

## 1. 服务器状态监控
### 1.1. CPU 使用率
#### 1.1.1. 实时监控
##### 1.1.1.1. 负载情况
##### 1.1.1.2. 核心占用率
#### 1.1.2. 历史数据分析
##### 1.1.2.1. 峰值记录
##### 1.1.2.2. 统计报表

### 1.2. 内存使用情况
#### 1.2.1. 物理内存
##### 1.2.1.1. 已使用
##### 1.2.1.2. 剩余
#### 1.2.2. 交换分区
##### 1.2.2.1. 使用率
##### 1.2.2.2. 释放策略
`;

// [
//     { content: '服务器测试数据', slug: '服务器测试数据', lvl: 1, i: 0, seen: 0 },
//     { content: '1. 服务器状态监控', slug: '1-服务器状态监控', lvl: 2, i: 1, seen: 0 },
//     {
//         content: '1.1. CPU 使用率',
//         slug: '11-cpu-使用率',
//         lvl: 3,
//         i: 2,
//         seen: 0,
//     },
//     { content: '1.1.1. 实时监控', slug: '111-实时监控', lvl: 4, i: 3, seen: 0 },
//     {
//         content: '1.1.1.1. 负载情况',
//         slug: '1111-负载情况',
//         lvl: 5,
//         i: 4,
//         seen: 0,
//     },
//     {
//         content: '1.1.1.2. 核心占用率',
//         slug: '1112-核心占用率',
//         lvl: 5,
//         i: 5,
//         seen: 0,
//     },
//     {
//         content: '1.1.2. 历史数据分析',
//         slug: '112-历史数据分析',
//         lvl: 4,
//         i: 6,
//         seen: 0,
//     },
//     {
//         content: '1.1.2.1. 峰值记录',
//         slug: '1121-峰值记录',
//         lvl: 5,
//         i: 7,
//         seen: 0,
//     },
//     {
//         content: '1.1.2.2. 统计报表',
//         slug: '1122-统计报表',
//         lvl: 5,
//         i: 8,
//         seen: 0,
//     },
//     { content: '1.2. 内存使用情况', slug: '12-内存使用情况', lvl: 3, i: 9, seen: 0 },
//     { content: '1.2.1. 物理内存', slug: '121-物理内存', lvl: 4, i: 10, seen: 0 },
//     { content: '1.2.1.1. 已使用', slug: '1211-已使用', lvl: 5, i: 11, seen: 0 },
//     { content: '1.2.1.2. 剩余', slug: '1212-剩余', lvl: 5, i: 12, seen: 0 },
//     { content: '1.2.2. 交换分区', slug: '122-交换分区', lvl: 4, i: 13, seen: 0 },
//     { content: '1.2.2.1. 使用率', slug: '1221-使用率', lvl: 5, i: 14, seen: 0 },
//     {
//         content: '1.2.2.2. 释放策略',
//         slug: '1222-释放策略',
//         lvl: 5,
//         i: 15,
//         seen: 0,
//     },
// ]
// [
//     { name: '1', anchor: 'title-1',level },
//     { name: '2', anchor: 'title-2' },
//     {
//         name: '3',
//         anchor: 'title-3',
//         chidlren: [
//             { name: '4', anchor: 'title-3-1' },
//             { name: '5', anchor: 'title-3-2' },
//         ],
//     }
// ];

function buildTree(flat_list) {
    const root = []; // 结果存储最终的树形结构
    const stack = []; // 维护层级关系

    flat_list.forEach((item) => {
        const node = {
            name: item.content,
            anchor: item.slug,
            level: item.lvl,
            children: [],
        };

        // 处理根节点
        if (stack.length === 0) {
            root.push(node);
            stack.push(node);
            return;
        }

        // 找到当前 node 的父级
        while (stack.length > 0 && stack[stack.length - 1].level >= node.level) {
            stack.pop(); // 退回到正确的父级
        }

        if (stack.length > 0) {
            const parent = stack[stack.length - 1];
            parent.children.push(node);
        } else {
            root.push(node);
        }

        stack.push(node); // 当前节点入栈
    });
    return root;
}

module.exports.formatToc = function formatToc(markdown) {
    const flat_toc = toc(markdown).json;

    return buildTree(flat_toc);
};

// formatToc(test);
