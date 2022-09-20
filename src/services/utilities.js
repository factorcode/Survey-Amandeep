
export const  getArrayData = (obj) =>{

    let result = [];

    Object.keys(obj).map((key) => {
        let node = {}
        node[String(key)] = obj[key];
        result.push(node);

    });
    return result;
  }