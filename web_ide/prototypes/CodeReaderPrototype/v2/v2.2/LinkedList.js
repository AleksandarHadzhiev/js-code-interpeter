export default class LinkedList {
    constructor() {
        this.head = null;
        this.currentNode = null;
        this.size = 0;
        this.links = []
    }

    removeLastLink() {
        this.currentNode = this._getNodeAtLocation(this.size - 1)
        this.currentNode.prev.next = null
        this.currentNode = this.currentNode.prev
        this.links.pop()
    }

    removeLinkBetweenLines(link) {
        const idOfRemovedLine = link.id + 1;
        const lineAfterRemoved = idOfRemovedLine + 1;
        const next = this._getNodeAtLocation(lineAfterRemoved)
        const prev = this._getNodeAtLocation(link.id)
        //
        prev.next = next
        next.prev = prev
        if (link.id == 1) {
            this.head.next = next
        }
        else if (link.id = 0) {
            next.prev = this.head
            this.head.next = next
        }
        this.currentNode = prev
        console.log(this.currentNode)
    }

    updateContentAtSpecifiedPosition(node) {
        this.currentNode = this._getNodeAtLocation(node.id)
        if (this.size == 1)
            this.head = node;
        this.currentNode = node;
        this._updateLink(node)
    }

    addNodeToTheEnd(node) {
        this.currentNode = this._getNodeAtLocation(this.size - 1)
        console.log(this.currentNode)
        if (this.head == null)
            this._initList(node)
        else
            this.updateLastNode(node)
        this.size += 1;
        this.links.push(node)
    }

    _initList(node) {
        this.head = node
        this.currentNode = node
    }

    updateLastNode(node) {
        if (this.size == 1) {
            this.head.next = node;
        }
        this.currentNode.next = node;
        node.prev = this.currentNode;
        this.currentNode = node;
    }


    addNodeInBetweenNodes(newNode) {
        this.currentNode = this._getNodeAtLocation(newNode.id)
        console.log(newNode)
        let node = this._updateNodePositions(newNode)
        console.log(node)
        this._updateTheNodesWhichTheNodeIsInBetween(node)
        this.currentNode = node
    }

    _updateNodePositions(node) {
        node.prev = this.currentNode.prev
        node.next = this.currentNode.next
        return node
    }

    _updateTheNodesWhichTheNodeIsInBetween(node) {
        console.log(node)
        console.log(this.currentNode)
        this.currentNode.next.prev = node
        this.currentNode.prev.next = node
    }

    _getNodeAtLocation(location) {
        if (this.links.length != 0)
            return this.links[location]
        return null
    }

    _updateLinks(node) {
        for (let index = 0; index < array.length; index++) {
            const element = array[index];

        }
    }

    _updateLink(node) {
        this.links[node.id] = node
    }
}