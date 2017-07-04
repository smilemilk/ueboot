<template>
    <div class="dbTreeScroll" style="padding-top: 10px">
        <div class="dbTree jstree-default jstree-checkbox-selection">
            <ul class="jstree-container-ul jstree-children jstree-wholerow-ul jstree-no-dots">
                <u-tree-node :tree="treeNode" :showCheckbox="showCheckbox" v-on:itemClick="listenerItemClick"
                             :parentNode="parentNode"></u-tree-node>
            </ul>
        </div>
    </div>
</template>

<script type="text/jsx">
    import UTreeNode from "./UTreeNode.vue";
    export default {
        name: 'UTree',
        componentName: 'UTree',
        props: {
            showCheckbox: {
                type: Boolean,
                default: false
            },
            tree: Array,
        },
        components: {
          UTreeNode: UTreeNode
        },

        data() {
            return {
                expanded: false,
                parentNode: null,
            };
        },
        computed:{
            treeNode: function () {
                console.log("computed treeNode");
               let treeNode =  this.initTree();
               console.log(treeNode);
                return treeNode;
            }
        },
        created(){

        },
        methods: {
            //构造树结构
            initTree(){
                //1.查找root
                let root = null;
                this.tree.forEach((item) => {
                    if (!item.parentId || item.parentId === null) {
                        root = {
                            text: item.name,
                            attr: item,
                            opened: true,
                            iconClass: "icon-state-warning",
                            treeId: item.id
                        };
                    }
                });

                if (!root) {
                    console.log("db-org-tree root is null");
                    return;
                }
                //2.递归循环所有节点,将节点加入到父节点当中
                function getChildren(tree, parentId) {
                    let child = [];
                    tree.forEach((item) => {
                        if (item.parentId === parentId) {
                            let o = {
                                text: item.name,
                                attr: item,
                                children: [],
                                treeId: item.id
                            };
                            //当树是部门时,只有部门数据可以选择
                            o.canSelect = true;
                            if (!o.canSelect) {
                                o.iconClass = 'icon-state-default';
                            }
                            child.push(o);
                        }
                    });
                    child.forEach((item) => {
                        item.children = getChildren(tree, item.treeId);
                    });
                    return child;
                }

                //生成树结构数据
                root.children = getChildren(this.tree, root.treeId);
                this.parentNode = root;
                return [root];
            },
            listenerItemClick(item){
                //通知上级节点，发生变化
                this.$emit('itemClick', item);
            },
        }
    };
</script>
