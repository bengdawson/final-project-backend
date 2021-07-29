api.get("/greet", function (request) {
  var superb = require("superb");
  return request.queryString.name + " is " + superb.random();
});
