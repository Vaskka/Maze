class UnionFindSetItem {
    constructor(value, obj) {
        this.value = value;
        this.obj = obj;
    }
}


class UnionFindSet {
    constructor(list) {
        // 内部数组
        this.inner = [];

        for (var i = 0; i < list.length; i++) {
            this.inner[i] = new UnionFindSetItem(i, list[i]);
        }
    }

    /**
     * 返回并查集的数目
     */
    count() {
        return this.inner.length;
    }

    /**
     * 使用路径压缩查找根节点对应的value
     * @param {Number} index 并查集内部Item的value
     */
    findRootValue(index) {
        if (this.inner[index].value == index) {
            return this.inner[index].value;
        }

        return this.inner[index].value = this.findRootValue(this.inner[index].value);
    }


    /**
     * 判断两个value是否属于一个root
     * @param {Number} index_a 并查集内部Item的value
     * @param {Number} index_b 并查集内部Item的value
     */
    isSameRoot(index_a, index_b) {
        return this.findRootValue(index_a) == this.findRootValue(index_b);
    }

    /**
     * 合并两个value
     * @param {Number} index_a 并查集内部Item的value
     * @param {Number} index_b 并查集内部Item的value
     */
    union(index_a, index_b) {
        var root_a = this.findRootValue(index_a);
        var root_b = this.findRootValue(index_b);

        // 已经在同一根节点下面
        if (root_a == root_b) {
            return 
        }
        
        this.inner[root_a].value = this.inner[root_b].value;
    }




    debug() {
        for (var i = 0; i < this.inner.length; i++) {
            console.log(this.inner[i].value);
        }

    }

}