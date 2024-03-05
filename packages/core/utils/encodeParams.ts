export const encodeParams = (param: string) =>
  String(param).replace(
    /[^A-Za-z0-9\-._~!$&'()*+,;=:@]/g,
    function (char: string) {
      return '%' + char.charCodeAt(0).toString(16).toUpperCase();
    }
  );
