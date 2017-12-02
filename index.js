const viacomQL = {
  gql(query) {
    var result = "$";
    if (Object.keys(query).length == 0) result += ".";
    else {
      const recurse = obj => {
        // console.log(obj);
        const child = obj.child;
        const index = obj.index;
        const suffix = index !== undefined && index !== null ? `[${index}]` : '';
        if (child != null) {
          result += `${obj.name + suffix}.`;
          recurse(child);
        } else {
          result += obj.name + suffix;
        }
      };
      recurse(query);
    }

    return result;
  }
};

module.exports = viacomQL;
