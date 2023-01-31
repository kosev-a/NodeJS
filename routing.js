export const findRoute = (url = "", routes) => {
  if (url.endsWith("/")) url = url.substring(0, url.length - 1);
  if (routes[url]) {
    return [routes[url]];
  }
  // dynamic url
  const urlArr = url.substring(1).split("/");
  for (let [avl, cb] of Object.entries(routes)) {
    avl = avl.substring(1).split('/')
    let params = {};
    if (avl.length === urlArr.length) {
      let i = 0;
      while (i < avl.length) {
        if (avl[i].startsWith(":")) {
          params[avl[i].substring(1)] = urlArr[i];
        } else if (avl[i] !== urlArr[i]) {
          params = undefined;
          break;
        }
        i++;
      }
      if (params) {
        return [cb, params];
      }
    }
  }
  return [null]
};