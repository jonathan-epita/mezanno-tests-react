
const xmlToJson = (xmlString) => {
    const records = Array.from(xmlString.getElementsByTagName("srw:record")).map((record) => {
        const dataNode = record.getElementsByTagName("srw:recordData")[0];
        const extraDataNode = record.getElementsByTagName("srw:extraRecordData")[0];

        const getNodeText = (node, tagName, namespace = "dc") => {
            const n = node.getElementsByTagName(`${namespace}:${tagName}`)[0];
            return n ? n.textContent.trim() : null;
        };

        const getExtraData = (node, tagName) => {
            const n = node.getElementsByTagName(tagName)[0];
            return n ? n.textContent.trim() : null;
        };

        return {
            creator: getNodeText(dataNode, "creator"),
            date: getNodeText(dataNode, "date"),
            format: Array.from(dataNode.getElementsByTagName("dc:format")).map((n) => n.textContent.trim()),
            identifier: getNodeText(dataNode, "identifier"),
            language: getNodeText(dataNode, "language"),
            title: getNodeText(dataNode, "title"),
            subject: Array.from(dataNode.getElementsByTagName("dc:subject")).map((n) => n.textContent.trim()),
            type: Array.from(dataNode.getElementsByTagName("dc:type")).map((n) => n.textContent.trim()),
            thumbnail: getExtraData(extraDataNode, "thumbnail"),
            highres: getExtraData(extraDataNode, "highres"),
            lowres: getExtraData(extraDataNode, "lowres"),
            medres: getExtraData(extraDataNode, "medres"),
            provenance: getExtraData(extraDataNode, "provenance"),
        };
    });
    return records;
};

export {xmlToJson};
